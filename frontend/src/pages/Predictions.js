import React from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, LinearProgress, Box, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Predictions = () => {
  const constituencyPredictions = [
    {
      name: 'Kolkata North',
      predictedWinner: 'TMC',
      confidence: 75,
      voteShare: { TMC: 45.5, BJP: 35.2, CPM: 12.1, Congress: 7.2 }
    },
    {
      name: 'Kolkata South',
      predictedWinner: 'TMC',
      confidence: 68,
      voteShare: { TMC: 42.8, BJP: 38.5, CPM: 10.2, Congress: 8.5 }
    },
    {
      name: 'Asansol',
      predictedWinner: 'BJP',
      confidence: 72,
      voteShare: { BJP: 44.2, TMC: 38.1, CPM: 11.5, Congress: 6.2 }
    },
    {
      name: 'Howrah',
      predictedWinner: 'TMC',
      confidence: 80,
      voteShare: { TMC: 48.3, BJP: 32.1, CPM: 13.2, Congress: 6.4 }
    }
  ];

  const overallPolling = [
    { party: 'TMC', percentage: 38.5, seats: 165 },
    { party: 'BJP', percentage: 35.2, seats: 110 },
    { party: 'CPM', percentage: 15.1, seats: 15 },
    { party: 'Congress', percentage: 8.7, seats: 4 },
    { party: 'Others', percentage: 2.5, seats: 0 }
  ];

  const swingAnalysis = [
    { constituency: 'Kolkata North', swing: 'TMC to BJP: -3.2%', type: 'negative' },
    { constituency: 'Asansol', swing: 'BJP to TMC: +2.1%', type: 'positive' },
    { constituency: 'Howrah', swing: 'TMC holding: +1.5%', type: 'positive' },
    { constituency: 'Durgapur', swing: 'CPM to BJP: -4.1%', type: 'negative' }
  ];

  const getPartyColor = (party) => {
    const colors = {
      TMC: '#00C49F',
      BJP: '#FF8042',
      CPM: '#FFBB28',
      Congress: '#8884d8'
    };
    return colors[party] || '#82ca9d';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Election Predictions
      </Typography>

      {/* Overall Prediction */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overall State Prediction
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallPolling}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="party" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Projected Seat Distribution
            </Typography>
            {overallPolling.map((party) => (
              <Box key={party.party} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{party.party}</Typography>
                  <Typography variant="body2">{party.seats} seats</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(party.seats / 294) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>

      {/* Constituency Predictions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Constituency Predictions
        </Typography>
        <Grid container spacing={3}>
          {constituencyPredictions.map((constituency, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {constituency.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      Predicted Winner:
                    </Typography>
                    <Chip
                      label={constituency.predictedWinner}
                      sx={{ backgroundColor: getPartyColor(constituency.predictedWinner), color: 'white' }}
                    />
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    Confidence: {constituency.confidence}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={constituency.confidence}
                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                  />

                  <Typography variant="subtitle2" gutterBottom>
                    Vote Share Prediction:
                  </Typography>
                  {Object.entries(constituency.voteShare).map(([party, share]) => (
                    <Box key={party} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{party}</Typography>
                      <Typography variant="body2">{share}%</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Swing Analysis */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Swing Analysis
        </Typography>
        <Grid container spacing={2}>
          {swingAnalysis.map((swing, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ backgroundColor: swing.type === 'positive' ? '#e8f5e8' : '#ffeaea' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {swing.constituency}
                  </Typography>
                  <Typography variant="body2">
                    {swing.swing}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Model Information
          </Typography>
          <Typography variant="body2">
            Last Updated: December 5, 2023 | Accuracy Rate: 87.3% | 
            Data Sources: Polls, Social Media, News Articles, Historical Trends
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Predictions;