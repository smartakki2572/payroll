import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from './AuthContext';

function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [settings, setSettings] = useState({
    businessSettings: {
      businessName: '',
      address: '',
      contactNumber: '',
      email: '',
      taxId: ''
    },
    workingHours: {
      regularHoursPerDay: 8,
      workingDaysPerWeek: 6,
      overtimeMultiplier: 1.5
    },
    paymentSettings: {
      salaryCalculationPeriod: 'monthly',
      paymentDay: 1,
      autoCalculate: true
    },
    notificationSettings: {
      enableEmailNotifications: true,
      notifyOnAttendanceIssues: true,
      notifyBeforePayday: true
    },
    profileSettings: {
      name: '',
      email: '',
      contactNumber: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock settings data
        const mockSettings = {
          businessSettings: {
            businessName: 'Acme Corporation',
            address: '123 Business St, City, Country',
            contactNumber: '(555) 123-4567',
            email: 'contact@acmecorp.com',
            taxId: 'TAX123456789'
          },
          workingHours: {
            regularHoursPerDay: 8,
            workingDaysPerWeek: 5,
            overtimeMultiplier: 1.5
          },
          paymentSettings: {
            salaryCalculationPeriod: 'monthly',
            paymentDay: 5,
            autoCalculate: true
          },
          notificationSettings: {
            enableEmailNotifications: true,
            notifyOnAttendanceIssues: true,
            notifyBeforePayday: true
          },
          profileSettings: {
            name: user?.username || '',
            email: user?.email || '',
            contactNumber: '(555) 987-6543'
          }
        };
        
        setSettings(mockSettings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
        setAlertMessage({
          type: 'error',
          text: 'Failed to load settings'
        });
      }
    };

    fetchSettings();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // In a real app, we would make an API call to save the settings
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaving(false);
      setAlertMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaving(false);
      setAlertMessage({
        type: 'error',
        text: 'Failed to save settings'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Settings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {alertMessage && (
        <Alert 
          severity={alertMessage.type} 
          sx={{ mb: 3 }}
          onClose={() => setAlertMessage(null)}
        >
          {alertMessage.text}
        </Alert>
      )}

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<BusinessIcon />} label="Business" id="tab-0" aria-controls="tabpanel-0" />
        <Tab icon={<AccessTimeIcon />} label="Work Hours" id="tab-1" aria-controls="tabpanel-1" />
        <Tab icon={<NotificationsIcon />} label="Notifications" id="tab-2" aria-controls="tabpanel-2" />
        <Tab icon={<AccountCircleIcon />} label="My Profile" id="tab-3" aria-controls="tabpanel-3" />
        <Tab icon={<SecurityIcon />} label="Security" id="tab-4" aria-controls="tabpanel-4" />
      </Tabs>

      {/* Business Settings Tab */}
      <div role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This information will be used on reports and payslips.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={settings.businessSettings.businessName}
                  onChange={(e) => handleChange('businessSettings', 'businessName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax ID / Registration Number"
                  value={settings.businessSettings.taxId}
                  onChange={(e) => handleChange('businessSettings', 'taxId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address"
                  value={settings.businessSettings.address}
                  onChange={(e) => handleChange('businessSettings', 'address', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={settings.businessSettings.contactNumber}
                  onChange={(e) => handleChange('businessSettings', 'contactNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.businessSettings.email}
                  onChange={(e) => handleChange('businessSettings', 'email', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>

      {/* Work Hours Tab */}
      <div role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Working Hours & Overtime
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure default working hours and overtime calculations.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Regular Hours Per Day"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                  }}
                  value={settings.workingHours.regularHoursPerDay}
                  onChange={(e) => handleChange('workingHours', 'regularHoursPerDay', parseFloat(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Working Days Per Week"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                  }}
                  value={settings.workingHours.workingDaysPerWeek}
                  onChange={(e) => handleChange('workingHours', 'workingDaysPerWeek', parseFloat(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Overtime Multiplier"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">×</InputAdornment>,
                  }}
                  value={settings.workingHours.overtimeMultiplier}
                  onChange={(e) => handleChange('workingHours', 'overtimeMultiplier', parseFloat(e.target.value))}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Payment Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure how and when salaries are calculated and paid.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Salary Calculation Period"
                    value={settings.paymentSettings.salaryCalculationPeriod}
                    onChange={(e) => handleChange('paymentSettings', 'salaryCalculationPeriod', e.target.value)}
                    required
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="bi-weekly">Bi-Weekly</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Payment Day"
                    type="number"
                    helperText="Day of month for salary payment"
                    value={settings.paymentSettings.paymentDay}
                    onChange={(e) => handleChange('paymentSettings', 'paymentDay', parseInt(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentSettings.autoCalculate}
                        onChange={(e) => handleChange('paymentSettings', 'autoCalculate', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Auto-calculate salaries"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </div>

      {/* Notifications Tab */}
      <div role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure email and system notifications.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationSettings.enableEmailNotifications}
                      onChange={(e) => handleChange('notificationSettings', 'enableEmailNotifications', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Email Notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Notification Types
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationSettings.notifyOnAttendanceIssues}
                      onChange={(e) => handleChange('notificationSettings', 'notifyOnAttendanceIssues', e.target.checked)}
                      color="primary"
                      disabled={!settings.notificationSettings.enableEmailNotifications}
                    />
                  }
                  label="Notify on attendance issues (absences, late arrivals)"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationSettings.notifyBeforePayday}
                      onChange={(e) => handleChange('notificationSettings', 'notifyBeforePayday', e.target.checked)}
                      color="primary"
                      disabled={!settings.notificationSettings.enableEmailNotifications}
                    />
                  }
                  label="Notify before payday (3 days in advance)"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>

      {/* Profile Tab */}
      <div role="tabpanel" hidden={tabValue !== 3} id="tabpanel-3" aria-labelledby="tab-3">
        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Update your personal information.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={settings.profileSettings.name}
                  onChange={(e) => handleChange('profileSettings', 'name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.profileSettings.email}
                  onChange={(e) => handleChange('profileSettings', 'email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={settings.profileSettings.contactNumber}
                  onChange={(e) => handleChange('profileSettings', 'contactNumber', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>

      {/* Security Tab */}
      <div role="tabpanel" hidden={tabValue !== 4} id="tabpanel-4" aria-labelledby="tab-4">
        {tabValue === 4 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Update your password and security settings.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Change Password
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Google Authentication
                </Typography>
                {user?.googleId ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Your account is linked with Google.
                  </Alert>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                  >
                    Link Google Account
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </Box>
    </Box>
  );
}

export default Settings;