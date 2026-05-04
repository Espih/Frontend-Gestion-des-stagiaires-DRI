
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container, 
  CssBaseline, 
  Grid, 
  CircularProgress, 
  Button,
  Fade,
  Grow,
  Paper,
  Chip
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
  Visibility,
  ReportProblem,
  Security,
  Phone,
  TrendingUp,
  CheckCircle
} from '@mui/icons-material';
import './HomePage.css';
import Navbar from '../components/Navbar';
import logos from '../assets/controlleur.jpeg';
import inspecteur from '../assets/inspecteur.jpg';
import axios from 'axios';

// Composants stylés
const HeroSection = styled(Box)(({ theme }) => ({
  background: '#2c3e50',
  color: 'white',
  padding: theme.spacing(5, 2),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1
  },
  '& .hero-content': {
    position: 'relative',
    zIndex: 2
  }
}));

const StyledCard = styled(Card)(({ theme, isSelected }) => ({
  maxWidth: isSelected ? '360px' : '280px',
  minHeight: '350px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: isSelected ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(8px)',
  cursor: 'pointer',
  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
  zIndex: isSelected ? 10 : 1,
  '&:hover': {
    transform: isSelected ? 'scale(1.1)' : 'translateY(-4px) scale(1.02)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  '& .card-img': {
    width: '80%',
    height: '100px',
    objectFit: 'contain',
    transition: 'transform 0.3s ease',
    display: 'block',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      height: '80px',
      width: '90%',
    }
  },
  '&:hover .card-img': {
    transform: 'scale(1.05)'
  }
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.95)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    minHeight: '280px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '3px',
    background: '#2c3e50',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    '&::before': {
      transform: 'translateX(0)'
    }
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1, 2.5),
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  background: '#2c3e50',
  color: 'white',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.7, 2),
  },
  '&:hover': {
    background: '#34495e',
    transform: 'scale(1.03)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#34495e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: 'clamp(1.6rem, 3.5vw, 2rem)',
    },
    h4: {
      fontWeight: 600,
      fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
    },
    h5: {
      fontWeight: 600,
      fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
    },
    body1: {
      fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
    }
  },
});

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Data fetched successfully');
      } catch (err) {
        console.error('Erreur fetch motifs/agents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setTimeout(() => {
      setVisibleCards({ card1: true });
      setTimeout(() => setVisibleCards(prev => ({ ...prev, card2: true })), 150);
      setTimeout(() => setVisibleCards(prev => ({ ...prev, card3: true })), 300);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (index) => {
    setSelectedCard(selectedCard === index ? null : index);
  };

  const inspecteurs = [
    {
      image: logos,
      titre: 'Manara-maso',
      description: "Zo-nao ny manara-maso sy mahafantatra ny hetra efa nalohanao na ny mbola tokony ho alohanao. Takio hatrany ny rosian'ny fandoavam-bola mba ho fanamarinana ny vola naloanao",
      icon: <Visibility />
    },
    {
      image: inspecteur,
      titre: 'Mitaraina',
      description: "Aznao atao ihany koa ny mitaraina amin'ny tompon'andraikitra ato amin'ny sampampandoavan-ketra raha matsikaritra zavatra na fomba fiasa tsy mifanaraka amin'ny tokony ho izy",
      icon: <ReportProblem />
    },
    {
      image: logos,
      titre: 'Mitoroka tranga kolikoly',
      description: "Zo-nao ny mitoroka raha mahita trangana kolikoly mandritran'ny fotoana hikarakarànao zavatra ato amin'ny sampampandoavan-ketra, ary tadidio fa mijanona ho tsiambaratelo hatrany izany. Aza matahotra mihintsy ny manontany raha misy zavatra hafahafa tsy dia mazava aminao",
      icon: <Security />
    }
  ];

  const services = [
    {
      title: 'Filan-kevitra',
      description: 'Raha misy zavatra manitikitika anao mikasika ny fandoavan-ketra dia azonao atao ny manantona ifotony na mandefa hafatra amin\'ny rohy izay itanao etsy ambany ahafahanao mahafantatra bebe kokoa ary ahafahanao mahazo valiny mahafa-po amin\'izay fanontaniana manitikitika anao ka mifandraiky amin\'ny resaka hetra',
      icon: <Phone />,
      color: '#ecf0f1'
    },
    {
      title: 'Fanaraha-maso',
      description: 'Ny sampampandoavan-ketra dia manara-maso ihany koa ny fomba fandoavan-ketra izay ataon\'ny olom-pirenena rehetra ary manoro hevitra raha misy tsy fahatomombanana ny fandoavan-ketra.',
      icon: <TrendingUp />,
      color: '#dfe6e9'
    },
    {
      title: 'Fandoavan-ketra',
      description: 'Misy karazany maro ny hetra misy eto amintsika ka afaka alohan\'ny olom-pirenena tsirairay avy izany. Afaka manantona ifotony raha te hahafantatra bebe kokoa ny sokajin\'hetra mis eto Madagasikara.',
      icon: <CheckCircle />,
      color: '#b2bec3'
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="main-wrapper">
        <Navbar />

        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <Box className="hero-content" textAlign="center">
              <Fade in={true} timeout={400}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    [theme.breakpoints.down('sm')]: {
                      fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
                    }
                  }}
                >
                  SAMPAM-PANDOAVAN-KETRA MANAKAIKY ANAO
                </Typography>
              </Fade>
              
              <Fade in={true} timeout={800}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    opacity: 0.9,
                    maxWidth: '700px',
                    margin: '0 auto',
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '100%',
                      fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
                    }
                  }}
                >
                  Fantaro izay tokony ho zo-nao mikasika ny fandoavan-ketra
                </Typography>
              </Fade>
            </Box>
          </Container>
        </HeroSection>

        {/* Section Cartes Inspecteur */}
        <Container sx={{ py: 5, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Ireo zo-nao
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '500px', margin: '0 auto' }}>
              Fantaro ny zo-nao rehetra mikasika ny fandoavan-ketra
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: { xs: 'wrap', md: 'nowrap' }, 
              justifyContent: 'center', 
              gap: { xs: 1.5, sm: 2, md: 3 },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'stretch' }
            }}
          >
            {inspecteurs.map((item, index) => {
              const cardVisible = visibleCards[`card${index + 1}`];
              return (
                <Grow
                  key={index}
                  in={cardVisible}
                  timeout={800}
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <StyledCard
                    isSelected={selectedCard === index}
                    onClick={() => handleCardClick(index)}
                  >
                    <Box position="relative">
                      <img
                        src={item.image}
                        alt={item.titre}
                        className="card-img"
                      />
                      <Box
                        position="absolute"
                        top={8}
                        right={8}
                        sx={{
                          background: 'rgba(255,255,255,0.9)',
                          borderRadius: '50%',
                          p: 0.8,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                          '& svg': {
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            color: '#2c3e50'
                          }
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2c3e50',
                          mb: 1
                        }}
                      >
                        {item.titre}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          lineHeight: 1.5,
                          mb: 1
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Chip 
                        label="Fantaro bebe kokoa" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                    </CardContent>
                  </StyledCard>
                </Grow>
              );
            })}
          </Box>
        </Container>

        {/* Section Services */}
        <Box sx={{ background: '#f8f9fa', py: 5 }}>
          <Container sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                Nos services
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Découvrez nos services pour vous accompagner
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in={true} timeout={800 + index * 150}>
                    <ServiceCard elevation={0}>
                      <Box textAlign="center" mb={1.5}>
                        <Box
                          sx={{
                            width: { xs: 44, sm: 48 },
                            height: { xs: 44, sm: 48 },
                            borderRadius: '50%',
                            background: service.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 1.5,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            '& svg': {
                              fontSize: { xs: '1.1rem', sm: '1.2rem' },
                              color: '#2c3e50'
                            }
                          }}
                        >
                          {service.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          gutterBottom 
                          sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}
                        >
                          {service.title}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        color="textSecondary"
                        sx={{ lineHeight: 1.6, textAlign: 'center', flexGrow: 1 }}
                      >
                        {service.description}
                      </Typography>
                    </ServiceCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;