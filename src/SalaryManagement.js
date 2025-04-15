import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Alert,
  Collapse
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  ReceiptLong as ReceiptLongIcon,
  Calculate as CalculateIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  MoneyOff as MoneyOffIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function SalaryManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCalculateDialog, setOpenCalculateDialog] = useState(false);
  const [calculatingEmployeeId, setCalculatingEmployeeId] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openRows, setOpenRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from the API
        // For now, we'll use mock data
        const mockEmployees = [
          { 
            _id: '1', 
            firstName: 'John', 
            lastName: 'Doe', 
            position: 'Cashier',
            hourlyRate: 15,
          },
          { 
            _id: '2', 
            firstName: 'Jane', 
            lastName: 'Smith', 
            position: 'Manager',
            hourlyRate: 25,
          },
          { 
            _id: '3', 
            firstName: 'Robert', 
            lastName: 'Johnson', 
            position: 'Sales Associate',
            hourlyRate: 16,
          },
        ];
        
        const mockSalaryRecords = [
          {
            _id: 's1',
            employee: mockEmployees[0],
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            totalWorkingDays: 22,
            daysWorked: 20,
            regularHours: 160,
            overtimeHours: 10,
            grossSalary: 2550,
            deductions: {
              advances: 200,
              loans: 0,
              other: 0
            },
            netSalary: 2350,
            isPaid: false,
            paymentDate: null,
            paymentMethod: null
          },
          {
            _id: 's2',
            employee: mockEmployees[1],
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            totalWorkingDays: 22,
            daysWorked: 22,
            regularHours: 176,
            overtimeHours: 5,
            grossSalary: 4525,
            deductions: {
              advances: 0,
              loans: 500,
              other: 0
            },
            netSalary: 4025,
            isPaid: true,
            paymentDate: new Date(),
            paymentMethod: 'bank_transfer'
          }
        ];
        
        setEmployees(mockEmployees);
        setSalaryRecords(mockSalaryRecords);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
    // In a real app, we would fetch salary records for the selected month/year
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
    // In a real app, we would fetch salary records for the selected month/year
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRowToggle = (id) => {
    const currentIndex = openRows.indexOf(id);
    const newOpenRows = [...openRows];
    
    if (currentIndex === -1) {
      newOpenRows.push(id);
    } else {
      newOpenRows.splice(currentIndex, 1);
    }
    
    setOpenRows(newOpenRows);
  };

  const handleCalculateDialogOpen = (employeeId) => {
    setCalculatingEmployeeId(employeeId);
    setOpenCalculateDialog(true);
  };

  const handleCalculateDialogClose = () => {
    setOpenCalculateDialog(false);
    setCalculatingEmployeeId('');
  };

  const handleCalculateSalary = async () => {
    try {
      setIsCalculating(true);
      
      // In a real app, we would make an API call
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const employee = employees.find(emp => emp._id === calculatingEmployeeId);
      
      // Simulate salary calculation
      const newSalaryRecord = {
        _id: `s${salaryRecords.length + 1}`,
        employee,
        month,
        year,
        totalWorkingDays: 22,
        daysWorked: 20,
        regularHours: 160,
        overtimeHours: 8,
        grossSalary: employee.hourlyRate * 160 + employee.hourlyRate * 1.5 * 8,
        deductions: {
          advances: 0,
          loans: 0,
          other: 0
        },
        netSalary: employee.hourlyRate * 160 + employee.hourlyRate * 1.5 * 8,
        isPaid: false,
        paymentDate: null,
        paymentMethod: null
      };
      
      setSalaryRecords([...salaryRecords, newSalaryRecord]);
      setIsCalculating(false);
      handleCalculateDialogClose();
      
      setAlertMessage({
        type: 'success',
        text: 'Salary calculated successfully'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error calculating salary:', error);
      setIsCalculating(false);
      
      setAlertMessage({
        type: 'error',
        text: 'Error calculating salary'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };

  const handleMarkAsPaid = (recordId, method = 'cash') => {
    // In a real app, we would make an API call
    const updatedRecords = salaryRecords.map(record => {
      if (record._id === recordId) {
        return {
          ...record,
          isPaid: true,
          paymentDate: new Date(),
          paymentMethod: method
        };
      }
      return record;
    });
    
    setSalaryRecords(updatedRecords);
    
    setAlertMessage({
      type: 'success',
      text: 'Salary marked as paid successfully'
    });
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Filter employees and salary records based on search term
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredSalaryRecords = salaryRecords.filter((record) => {
    if (record.month !== month || record.year !== year) {
      return false;
    }
    
    if (searchTerm === '') {
      return true;
    }
    
    const fullName = `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           record.employee.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate employees without salary records for the current month/year
  const employeesWithoutSalary = filteredEmployees.filter(
    employee => !salaryRecords.some(
      record => record.employee._id === employee._id && 
                record.month === month && 
                record.year === year
    )
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get current year and previous 2 years for the dropdown
  const years = [year, year - 1, year - 2];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Salary Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalculateIcon />}
            disabled={employeesWithoutSalary.length === 0}
            onClick={() => employeesWithoutSalary.length === 1 ? 
              handleCalculateDialogOpen(employeesWithoutSalary[0]._id) : 
              handleCalculateDialogOpen('')}
          >
            {employeesWithoutSalary.length === 1 ? 
              'Calculate Salary' : 
              `Calculate All (${employeesWithoutSalary.length})`}
          </Button>
        </Box>
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
        <Tab
          icon={<ReceiptLongIcon />}
          label="Current Payroll"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
        <Tab
          icon={<HistoryIcon />}
          label="Salary History"
          id="tab-1"
          aria-controls="tabpanel-1"
        />
      </Tabs>

      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {tabValue === 0 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth                 
                    variant="outlined"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>
              {months[month]} {year} Payroll
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell />
                    <TableCell>Employee</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Gross Salary</TableCell>
                    <TableCell>Deductions</TableCell>
                    <TableCell>Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress size={24} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredSalaryRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No salary records found for this period.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSalaryRecords.map((record) => {
                      const isRowOpen = openRows.includes(record._id);
                      
                      return (
                        <React.Fragment key={record._id}>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleRowToggle(record._id)}
                              >
                                {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {record.employee.firstName.charAt(0)}
                                </Avatar>
                                <Typography variant="body1" fontWeight={500}>
                                  {`${record.employee.firstName} ${record.employee.lastName}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{record.employee.position}</TableCell>
                            <TableCell>
                              {record.regularHours} + {record.overtimeHours} OT
                            </TableCell>
                            <TableCell>${record.grossSalary.toFixed(2)}</TableCell>
                            <TableCell>
                              ${(record.grossSalary - record.netSalary).toFixed(2)}
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
                            <TableCell align="right">
                              {!record.isPaid ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  startIcon={<PaymentIcon />}
                                  onClick={() => handleMarkAsPaid(record._id)}
                                >
                                  Pay
                                </Button>
                              ) : (
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => window.print()}
                                >
                                  <PrintIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                              <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ m: 2 }}>
                                  <Typography variant="h6" gutterBottom component="div">
                                    Salary Details
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                          Work Summary
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Total Working Days:
                                          </Typography>
                                          <Typography variant="body2">
                                            {record.totalWorkingDays} days
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Days Worked:
                                          </Typography>
                                          <Typography variant="body2">
                                            {record.daysWorked} days
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Regular Hours:
                                          </Typography>
                                          <Typography variant="body2">
                                            {record.regularHours} hours
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Overtime Hours:
                                          </Typography>
                                          <Typography variant="body2">
                                            {record.overtimeHours} hours
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Hourly Rate:
                                          </Typography>
                                          <Typography variant="body2">
                                            ${record.employee.hourlyRate.toFixed(2)}/hr
                                          </Typography>
                                        </Box>
                                      </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                          Payment Details
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Regular Pay:
                                          </Typography>
                                          <Typography variant="body2">
                                            ${(record.regularHours * record.employee.hourlyRate).toFixed(2)}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Overtime Pay:
                                          </Typography>
                                          <Typography variant="body2">
                                            ${(record.overtimeHours * record.employee.hourlyRate * 1.5).toFixed(2)}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Advances:
                                          </Typography>
                                          <Typography variant="body2" color="error.main">
                                            -${record.deductions.advances.toFixed(2)}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Loans:
                                          </Typography>
                                          <Typography variant="body2" color="error.main">
                                            -${record.deductions.loans.toFixed(2)}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Other Deductions:
                                          </Typography>
                                          <Typography variant="body2" color="error.main">
                                            -${record.deductions.other.toFixed(2)}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                          <Typography variant="subtitle2">
                                            Net Salary:
                                          </Typography>
                                          <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
                                            ${record.netSalary.toFixed(2)}
                                          </Typography>
                                        </Box>
                                      </Paper>
                                    </Grid>
                                    {record.isPaid && (
                                      <Grid item xs={12}>
                                        <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CheckIcon color="success" sx={{ mr: 1 }} />
                                            <Typography variant="body1" color="success.dark">
                                              Paid on {format(new Date(record.paymentDate), 'MMM dd, yyyy')} via {
                                                record.paymentMethod === 'cash' ? 'Cash' :
                                                record.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                                                record.paymentMethod === 'check' ? 'Check' : 'Other'
                                              }
                                            </Typography>
                                          </Box>
                                        </Paper>
                                      </Grid>
                                    )}
                                  </Grid>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {employeesWithoutSalary.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Employees Without Salary Records
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Employee</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Hourly Rate</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employeesWithoutSalary.map((employee) => (
                        <TableRow key={employee._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {employee.firstName.charAt(0)}
                              </Avatar>
                              <Typography variant="body1" fontWeight={500}>
                                {`${employee.firstName} ${employee.lastName}`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>${employee.hourlyRate.toFixed(2)}/hr</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<CalculateIcon />}
                              onClick={() => handleCalculateDialogOpen(employee._id)}
                            >
                              Calculate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </div>

      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {tabValue === 1 && (
          <Typography variant="body1">
            Salary history will be displayed here.
          </Typography>
        )}
      </div>

      {/* Calculate Salary Dialog */}
      <Dialog open={openCalculateDialog} onClose={handleCalculateDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Calculate Salary</DialogTitle>
        <DialogContent>
          {calculatingEmployeeId ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to calculate the salary for {
                  employees.find(emp => emp._id === calculatingEmployeeId)?.firstName
                } {
                  employees.find(emp => emp._id === calculatingEmployeeId)?.lastName
                } for {months[month]} {year}?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will fetch attendance records, calculate work hours, and apply any deductions for the selected period.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to calculate salaries for all {employeesWithoutSalary.length} employees without salary records for {months[month]} {year}?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will fetch attendance records, calculate work hours, and apply any deductions for all employees in the selected period.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCalculateDialogClose} disabled={isCalculating}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCalculateSalary}
            disabled={isCalculating}
            startIcon={isCalculating ? <CircularProgress size={16} /> : <CalculateIcon />}
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SalaryManagement;