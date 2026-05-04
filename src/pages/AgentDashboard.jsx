import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  FormControl, InputLabel, Select, Alert, CircularProgress
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [editRdv, setEditRdv] = useState(null);
  const [editForm, setEditForm] = useState({ date_rdv: '', heure_rdv: '', agent_id: '', statut: '' });
  const [changePasswordOpen, setChangePasswordOpen] = useState(false); // State for password change dialog
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' }); // State for password form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentification requise. Veuillez vous connecter.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/rendezvous', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRendezvous(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des données : ' + (err.response?.data?.message || err.message));
        console.error('Erreur fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditOpen = (rdv) => {
    setEditRdv(rdv);
    setEditForm({
      date_rdv: rdv.date_rdv || '',
      heure_rdv: rdv.heure_rdv ? rdv.heure_rdv.slice(0, 5) : '',
      agent_id: rdv.agent_id || '',
      statut: rdv.statut || 'en_attente',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
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
        date_rdv: editForm.date_rdv,
        heure_rdv: editForm.heure_rdv,
      };
      await axios.put(`http://localhost:5000/api/rendezvous/${editRdv.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRendezvous((prev) =>
        prev.map((r) => (r.id === editRdv.id ? { ...r, ...payload } : r))
      );
      setEditRdv(null);
    } catch (err) {
      setError('Erreur lors de la modification : ' + (err.response?.data?.message || err.message));
      console.error('Erreur PUT:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for password change
  const handlePasswordChangeOpen = () => {
    setChangePasswordOpen(true);
    setPasswordForm({ oldPassword: '', newPassword: '' });
    setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };
      await axios.put('http://localhost:5000/api/users/password', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChangePasswordOpen(false);
      setError('Mot de passe modifié avec succès');
    } catch (err) {
      setError('Erreur lors de la modification du mot de passe : ' + (err.response?.data?.message || err.message));
      console.error('Erreur PUT password:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="main-wrapper" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ py: 5, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#099488', textAlign: 'center' }}>
          Tableau de bord Agent
        </Typography>

        <Box sx={{ mb: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
            onClick={handlePasswordChangeOpen}
          >
            Changer le mot de passe
          </Button>
        </Box>

        {error && (
          <Alert severity={error.includes('succès') ? 'success' : 'error'} sx={{ mb: 3, mx: 'auto', maxWidth: '1000px' }}>
            {error}
          </Alert>
        )}

        {rendezvous.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun rendez-vous pour vous pour le moment.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, mx: { xs: 0, md: 2 } }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#099488' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Référence</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Contribuable</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Heure</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Agent</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rendezvous.map((rdv) => (
                  <TableRow key={rdv.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{rdv.reference}</TableCell>
                    <TableCell>{rdv.contribuable_nom}</TableCell>
                    <TableCell>{rdv.date_rdv}</TableCell>
                    <TableCell>{rdv.heure_rdv}</TableCell>
                    <TableCell>{rdv.statut}</TableCell>
                    <TableCell>{rdv.agent_nom || 'Non défini'}</TableCell>
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
        )}

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

        <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)}>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogContent>
            <TextField
              label="Ancien mot de passe"
              name="oldPassword"
              type="password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nouveau mot de passe"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              helperText="Le mot de passe doit contenir au moins 6 caractères"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordOpen(false)} sx={{ color: '#555' }}>Annuler</Button>
            <Button
              onClick={handlePasswordSubmit}
              disabled={loading || !passwordForm.oldPassword || !passwordForm.newPassword}
              variant="contained"
              sx={{ bgcolor: '#099488', '&:hover': { bgcolor: '#087a6f' } }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AgentDashboard;