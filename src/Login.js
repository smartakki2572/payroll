import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper,
  Grid, Link, Divider, Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  const [formData, setFormData] = useState({
    email: 'a@a.com',
    password: 'abcd'
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate(); // 👈 Add this here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard'); // 👈 Redirect on success
    } else {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 8
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Log in to access your payroll dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" color="primary">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
