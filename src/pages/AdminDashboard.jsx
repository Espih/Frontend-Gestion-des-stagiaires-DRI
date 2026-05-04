import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Card, CardContent, Grid, CircularProgress, Alert, Select, FormControl, InputLabel, Container,
  Tabs, Tab
} from '@mui/material';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Navbar from '../components/Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({ en_attente: 0, confirme: 0, annule: 0, modifie: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editRdv, setEditRdv] = useState(null);
  const [editForm, setEditForm] = useState({ date_rdv: '', heure_rdv: '', agent_id: '', statut: '' });

  // ========== NOUVEAUX ÉTATS POUR LA GESTION DES UTILISATEURS ==========
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ nom: '', email: '', role: '' });
  const [tabValue, setTabValue] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentification requise. Veuillez vous connecter.');
          setLoading(false);
          return;
        }

        await axios.delete('http://localhost:5000/api/rendezvous/past', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Rendez-vous passés supprimés avec succès');

        const [rdvRes, motifsRes, agentsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/rendezvous', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/rendezvous/motifs'),
          axios.get('http://localhost:5000/api/rendezvous/agents'),
        ]);
        setRendezvous(rdvRes.data);
        setMotifs(motifsRes.data);
        setAgents(agentsRes.data);

        const stats = rdvRes.data.reduce((acc, rdv) => {
          acc[rdv.statut] = (acc[rdv.statut] || 0) + 1;
          return acc;
        }, { en_attente: 0, confirme: 0, annule: 0, modifie: 0 });
        setStats(stats);
      } catch (err) {
        setError(`Erreur lors du chargement ou de la suppression : ${err.response?.data?.message || err.message}`);
        console.error('Erreur fetch ou suppression:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ========== FONCTION POUR CHARGER LES UTILISATEURS ==========
  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(`Erreur lors du chargement des utilisateurs : ${err.response?.data?.message || err.message}`);
      console.error('Erreur fetch users:', err.response?.data || err);
    } finally {
      setUserLoading(false);
    }
  };

  // Charger les utilisateurs quand on passe à l'onglet utilisateurs
  useEffect(() => {
    if (tabValue === 1 && users.length === 0) {
      fetchUsers();
    }
  }, [tabValue]);

  const handleEditOpen = (rdv) => {
    setEditRdv(rdv);
    setEditForm({
      date_rdv: rdv.date_rdv,
      heure_rdv: rdv.heure_rdv.slice(0, 5),
      agent_id: rdv.agent_id,
      statut: rdv.statut,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'heure_rdv' ? value.slice(0, 5) : value,
    }));
  };

  const handleEditSubmit = async () => {
    if (!editRdv) return;
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...editForm,
        date_rdv: new Date(editForm.date_rdv).toISOString().split('T')[0],
        statut: editForm.statut === 'modifie' ? 'modifie' : editForm.statut,
      };
      console.log('Payload envoyé:', payload);
      await axios.put(`http://localhost:5000/api/rendezvous/${editRdv.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRendezvous((prev) =>
        prev.map((r) => (r.id === editRdv.id ? { ...r, ...payload } : r))
      );
      setStats((prev) => {
        const newStats = { ...prev };
        newStats[editRdv.statut]--;
        newStats[editForm.statut]++;
        return newStats;
      });
      setEditRdv(null);
    } catch (err) {
      setError(`Erreur lors de la modification : ${err.response?.data?.message || err.message}`);
      console.error('Erreur PUT:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // ========== FONCTIONS POUR LA GESTION DES UTILISATEURS ==========
  const handleEditUserOpen = (user) => {
    setEditUser(user);
    setEditUserForm({
      nom: user.nom,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditUserSubmit = async () => {
    if (!editUser) return;
    setError('');
    setUserLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${editUser.id}`, editUserForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Mettre à jour la liste des utilisateurs
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...editUserForm } : u))
      );
      
      setEditUser(null);
      setError('');
    } catch (err) {
      setError(`Erreur lors de la modification de l'utilisateur : ${err.response?.data?.message || err.message}`);
      console.error('Erreur PUT user:', err.response?.data || err);
    } finally {
      setUserLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(''); // Réinitialiser les erreurs lors du changement d'onglet
  };

  const statByMotif = motifs.map((motif) => ({
    label: motif.libelle,
    value: rendezvous.filter((rdv) => rdv.motif_id === motif.id).length,
  }));

  const statByAgent = agents.map((agent) => ({
    label: agent.nom,
    value: rendezvous.filter((rdv) => rdv.agent_id === agent.id).length,
  }));

  const statByStatusToday = {
    en_attente: rendezvous.filter(
      (rdv) => rdv.statut === 'en_attente' && rdv.date_rdv === new Date().toISOString().split('T')[0]
    ).length,
    confirme: rendezvous.filter(
      (rdv) => rdv.statut === 'confirme' && rdv.date_rdv === new Date().toISOString().split('T')[0]
    ).length,
    annule: rendezvous.filter(
      (rdv) => rdv.statut === 'annule' && rdv.date_rdv === new Date().toISOString().split('T')[0]
    ).length,
    modifie: rendezvous.filter(
      (rdv) => rdv.statut === 'modifie' && rdv.date_rdv === new Date().toISOString().split('T')[0]
    ).length,
  };

  const statModifByDay = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return rendezvous.filter(
        (rdv) => rdv.statut === 'modifie' && rdv.date_rdv === date.toISOString().split('T')[0]
      ).length;
    })
    .reverse();

  const pieDataMotif = {
    labels: statByMotif.map((s) => s.label),
    datasets: [
      {
        data: statByMotif.map((s) => s.value),
        backgroundColor: ['#099488', '#26A69A', '#4DB6AC', '#80CBC4', '#B2DFDB'],
      },
    ],
  };

  const barDataAgent = {
    labels: statByAgent.map((s) => s.label),
    datasets: [
      {
        label: 'Rendez-vous par agent',
        data: statByAgent.map((s) => s.value),
        backgroundColor: 'rgba(9, 148, 136, 0.6)',
        borderColor: 'rgba(9, 148, 136, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutDataToday = {
    labels: ['En attente', 'Confirmé', 'Annulé', 'Modifié'],
    datasets: [
      {
        data: [
          statByStatusToday.en_attente,
          statByStatusToday.confirme,
          statByStatusToday.annule,
          statByStatusToday.modifie,
        ],
        backgroundColor: ['#099488', '#26A69A', '#D32F2F', '#FFB300'],
      },
    ],
  };

  const lineDataModif = {
    labels: Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      }),
    datasets: [
      {
        label: 'Modifications par jour',
        data: statModifByDay,
        borderColor: '#099488',
        backgroundColor: 'rgba(9, 148, 136, 0.2)',
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="main-wrapper" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <Container maxWidth={false} sx={{ py: 5, px: { xs: 1, md: 2 } }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#099488', textAlign: 'center' }}>
          Tableau de bord Administrateur
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: 'auto', maxWidth: '1000px' }}>
            {error}
          </Alert>
        )}

        {/* ========== ONGLETS POUR NAVIGATION ========== */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Rendez-vous" sx={{ fontWeight: 'bold', color: '#099488' }} />
            <Tab label="Gestion des utilisateurs" sx={{ fontWeight: 'bold', color: '#099488' }} />
          </Tabs>
        </Box>

        {/* ========== ONGLET RENDEZ-VOUS (CODE EXISTANT) ========== */}
        {tabValue === 0 && (
          <>
            {/* Statistiques globales */}
            <Grid container spacing={2} sx={{ mb: 5, mx: 'auto', width: '100%', justifyContent: 'space-between' }}>
              {Object.entries(stats).map(([key, value]) => (
                <Grid item xs={6} sm={3} key={key} sx={{ flexGrow: 1, minWidth: '200px' }}>
                  <Card sx={{ minHeight: '120px', boxShadow: 3, bgcolor: '#fff', p: 1 }}>
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: '#555', textTransform: 'uppercase' }}>
                        {key.replace('_', ' ')}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#099488', fontWeight: 'bold' }}>
                        {value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Statistiques graphiques */}
            <Grid container spacing={3} sx={{ mb: 5, mx: 'auto' }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, bgcolor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                      Répartition par motif
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Pie data={pieDataMotif} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, bgcolor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                      Rendez-vous par agent
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Bar data={barDataAgent} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, bgcolor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                      Statuts aujourd'hui
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Doughnut data={doughnutDataToday} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, bgcolor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                      Modifications sur 7 jours
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Line data={lineDataModif} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tableau des rendez-vous */}
            <Card sx={{ boxShadow: 3, bgcolor: '#fff', mx: 'auto', maxWidth: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, color: '#099488', textAlign: 'center' }}>
                  Liste des rendez-vous
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#099488' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Référence</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Contribuable</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Téléphone</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Motif</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Agent</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Heure</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Statut</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rendezvous.map((rdv) => (
                        <TableRow key={rdv.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell>{rdv.reference}</TableCell>
                          <TableCell>{rdv.contribuable_nom}</TableCell>
                          <TableCell>{rdv.contribuable_email}</TableCell>
                          <TableCell>{rdv.telephone}</TableCell>
                          <TableCell>{motifs.find((m) => m.id === rdv.motif_id)?.libelle || 'N/A'}</TableCell>
                          <TableCell>{agents.find((a) => a.id === rdv.agent_id)?.nom || 'N/A'}</TableCell>
                          <TableCell>{rdv.date_rdv}</TableCell>
                          <TableCell>{rdv.heure_rdv}</TableCell>
                          <TableCell>{rdv.statut}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
                              onClick={() => handleEditOpen(rdv)}
                            >
                              Modifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* ========== ONGLET GESTION DES UTILISATEURS (NOUVEAU) ========== */}
        {tabValue === 1 && (
          <Card sx={{ boxShadow: 3, bgcolor: '#fff', mx: 'auto', maxWidth: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, color: '#099488', textAlign: 'center' }}>
                Gestion des utilisateurs
              </Typography>
              
              {userLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#099488' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nom</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Rôle</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.nom}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: user.role === 'admin' ? '#D32F2F' : '#099488',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}
                            >
                              {user.role}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
                              onClick={() => handleEditUserOpen(user)}
                            >
                              Modifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de modification rendez-vous */}
        <Dialog open={!!editRdv} onClose={() => setEditRdv(null)}>
          <DialogTitle>Modifier le rendez-vous {editRdv?.reference}</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              name="date_rdv"
              type="date"
              value={editForm.date_rdv}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Heure"
              name="heure_rdv"
              type="time"
              value={editForm.heure_rdv}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Agent</InputLabel>
              <Select
                name="agent_id"
                value={editForm.agent_id}
                onChange={handleEditChange}
                label="Agent"
              >
                <MenuItem value="">Sélectionner un agent</MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>{agent.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={editForm.statut}
                onChange={handleEditChange}
                label="Statut"
              >
                <MenuItem value="en_attente">En attente</MenuItem>
                <MenuItem value="confirme">Confirmé</MenuItem>
                <MenuItem value="annule">Annulé</MenuItem>
                <MenuItem value="modifie">Modifié</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditRdv(null)} sx={{ color: '#555' }}>Annuler</Button>
            <Button
              onClick={handleEditSubmit}
              disabled={loading}
              variant="contained"
              sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* ========== MODAL DE MODIFICATION UTILISATEUR (NOUVEAU) ========== */}
        <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              name="nom"
              value={editUserForm.nom}
              onChange={handleEditUserChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={editUserForm.email}
              onChange={handleEditUserChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={editUserForm.role}
                onChange={handleEditUserChange}
                label="Rôle"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)} sx={{ color: '#555' }}>Annuler</Button>
            <Button
              onClick={handleEditUserSubmit}
              disabled={userLoading}
              variant="contained"
              sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;