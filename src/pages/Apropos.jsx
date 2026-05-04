import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f7f7", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">

        <Paper elevation={3} sx={{ p: 4, borderTop: "6px solid #099488" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#099488", mb: 2 }}>
            À propos du site et le developpement
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, textAlign: "justify" }}>
            Ce site est une plateforme de gestion de rendez-vous fiscaux développée dans le cadre
            du stage pour le memoire de fin de cycle de licence effectué au sein de la Direction Régionale des Impôts Haute Matsiatra.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, textAlign: "justify" }}>
            L’objectif principal de ce système est de moderniser et simplifier la prise de rendez-vous
            entre les contribuables et les services fiscaux, afin d’améliorer l’efficacité administrative
            et de réduire les déplacements inutiles.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Section mission */}
          <Typography variant="h6" sx={{ color: "#099488", fontWeight: "bold", mb: 1 }}>
            Mission du système
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            - Faciliter la prise de rendez-vous en ligne<br />
            - Améliorer la gestion interne des agents fiscaux<br />
            - Réduire les files d’attente et les délais de traitement<br />
            - Digitaliser les services fiscaux locaux
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Technologies */}
          <Typography variant="h6" sx={{ color: "#099488", fontWeight: "bold", mb: 1 }}>
            Technologies utilisées
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Frontend : React.js, Material UI, Bootstrap, HTML5, CSS3<br />
            Backend : Node.js / Express.js<br />
            Base de données : MySQL (XAMPP)
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Conclusion */}
          <Typography variant="h6" sx={{ color: "#099488", fontWeight: "bold", mb: 1 }}>
            Note
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Ce projet a été conçu dans un contexte académique et administratif, et peut évoluer
            pour intégrer de nouvelles fonctionnalités telles que les statistiques
            et l’optimisation des flux de rendez-vous.
          </Typography>

        </Paper>

        {/* Footer simple */}
        <Typography variant="caption" display="block" align="center" sx={{ mt: 3, color: "gray" }}>
          © Direction Régionale des Impôts Haute Matsiatra
        </Typography>

      </Container>
    </Box>
  );
};

export default Apropos;