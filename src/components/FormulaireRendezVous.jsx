import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import Navbar from './Navbar';

const FormulaireRendezVous = () => {
  const [formData, setFormData] = useState({
    contribuable_nom: "",
    contribuable_email: "",
    telephone: "",
    motif_id: "",
    agent_id: "",
    date_rdv: "",
    heure_rdv: "",
  });
  const [motifs, setMotifs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Liste des heures disponibles (matin et après-midi)
  const heuresDisponibles = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
    "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  // Fetch motifs et agents depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const motifsRes = await axios.get("http://localhost:5000/api/rendezvous/motifs");
        setMotifs(motifsRes.data);
        const agentsRes = await axios.get("http://localhost:5000/api/rendezvous/agents");
        setAgents(agentsRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des motifs ou agents.");
        console.error("Erreur fetch:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mettre à jour agent_id quand motif_id change
  useEffect(() => {
    if (formData.motif_id) {
      const selectedMotif = motifs.find(m => m.id === parseInt(formData.motif_id));
      if (selectedMotif && selectedMotif.agent_id) {
        setFormData(prev => ({
          ...prev,
          agent_id: selectedMotif.agent_id
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          agent_id: ""
        }));
        setError("Aucun agent associé à ce motif.");
      }
    }
  }, [formData.motif_id, motifs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.contribuable_nom.trim()) return "Le nom complet est requis.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contribuable_email)) return "Email invalide.";
    if (!formData.telephone.trim()) return "Le téléphone est requis.";
    if (!formData.motif_id) return "Veuillez sélectionner un motif.";
    if (!formData.agent_id) return "Aucun agent associé au motif.";
    const selectedDate = new Date(formData.date_rdv);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "La date doit être dans le futur.";
    if (!formData.heure_rdv) return "Veuillez sélectionner une heure.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const reference = `RDV-${Date.now()}`;
      const payload = { ...formData, statut: "en_attente", reference };
      console.log("📤 Envoi payload:", payload); // Debug
      const response = await axios.post("http://localhost:5000/api/rendezvous", payload);
      setSuccess("Rendez-vous enregistré avec succès ! Vous recevrez une confirmation par email.");
      setFormData({
        contribuable_nom: "",
        contribuable_email: "",
        telephone: "",
        motif_id: "",
        agent_id: "",
        date_rdv: "",
        heure_rdv: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l’enregistrement du rendez-vous.");
      console.error("❌ Erreur POST:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trouver le nom de l'agent pour affichage
  const selectedMotif = motifs.find(m => m.id === parseInt(formData.motif_id));
  const agentNom = selectedMotif?.agent_id
    ? agents.find(a => a.id === selectedMotif.agent_id)?.nom || "Agent non trouvé"
    : "";

  if (fetchLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="main-wrapper">
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 1000, mx: "auto" }}>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Nom complet"
          name="contribuable_nom"
          value={formData.contribuable_nom}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Email"
          name="contribuable_email"
          type="email"
          value={formData.contribuable_email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Téléphone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          select
          label="Motif"
          name="motif_id"
          value={formData.motif_id}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          <MenuItem value="">Sélectionner un motif</MenuItem>
          {motifs.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.libelle}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Agent Responsable"
          value={agentNom}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={formData.date_rdv ? dayjs(formData.date_rdv) : null}
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                date_rdv: newValue ? newValue.format("YYYY-MM-DD") : ""
              }));
            }}
            shouldDisableDate={(date) => {
              const day = date.day(); // 0 = dimanche, 6 = samedi
              return day === 0 || day === 6;
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth required margin="normal" />
            )}
          />
        </LocalizationProvider>

        <TextField
          select
          label="Heure"
          name="heure_rdv"
          value={formData.heure_rdv}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          <MenuItem value="">Sélectionner une heure</MenuItem>
          {heuresDisponibles.map((heure) => (
            <MenuItem key={heure} value={heure}>
              {heure}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || fetchLoading}
        >
          {loading ? <CircularProgress size={24} /> : "Enregistrer"}
        </Button>
      </Box>
    </Box>
  );
};

export default FormulaireRendezVous;
