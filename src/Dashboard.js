import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Avatar,
  Button,
  LinearProgress,
  Divider,
} from '@mui/material';
import { 
  GroupOutlined as EmployeesIcon,
  AttachMoneyOutlined as PayrollIcon,
  EventNoteOutlined as AttendanceIcon,
  WarningAmberOutlined as AlertIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0,
    totalSalaryPending: 0,
    totalAdvances: 0,
    recentEmployees: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we'd fetch actual data from the backend
        // For now, we'll use mock data
        const mockData = {
          totalEmployees: 24,
          presentToday: 18,
          absentToday: 4,
          onLeaveToday: 2,
          totalSalaryPending: 12500,
          totalAdvances: 3200,
          recentEmployees: [
            { id: '1', name: 'John Smith', position: 'Cashier', joinDate: '2023-01-15' },
            { id: '2', name: 'Maria Garcia', position: 'Sales Associate', joinDate: '2023-02-20' },
            { id: '3', name: 'Robert Johnson', position: 'Store Manager', joinDate: '2023-03-05' }
          ],
          attendanceData: [
            { date: 'Jan', present: 20, absent: 4 },
            { date: 'Feb', present: 19, absent: 5 },
            { date: 'Mar', present: 22, absent: 2 },
            { date: 'Apr', present: 18, absent: 6 },
            { date: 'May', present: 21, absent: 3 },
            { date: 'Jun', present: 23, absent: 1 }
          ]
        };
        
        setStats(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Dashboard
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Employee
          </Button>
          <Button variant="outlined">
            Generate Report
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <EmployeesIcon />
                  </Avatar>
                  <Typography variant="h6">Employees</Typography>
                </Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                    <AttendanceIcon />
                  </Avatar>
                  <Typography variant="h6">Attendance</Typography>
                </Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.presentToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                    <AlertIcon />
                  </Avatar>
                  <Typography variant="h6">Absent</Typography>
                </Box>
                <Typography variant="h4" fontWeight={600}>
                  {stats.absentToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                    <PayrollIcon />
                  </Avatar>
                  <Typography variant="h6">Pending Salary</Typography>
                </Box>
                <Typography variant="h4" fontWeight={600}>
                  ${stats.totalSalaryPending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total unpaid salaries
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendance Chart */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Attendance Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.attendanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="present" stroke="#4caf50" strokeWidth={2} />
                      <Line type="monotone" dataKey="absent" stroke="#f44336" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Employees */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Employees
                </Typography>
                {stats.recentEmployees.map((employee, index) => (
                  <React.Fragment key={employee.id}>
                    <Box sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {employee.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.position}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {index < stats.recentEmployees.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button color="primary">View All Employees</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;