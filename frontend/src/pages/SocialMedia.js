import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Tabs, Tab, Box, Chip, Card, CardContent } from '@mui/material';

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState(0);

  const twitterTrends = [
    { hashtag: '#BengalPolitics', volume: 5000, sentiment: 'Mixed' },
    { hashtag: '#WestBengal', volume: 3000, sentiment: 'Positive' },
    { hashtag: '#Kolkata', volume: 2500, sentiment: 'Neutral' },
    { hashtag: '#TMC', volume: 2000, sentiment: 'Positive' },
    { hashtag: '#BJP', volume: 1800, sentiment: 'Mixed' },
  ];

  const redditPosts = [
    {
      subreddit: 'r/kolkata',
      title: 'Discussion about upcoming municipal elections',
      upvotes: 150,
      comments: 45,
      sentiment: 'Neutral'
    },
    {
      subreddit: 'r/WestBengal',
      title: 'Infrastructure development in rural Bengal',
      upvotes: 89,
      comments: 23,
      sentiment: 'Positive'
    },
    {
      subreddit: 'r/india',
      title: 'Political situation in Bengal',
      upvotes: 234,
      comments: 67,
      sentiment: 'Mixed'
    }
  ];

  const platformAnalytics = {
    twitter: {
      totalPosts: 15672,
      sentimentBreakdown: { positive: 45, neutral: 35, negative: 20 },
      topHashtags: ['#BengalPolitics', '#Election2024', '#Democracy']
    },
    reddit: {
      totalPosts: 892,
      sentimentBreakdown: { positive: 52, neutral: 33, negative: 15 },
      topSubreddits: ['r/kolkata', 'r/WestBengal', 'r/india']
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Social Media Monitoring
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Twitter Trends" />
          <Tab label="Reddit Posts" />
          <Tab label="Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Twitter Trends Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Trending Hashtags in Bengal Politics
                </Typography>
              </Grid>
              {twitterTrends.map((trend, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {trend.hashtag}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Volume: {trend.volume.toLocaleString()} tweets
                      </Typography>
                      <Chip
                        label={`Sentiment: ${trend.sentiment}`}
                        color={
                          trend.sentiment === 'Positive' ? 'success' :
                          trend.sentiment === 'Negative' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Reddit Posts Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Popular Political Discussions on Reddit
                </Typography>
              </Grid>
              {redditPosts.map((post, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6">
                          {post.title}
                        </Typography>
                        <Chip
                          label={post.sentiment}
                          color={
                            post.sentiment === 'Positive' ? 'success' :
                            post.sentiment === 'Negative' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {post.subreddit}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="body2">
                          👍 {post.upvotes} upvotes
                        </Typography>
                        <Typography variant="body2">
                          💬 {post.comments} comments
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Analytics Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Twitter Analytics
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {platformAnalytics.twitter.totalPosts.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Posts Analyzed
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                      Sentiment Distribution:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Positive: ${platformAnalytics.twitter.sentimentBreakdown.positive}%`} color="success" size="small" />
                      <Chip label={`Neutral: ${platformAnalytics.twitter.sentimentBreakdown.neutral}%`} color="default" size="small" />
                      <Chip label={`Negative: ${platformAnalytics.twitter.sentimentBreakdown.negative}%`} color="error" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Reddit Analytics
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {platformAnalytics.reddit.totalPosts.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Posts Analyzed
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                      Sentiment Distribution:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Positive: ${platformAnalytics.reddit.sentimentBreakdown.positive}%`} color="success" size="small" />
                      <Chip label={`Neutral: ${platformAnalytics.reddit.sentimentBreakdown.neutral}%`} color="default" size="small" />
                      <Chip label={`Negative: ${platformAnalytics.reddit.sentimentBreakdown.negative}%`} color="error" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SocialMedia;