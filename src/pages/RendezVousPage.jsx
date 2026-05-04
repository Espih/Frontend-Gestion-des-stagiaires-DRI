// src/pages/RendezVousPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import FormulaireRendezVous from '../components/FormulaireRendezVous';
import axios from 'axios';
import Navbar from '../components/Navbar';

const RendezVousPage = () => {
  const [motifs, setMotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotifs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/motifs");
        // motifs contiennent libelle + agent_nom
        setMotifs(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMotifs();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Box className="main-wrapper">
      <Navbar/>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Formulaire de Rendez-vous
        </Typography>
        <FormulaireRendezVous motifs={motifs} />
      </Container>
    </Box>
  );
};

export default RendezVousPage;
