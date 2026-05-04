import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Tabs, Tab, Alert, Link, CircularProgress, FormControlLabel, Checkbox
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';

const USE_MOCK = false;

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'agent' ? 'agent' : 'admin';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const qpRole = params.get('role');
    if (qpRole === 'admin' || qpRole === 'agent') setRole(qpRole);
  }, [params]);

  const tabIndex = useMemo(() => (role === 'admin' ? 0 : 1), [role]);

  const handleTabChange = (_e, newIndex) => {
    const newRole = newIndex === 0 ? 'admin' : 'agent';
    setRole(newRole);
    navigate(`/login?role=${newRole}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (USE_MOCK) {
        const token = 'mock-token';
        const nom = role === 'admin' ? 'Admin Démo' : 'Agent Démo';
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('nom', nom);
        navigate(role === 'admin' ? '/admin' : '/agent', { replace: true });
        return;
      }

      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        mot_de_passe: motDePasse,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('nom', user.nom);
      localStorage.setItem('email', user.email);
      localStorage.setItem('userId', user.id);

      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'agent') navigate('/agent', { replace: true });
      else setError("Rôle inconnu renvoyé par le serveur.");
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur de connexion';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="main-wrapper"
    >
      <Navbar />
      <Container
        maxWidth="xs"
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, color: '#1a3c34' }}
          >
            Connexion
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: '#1a3c34',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#099488',
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#099488',
              },
            }}
          >
            <Tab label="Admin" />
            <Tab label="Agent" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#099488',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#099488',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#1a3c34',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#099488',
                },
              }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              required
              margin="normal"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#099488',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#099488',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#1a3c34',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#099488',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: '#099488',
                    '&.Mui-checked': {
                      color: '#099488',
                    },
                  }}
                />
              }
              label="Se souvenir de moi"
              sx={{ color: '#1a3c34', mt: 1 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: '#099488',
                color: '#ffffff',
                borderRadius: 2,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#077a6f',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(9, 148, 136, 0.3)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  backgroundColor: '#d1d5db',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#ffffff' }} />
              ) : (
                `Se connecter ${role === 'admin' ? '(Admin)' : '(Agent)'}`
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#1a3c34' }}>
                Besoin d’aide ?{' '}
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ color: '#099488', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Retour à l’accueil
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}