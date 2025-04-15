import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

function Reports() {
  const [reportType, setReportType] = useState('monthly');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [employee, setEmployee] = useState('all');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // In a real app, we would fetch employee list from the API
    const mockEmployees = [
      { _id: '1', firstName: 'John', lastName: 'Doe' },
      { _id: '2', firstName: 'Jane', lastName: 'Smith' },
      { _id: '3', firstName: 'Robert', lastName: 'Johnson' },
    ];
    
    setEmployees(mockEmployees);
  }, []);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setReportData(null); // Reset report data when changing type
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  const handleEmployeeChange = (event) => {
    setEmployee(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would call the API to get report data
      // For now, we'll generate mock data based on the selected report type
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (reportType === 'monthly') {
        setReportData(generateMonthlySummary());
      } else if (reportType === 'employee') {
        setReportData(generateEmployeeReport());
      } else if (reportType === 'payroll') {
        setReportData(generatePayrollReport());
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // In a real app, we would generate and download a PDF
    alert('Exporting PDF report...');
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate mock data for monthly summary report
  const generateMonthlySummary = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      summary: {
        totalEmployees: 24,
        totalSalaryPaid: 32500,
        totalSalaryPending: 8750,
        totalAdvances: 3200,
        totalLoans: 12000,
        attendanceSummary: {
          present: 438,
          absent: 46,
          leave: 32,
          halfDay: 12
        }
      },
      attendanceData: [
        { date: '1', present: 20, absent: 4 },
        { date: '5', present: 22, absent: 2 },
        { date: '10', present: 19, absent: 5 },
        { date: '15', present: 21, absent: 3 },
        { date: '20', present: 18, absent: 6 },
        { date: '25', present: 23, absent: 1 },
        { date: '30', present: 20, absent: 4 }
      ],
      salaryData: [
        { name: 'Regular Pay', value: 28000 },
        { name: 'Overtime Pay', value: 4500 },
        { name: 'Advances', value: 3200 },
        { name: 'Loans', value: 1500 }
      ],
      topEmployees: [
        { name: 'Jane Smith', position: 'Manager', hoursWorked: 184, performance: 98 },
        { name: 'Robert Johnson', position: 'Sales Associate', hoursWorked: 176, performance: 92 },
        { name: 'John Doe', position: 'Cashier', hoursWorked: 168, performance: 90 }
      ]
    };
  };

  // Generate mock data for employee performance report
  const generateEmployeeReport = () => {
    const selectedEmployeeData = employee === 'all' 
      ? { firstName: 'All', lastName: 'Employees' }
      : employees.find(emp => emp._id === employee);
    
    return {
      employee: selectedEmployeeData,
      performance: {
        attendanceRate: 92,
        punctualityRate: 95,
        overtimeHours: 24,
        avgHoursPerDay: 7.8
      },
      monthlyAttendance: [
        { month: 'Jan', present: 21, absent: 1 },
        { month: 'Feb', present: 20, absent: 2 },
        { month: 'Mar', present: 22, absent: 0 },
        { month: 'Apr', present: 19, absent: 3 },
        { month: 'May', present: 21, absent: 1 },
        { month: 'Jun', present: 22, absent: 0 }
      ],
      monthlySalary: [
        { month: 'Jan', salary: 2200 },
        { month: 'Feb', salary: 2150 },
        { month: 'Mar', salary: 2300 },
        { month: 'Apr', salary: 2050 },
        { month: 'May', salary: 2250 },
        { month: 'Jun', salary: 2350 }
      ],
      advances: [
        { date: '2023-02-10', amount: 200, status: 'paid' },
        { date: '2023-04-15', amount: 300, status: 'paid' },
        { date: '2023-06-05', amount: 250, status: 'pending' }
      ]
    };
  };

  // Generate mock data for payroll summary report
  const generatePayrollReport = () => {
    return {
      summary: {
        totalSalary: 41250,
        totalRegularPay: 36000,
        totalOvertimePay: 5250,
        totalDeductions: 4750,
        netPayroll: 36500
      },
      departmentSalary: [
        { name: 'Management', value: 12000 },
        { name: 'Sales', value: 18000 },
        { name: 'Cashiers', value: 6000 },
        { name: 'Warehouse', value: 5250 }
      ],
      employeeSalary: [
        { name: 'Jane Smith', position: 'Manager', grossSalary: 4500, netSalary: 4200 },
        { name: 'Robert Johnson', position: 'Sales Associate', grossSalary: 2800, netSalary: 2650 },
        { name: 'John Doe', position: 'Cashier', grossSalary: 2400, netSalary: 2200 },
        { name: 'Alice Brown', position: 'Sales Associate', grossSalary: 2700, netSalary: 2500 },
        { name: 'Michael Wilson', position: 'Warehouse', grossSalary: 2600, netSalary: 2400 }
      ],
      monthlySalaryTrend: [
        { month: 'Jan', salary: 38000 },
        { month: 'Feb', salary: 39500 },
        { month: 'Mar', salary: 40200 },
        { month: 'Apr', salary: 39800 },
        { month: 'May', salary: 41000 },
        { month: 'Jun', salary: 41250 }
      ]
    };
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get current year and previous 2 years for the dropdown
  const years = [year, year - 1, year - 2];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Reports
        </Typography>
        {reportData && (
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              sx={{ mr: 2 }}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generate Report
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Report Type"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <MenuItem value="monthly">Monthly Summary</MenuItem>
              <MenuItem value="employee">Employee Performance</MenuItem>
              <MenuItem value="payroll">Payroll Summary</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Month"
              value={month}
              onChange={handleMonthChange}
            >
              {months.map((monthName, index) => (
                <MenuItem key={index} value={index}>
                  {monthName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Year"
              value={year}
              onChange={handleYearChange}
            >
              {years.map((yearValue) => (
                <MenuItem key={yearValue} value={yearValue}>
                  {yearValue}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {reportType === 'employee' && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Employee"
                value={employee}
                onChange={handleEmployeeChange}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} md={reportType === 'employee' ? 12 : 4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ height: '100%' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {reportData && (
        <Box id="report-content">
          {/* Monthly Summary Report */}
          {reportType === 'monthly' && (
            <>
              <Typography variant="h5" gutterBottom>
                Monthly Summary Report - {months[month]} {year}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Employees
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {reportData.summary.totalEmployees}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Salary Paid
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        ${reportData.summary.totalSalaryPaid.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Advances
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        ${reportData.summary.totalAdvances.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        {Math.round((reportData.summary.attendanceSummary.present / 
                          (reportData.summary.attendanceSummary.present + 
                           reportData.summary.attendanceSummary.absent + 
                           reportData.summary.attendanceSummary.leave + 
                           reportData.summary.attendanceSummary.halfDay)) * 100)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<BarChartIcon />} label="Attendance" />
                <Tab icon={<PieChartIcon />} label="Salary" />
                <Tab icon={<TimelineIcon />} label="Top Performers" />
              </Tabs>
              
              {tabValue === 0 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Attendance Overview
                  </Typography>
                  <Box sx={{ height: 300, mt: 3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reportData.attendanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#4caf50" name="Present" />
                        <Bar dataKey="absent" fill="#f44336" name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                    Attendance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                        <Typography variant="h4" fontWeight={600} color="success.dark">
                          {reportData.summary.attendanceSummary.present}
                        </Typography>
                        <Typography variant="body2" color="success.dark">
                          Present
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                        <Typography variant="h4" fontWeight={600} color="error.dark">
                          {reportData.summary.attendanceSummary.absent}
                        </Typography>
                        <Typography variant="body2" color="error.dark">
                          Absent
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                        <Typography variant="h4" fontWeight={600} color="warning.dark">
                          {reportData.summary.attendanceSummary.leave}
                        </Typography>
                        <Typography variant="body2" color="warning.dark">
                          On Leave
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                        <Typography variant="h4" fontWeight={600} color="info.dark">
                          {reportData.summary.attendanceSummary.halfDay}
                        </Typography>
                        <Typography variant="body2" color="info.dark">
                          Half Day
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              )}
              
              {tabValue === 1 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Salary Distribution
                  </Typography>
                  <Box sx={{ height: 300, mt: 3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.salaryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {reportData.salaryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                    Salary Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Total Salary
                        </Typography>
                        <Typography variant="h6">
                          ${(reportData.summary.totalSalaryPaid + reportData.summary.totalSalaryPending).toLocaleString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Paid:
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            ${reportData.summary.totalSalaryPaid.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Pending:
                          </Typography>
                          <Typography variant="body2" color="warning.main">
                            ${reportData.summary.totalSalaryPending.toLocaleString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Advances & Loans
                        </Typography>
                        <Typography variant="h6">
                          ${(reportData.summary.totalAdvances + reportData.summary.totalLoans).toLocaleString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Advances:
                          </Typography>
                          <Typography variant="body2" color="info.main">
                            ${reportData.summary.totalAdvances.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Loans:
                          </Typography>
                          <Typography variant="body2" color="primary.main">
                            ${reportData.summary.totalLoans.toLocaleString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              )}
              
              {tabValue === 2 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Employees
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Hours Worked</TableCell>
                          <TableCell>Performance Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.topEmployees.map((employee, index) => (
                          <TableRow key={index}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.hoursWorked}</TableCell>
                            <TableCell>{employee.performance}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}
            </>
          )}
          
          {/* Employee Performance Report */}
          {reportType === 'employee' && (
            <>
              <Typography variant="h5" gutterBottom>
                Employee Performance Report - {reportData.employee.firstName} {reportData.employee.lastName}
                <Typography variant="subtitle1" color="text.secondary">
                  {months[month]} {year}
                </Typography>
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {reportData.performance.attendanceRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Punctuality Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="info.main">
                        {reportData.performance.punctualityRate}%
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
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        {reportData.performance.overtimeHours}
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
                        {reportData.performance.avgHoursPerDay}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                  Monthly Attendance
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData.monthlyAttendance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#4caf50" name="Present" />
                      <Bar dataKey="absent" fill="#f44336" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Salary
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportData.monthlySalary}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} name="Salary" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Advances & Loans
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.advances.map((advance, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                          <TableCell>${advance.amount}</TableCell>
                          <TableCell>{advance.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
          
          {/* Payroll Summary Report */}
          {reportType === 'payroll' && (
            <>
              <Typography variant="h5" gutterBottom>
                Payroll Summary Report
                <Typography variant="subtitle1" color="text.secondary">
                  {months[month]} {year}
                </Typography>
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Gross Salary
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        ${reportData.summary.totalSalary.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Deductions
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="error.main">
                        ${reportData.summary.totalDeductions.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Net Payroll
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        ${reportData.summary.netPayroll.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Department Salary Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.departmentSalary}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.departmentSalary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Salary Trend
                </Typography>
                <Box sx={{ height: 300, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportData.monthlySalaryTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Salary" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Employee Salary Breakdown
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Gross Salary</TableCell>
                        <TableCell>Net Salary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.employeeSalary.map((employee, index) => (
                        <TableRow key={index}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>${employee.grossSalary.toLocaleString()}</TableCell>
                          <TableCell>${employee.netSalary.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Reports;