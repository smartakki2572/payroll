import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CreditCard as CreditCardIcon,
  EventNote as EventNoteIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  Print as PrintIcon,
  Delete as DeleteIcon
  
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock employee data
        const mockEmployee = {
          _id: id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          position: 'Sales Manager',
          hourlyRate: 25.00,
          overtimeRate: 37.50,
          contactNumber: '(555) 123-4567',
          emergencyContact: '(555) 987-6543',
          address: '123 Main St, Anytown, USA',
          joiningDate: '2022-05-15',
          endDate: null,
          isActive: true,
          notes: 'Excellent employee with consistent performance.'
        };
        
        // Mock attendance records
        const mockAttendance = [
          {
            _id: 'a1',
            date: new Date(2023, 5, 1),
            status: 'present',
            clockIn: new Date(2023, 5, 1, 8, 55),
            clockOut: new Date(2023, 5, 1, 17, 10),
            hoursWorked: 8.25,
            overtimeHours: 0.25
          },
          {
            _id: 'a2',
            date: new Date(2023, 5, 2),
            status: 'present',
            clockIn: new Date(2023, 5, 2, 9, 0),
            clockOut: new Date(2023, 5, 2, 17, 0),
            hoursWorked: 8,
            overtimeHours: 0
          },
          {
            _id: 'a3',
            date: new Date(2023, 5, 3),
            status: 'absent',
            clockIn: null,
            clockOut: null,
            hoursWorked: 0,
            overtimeHours: 0
          },
          {
            _id: 'a4',
            date: new Date(2023, 5, 4),
            status: 'present',
            clockIn: new Date(2023, 5, 4, 8, 45),
            clockOut: new Date(2023, 5, 4, 18, 30),
            hoursWorked: 9.75,
            overtimeHours: 1.75
          },
          {
            _id: 'a5',
            date: new Date(2023, 5, 5),
            status: 'present',
            clockIn: new Date(2023, 5, 5, 9, 5),
            clockOut: new Date(2023, 5, 5, 17, 15),
            hoursWorked: 8.17,
            overtimeHours: 0.17
          }
        ];
        
        // Mock salary records
        const mockSalary = [
          {
            _id: 's1',
            month: 4, // May
            year: 2023,
            totalWorkingDays: 22,
            daysWorked: 20,
            regularHours: 160,
            overtimeHours: 12,
            grossSalary: 4450.00,
            deductions: {
              advances: 200,
              loans: 300,
              other: 0
            },
            netSalary: 3950.00,
            isPaid: true,
            paymentDate: new Date(2023, 5, 2),
            paymentMethod: 'bank_transfer'
          },
          {
            _id: 's2',
            month: 5, // June
            year: 2023,
            totalWorkingDays: 22,
            daysWorked: 21,
            regularHours: 168,
            overtimeHours: 8,
            grossSalary: 4500.00,
            deductions: {
              advances: 0,
              loans: 300,
              other: 0
            },
            netSalary: 4200.00,
            isPaid: false,
            paymentDate: null,
            paymentMethod: null
          }
        ];
        
        // Mock advances and loans
        const mockAdvances = [
          {
            _id: 'adv1',
            amount: 200,
            type: 'advance',
            date: new Date(2023, 4, 15),
            description: 'Emergency medical expense',
            status: 'paid'
          },
          {
            _id: 'adv2',
            amount: 1200,
            type: 'loan',
            date: new Date(2023, 3, 10),
            description: 'Home repair',
            status: 'partially_paid',
            installments: {
              total: 4,
              paid: 2,
              amountPerInstallment: 300
            }
          }
        ];
        
        // Set data to state
        setEmployee(mockEmployee);
        setAttendanceRecords(mockAttendance);
        setSalaryRecords(mockSalary);
        setAdvances(mockAdvances);
        setEditData({...mockEmployee}); // Initialize edit form
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false);
        setAlertMessage({
          type: 'error',
          text: 'Failed to load employee data'
        });
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would make an API call
      // For now, we'll just update the state
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployee(editData);
      setOpenEditDialog(false);
      setLoading(false);
      
      setAlertMessage({
        type: 'success',
        text: 'Employee information updated successfully'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating employee:', error);
      setLoading(false);
      
      setAlertMessage({
        type: 'error',
        text: 'Failed to update employee information'
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        // In a real app, we would make an API call
        // For now, we'll just navigate back
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoading(false);
        navigate('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
        setLoading(false);
        
        setAlertMessage({
          type: 'error',
          text: 'Failed to delete employee'
        });
      }
    }
  };

  const getAttendanceSummary = () => {
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
    const absentDays = attendanceRecords.filter(record => record.status === 'absent').length;
    
    const totalHours = attendanceRecords.reduce((sum, record) => sum + record.hoursWorked, 0);
    const overtimeHours = attendanceRecords.reduce((sum, record) => sum + record.overtimeHours, 0);
    
    return {
      totalDays,
      presentDays,
      absentDays,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
      totalHours,
      overtimeHours,
      avgHoursPerDay: presentDays > 0 ? (totalHours / presentDays).toFixed(2) : 0
    };
  };

  const getSalaryTrend = () => {
    return salaryRecords.map(record => ({
      month: new Date(record.year, record.month).toLocaleDateString('default', { month: 'short' }),
      gross: record.grossSalary,
      net: record.netSalary
    }));
  };

  const attendanceSummary = loading ? null : getAttendanceSummary();
  const salaryTrend = loading ? null : getSalaryTrend();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {alertMessage && (
        <Alert 
          severity={alertMessage.type} 
          sx={{ mb: 3 }}
          onClose={() => setAlertMessage(null)}
        >
          {alertMessage.text}
        </Alert>
      )}
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
        >
          Back to Employees
        </Button>
        <Box>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteEmployee}
            sx={{ mr: 2 }}
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />}
            onClick={handleEditDialogOpen}
          >
            Edit Employee
          </Button>
        </Box>
      </Box>
      
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {employee.firstName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {employee.position}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{employee.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{employee.contactNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">${employee.hourlyRate.toFixed(2)}/hr</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonthIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Joined: {new Date(employee.joiningDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Chip 
              label={employee.isActive ? 'Active' : 'Inactive'} 
              color={employee.isActive ? 'success' : 'error'} 
              size="large"
              sx={{ fontWeight: 500 }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Attendance" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Salary" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="Advances & Loans" id="tab-3" aria-controls="tabpanel-3" />
      </Tabs>
      
      {/* Overview Tab */}
      <div role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {tabValue === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Employee Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {employee.firstName} {employee.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Position
                      </Typography>
                      <Typography variant="body1">
                        {employee.position}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {employee.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {employee.contactNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Emergency Contact
                      </Typography>
                      <Typography variant="body1">
                        {employee.emergencyContact}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {employee.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Join Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(employee.joiningDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1">
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {employee.notes || 'No notes'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hourly Rate
                      </Typography>
                      <Typography variant="body1">
                        ${employee.hourlyRate.toFixed(2)}/hr
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Overtime Rate
                      </Typography>
                      <Typography variant="body1">
                        ${employee.overtimeRate.toFixed(2)}/hr
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Payment
                      </Typography>
                      <Typography variant="body1">
                        {salaryRecords.find(record => record.isPaid) 
                          ? new Date(salaryRecords.find(record => record.isPaid).paymentDate).toLocaleDateString() 
                          : 'No payments recorded'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body1">
                        {salaryRecords.find(record => record.isPaid)?.paymentMethod === 'bank_transfer' 
                          ? 'Bank Transfer' 
                          : salaryRecords.find(record => record.isPaid)?.paymentMethod === 'cash'
                          ? 'Cash'
                          : salaryRecords.find(record => record.isPaid)?.paymentMethod === 'check'
                          ? 'Check'
                          : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Attendance Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate:
                    </Typography>
                    <Typography variant="body1" fontWeight={500} color="success.main">
                      {attendanceSummary.attendanceRate}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Days Present:
                    </Typography>
                    <Typography variant="body1">
                      {attendanceSummary.presentDays}/{attendanceSummary.totalDays}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Hours:
                    </Typography>
                    <Typography variant="body1">
                      {attendanceSummary.totalHours.toFixed(1)} hrs
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Overtime Hours:
                    </Typography>
                    <Typography variant="body1" color="primary.main">
                      {attendanceSummary.overtimeHours.toFixed(1)} hrs
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Salary Overview
                  </Typography>
                  <Box sx={{ height: 200, mt: 3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salaryTrend}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line type="monotone" dataKey="gross" stroke="#8884d8" name="Gross" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="net" stroke="#82ca9d" name="Net" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  {salaryRecords.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Latest Salary
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight={600}>
                        ${salaryRecords[0].netSalary.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {months[salaryRecords[0].month]} {salaryRecords[0].year}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </div>
      
      {/* Attendance Tab */}
      <div role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {tabValue === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {attendanceSummary.attendanceRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Hours
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {attendanceSummary.totalHours.toFixed(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Overtime Hours
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        {attendanceSummary.overtimeHours.toFixed(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Avg Hours/Day
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {attendanceSummary.avgHoursPerDay}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Attendance Records
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell>Hours Worked</TableCell>
                    <TableCell>Overtime</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          color={
                            record.status === 'present' ? 'success' : 
                            record.status === 'absent' ? 'error' : 
                            record.status === 'leave' ? 'warning' : 'default'
                          } 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {record.clockIn ? format(new Date(record.clockIn), 'hh:mm a') : '-'}
                      </TableCell>
                      <TableCell>
                        {record.clockOut ? format(new Date(record.clockOut), 'hh:mm a') : '-'}
                      </TableCell>
                      <TableCell>{record.hoursWorked.toFixed(2)} hrs</TableCell>
                      <TableCell>{record.overtimeHours.toFixed(2)} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </div>
      
      {/* Salary Tab */}
      <div role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {tabValue === 2 && (
          <Box>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Salary Trend
              </Typography>
              <Box sx={{ height: 300, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salaryTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="gross" fill="#8884d8" name="Gross Salary" />
                    <Bar dataKey="net" fill="#82ca9d" name="Net Salary" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Salary Records
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell>Period</TableCell>
                    <TableCell>Days Worked</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Gross Salary</TableCell>
                    <TableCell>Deductions</TableCell>
                    <TableCell>Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaryRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        {months[record.month]} {record.year}
                      </TableCell>
                     
                      <TableCell>
                        {record.daysWorked}/{record.totalWorkingDays}
                      </TableCell>
                      <TableCell>
                        {record.regularHours} + {record.overtimeHours} OT
                      </TableCell>
                      <TableCell>${record.grossSalary.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(record.deductions.advances + record.deductions.loans + record.deductions.other).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} color="primary">
                          ${record.netSalary.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.isPaid ? 'Paid' : 'Unpaid'} 
                          color={record.isPaid ? 'success' : 'warning'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {record.paymentDate 
                          ? format(new Date(record.paymentDate), 'MMM dd, yyyy') 
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Salary Breakdown
            </Typography>
            
            {salaryRecords.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Latest Salary - {months[salaryRecords[0].month]} {salaryRecords[0].year}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Earnings
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Regular Pay ({salaryRecords[0].regularHours} hrs × ${employee.hourlyRate.toFixed(2)}):
                        </Typography>
                        <Typography variant="body2">
                          ${(salaryRecords[0].regularHours * employee.hourlyRate).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Overtime Pay ({salaryRecords[0].overtimeHours} hrs × ${employee.overtimeRate.toFixed(2)}):
                        </Typography>
                        <Typography variant="body2">
                          ${(salaryRecords[0].overtimeHours * employee.overtimeRate).toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={500}>
                          Gross Pay:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          ${salaryRecords[0].grossSalary.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Deductions
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Advances:
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          -${salaryRecords[0].deductions.advances.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Loans:
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          -${salaryRecords[0].deductions.loans.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Other:
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          -${salaryRecords[0].deductions.other.toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={500}>
                          Net Pay:
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="primary.main">
                          ${salaryRecords[0].netSalary.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        )}
      </div>
      
      {/* Advances & Loans Tab */}
      <div role="tabpanel" hidden={tabValue !== 3} id="tabpanel-3" aria-labelledby="tab-3">
        {tabValue === 3 && (
          <Box>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Advances & Loans Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Advances
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        ${advances.filter(a => a.type === 'advance').reduce((sum, a) => sum + a.amount, 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {advances.filter(a => a.type === 'advance').length} advances
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Loans
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="primary.main">
                        ${advances.filter(a => a.type === 'loan').reduce((sum, a) => sum + a.amount, 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {advances.filter(a => a.type === 'loan').length} loans
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Advances & Loans
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Installments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {advances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No advances or loans found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    advances.map((advance) => (
                      <TableRow key={advance._id}>
                        <TableCell>
                          {format(new Date(advance.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={advance.type === 'advance' ? 'Advance' : 'Loan'} 
                            color={advance.type === 'advance' ? 'info' : 'primary'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            ${advance.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>{advance.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              advance.status === 'approved' ? 'Approved' :
                              advance.status === 'pending' ? 'Pending' :
                              advance.status === 'paid' ? 'Paid' :
                              advance.status === 'partially_paid' ? 'Partially Paid' : 'Rejected'
                            } 
                            color={
                              advance.status === 'approved' ? 'success' :
                              advance.status === 'pending' ? 'warning' :
                              advance.status === 'paid' ? 'success' :
                              advance.status === 'partially_paid' ? 'info' : 'error'
                            } 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {advance.type === 'loan' && advance.installments ? (
                            <Box>
                              <Typography variant="body2">
                                {advance.installments.paid}/{advance.installments.total} paid
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ${advance.installments.amountPerInstallment}/month
                              </Typography>
                            </Box>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </div>
      
      {/* Edit Employee Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editData.firstName || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editData.lastName || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editData.email || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={editData.position || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hourly Rate"
                name="hourlyRate"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={editData.hourlyRate || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Overtime Rate"
                name="overtimeRate"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={editData.overtimeRate || ''}
                onChange={handleEditChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={editData.contactNumber || ''}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={editData.emergencyContact || ''}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editData.address || ''}
                onChange={handleEditChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Join Date"
                name="joiningDate"
                type="date"
                value={editData.joiningDate ? new Date(editData.joiningDate).toISOString().split('T')[0] : ''}
                onChange={handleEditChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="isActive"
                value={editData.isActive !== undefined ? editData.isActive : true}
                onChange={handleEditChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={editData.notes || ''}
                onChange={handleEditChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveChanges}
            disabled={loading || !editData.firstName || !editData.lastName || !editData.position || !editData.hourlyRate}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeDetail;