import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Button, TextField, Chip, Box } from '@mui/material';

const NewsAnalytics = () => {
  const [urls, setUrls] = useState('');
  const [keywords, setKeywords] = useState(['bengal', 'politics', 'election']);
  const [newKeyword, setNewKeyword] = useState('');

  const sampleArticles = [
    {
      title: 'Bengal Assembly Session Updates',
      source: 'Anandabazar Patrika',
      sentiment: 'Neutral',
      confidence: 0.78,
      date: '2023-12-05'
    },
    {
      title: 'Political Rally in Kolkata',
      source: 'The Telegraph',
      sentiment: 'Positive',
      confidence: 0.85,
      date: '2023-12-04'
    },
    {
      title: 'Opposition Party Meeting',
      source: 'Ei Samay',
      sentiment: 'Negative',
      confidence: 0.72,
      date: '2023-12-03'
    }
  ];

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        News Analytics
      </Typography>

      {/* Scraping Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          News Scraping Configuration
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="URLs to Scrape (one per line)"
              multiline
              rows={4}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://www.anandabazar.com&#10;https://eisamay.indiatimes.com"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Target Keywords
            </Typography>
            <Box sx={{ mb: 2 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Add keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button variant="outlined" onClick={handleAddKeyword}>
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" sx={{ mr: 2 }}>
            Start Scraping
          </Button>
          <Button variant="outlined">
            Schedule Scraping
          </Button>
        </Box>
      </Paper>

      {/* Recent Articles */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recently Analyzed Articles
        </Typography>
        
        <Grid container spacing={2}>
          {sampleArticles.map((article, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.source} • {article.date}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Chip
                      label={article.sentiment}
                      color={
                        article.sentiment === 'Positive' ? 'success' :
                        article.sentiment === 'Negative' ? 'error' : 'default'
                      }
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2">
                      Confidence: {(article.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default NewsAnalytics;