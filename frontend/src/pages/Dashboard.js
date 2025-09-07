import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Sample data - in real app, this would come from API
  const sentimentData = [
    { date: '2023-12-01', positive: 45, negative: 25, neutral: 30 },
    { date: '2023-12-02', positive: 50, negative: 20, neutral: 30 },
    { date: '2023-12-03', positive: 48, negative: 22, neutral: 30 },
    { date: '2023-12-04', positive: 52, negative: 18, neutral: 30 },
    { date: '2023-12-05', positive: 55, negative: 15, neutral: 30 },
  ];

  const partyData = [
    { name: 'TMC', value: 38.5, color: '#00C49F' },
    { name: 'BJP', value: 35.2, color: '#FF8042' },
    { name: 'CPM', value: 15.1, color: '#FFBB28' },
    { name: 'Congress', value: 8.7, color: '#8884d8' },
    { name: 'Others', value: 2.5, color: '#82ca9d' },
  ];

  const stats = [
    { label: 'Articles Analyzed', value: '2,543' },
    { label: 'Social Posts', value: '15,672' },
    { label: 'Constituencies', value: '294' },
    { label: 'Accuracy Rate', value: '87.3%' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Political Intelligence Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sentiment Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="positive" stroke="#4caf50" name="Positive" />
                <Line type="monotone" dataKey="negative" stroke="#f44336" name="Negative" />
                <Line type="monotone" dataKey="neutral" stroke="#ff9800" name="Neutral" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Poll Standing
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {partyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Scraped 150 new articles from Bengali news sources
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Analyzed 500 social media posts for sentiment
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Updated election predictions for 10 constituencies
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Detected trending hashtag: #BengalPolitics2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;