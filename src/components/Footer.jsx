import React, { useRef, useEffect } from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Google, Email } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix pour les icônes Leaflet qui ne s’affichent pas avec Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Coordonnées des lieux
const locations = [
  {
    name: "Ministère de l’Économie, des Finances et du Budget",
    position: [-18.90908, 47.52857],
    description: "Soarano / Ambondrona",
  },
  {
    name: "Direction Générale du Contrôle Financier",
    position: [-18.90956, 47.53108],
    description: "Faravohitra Ambony",
  },
];

// Composant pour ajuster la vue aux marqueurs
const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(locations.map((loc) => loc.position));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, locations]);
  return null;
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgb(9, 148, 136)',
        color: "white",
        mt: 4,
        pt: 4,
        pb: 2,
      }}
    >
      {/* Partie avec les 3 colonnes */}
      <Grid container spacing={4} justifyContent="center">
        {/* DGI */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            DGI
          </Typography>
          <Typography variant="subtitle1">
            DIRECTION GÉNÉRALE DES IMPOTS
          </Typography>
          <Typography variant="body2">
            Immeuble MFB, Antaninarenina <br />
            Antananarivo, 101, Madagascar
          </Typography>
          <Typography variant="body2">
            <strong>Tél:</strong> (020) xx-xxx-xx
          </Typography>
          <Typography variant="body2">
            <strong>E-mail:</strong>{" "}
            <Link
              href="mailto:dgimpots@moov.mg"
              color="inherit"
              underline="hover"
            >
              dgimpots@moov.mg
            </Link>
          </Typography>
        </Grid>

        {/* SSIF */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            SSIF
          </Typography>
          <Typography variant="subtitle1">
            SERVICE DU SYSTÈME D'INFORMATION FISCALE
          </Typography>
          <Typography variant="body2">
            Mandrosoa, Ambohijatovo <br />
            Antananarivo, 101, Madagascar
          </Typography>
          <Typography variant="body2">
            <strong>Tél:</strong> (8h à 16h) 034 49 431 52, 032 12 011 74
          </Typography>
          <Typography variant="body2">
            <strong>E-mail:</strong>{" "}
            <Link
              href="mailto:impot.ssif.hotline@gmail.com"
              color="inherit"
              underline="hover"
            >
              impot.ssif.hotline@gmail.com
            </Link>
          </Typography>
        </Grid>

        {/* Notre site */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            NOTRE SITE
          </Typography>
          <Typography variant="subtitle1">SITE WEB</Typography>
          <Typography variant="body2">
            <Link href="http://www.impots.mg" color="inherit" underline="hover">
              www.impots.mg
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link
              href="http://nifonline.impots.mg"
              color="inherit"
              underline="hover"
            >
              nifonline.impots.mg
            </Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Réseaux sociaux */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Social
        </Typography>
        <IconButton color="inherit" href="#">
          <Facebook />
        </IconButton>
        <IconButton color="inherit" href="#">
          <Twitter />
        </IconButton>
        <IconButton color="inherit" href="#">
          <Google />
        </IconButton>
        <IconButton color="inherit" href="mailto:dgimpots@moov.mg">
          <Email />
        </IconButton>
      </Box>

      {/* Carte Leaflet avec marqueurs */}
      <Box sx={{ mt: 3, textAlign: "center", height: "300px" }}>
        <MapContainer
          center={[-18.90908, 47.52857]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc, idx) => (
            <Marker key={idx} position={loc.position}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                {loc.description}
              </Popup>
            </Marker>
          ))}
          <FitBounds locations={locations} />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Footer;
