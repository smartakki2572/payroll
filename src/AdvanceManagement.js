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
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Money as MoneyIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function AdvanceManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdvanceDialog, setOpenAdvanceDialog] = useState(false);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [newAdvance, setNewAdvance] = useState({
    employeeId: '',
    amount: '',
    description: ''
  });
  const [newLoan, setNewLoan] = useState({
    employeeId: '',
    amount: '',
    installments: '',
    description: ''
  });
  const [filter, setFilter] = useState('all');
  const [alertMessage, setAlertMessage] = useState(null);

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
          },
          { 
            _id: '2', 
            firstName: 'Jane', 
            lastName: 'Smith', 
            position: 'Manager',
          },
          { 
            _id: '3', 
            firstName: 'Robert', 
            lastName: 'Johnson', 
            position: 'Sales Associate',
          },
        ];
        
        const mockAdvances = [
          {
            _id: 'a1',
            employee: mockEmployees[0],
            amount: 200,
            type: 'advance',
            date: new Date(new Date().setDate(new Date().getDate() - 5)),
            description: 'Emergency medical expense',
            status: 'approved',
            approvedBy: 'Owner'
          },
          {
            _id: 'a2',
            employee: mockEmployees[1],
            amount: 1000,
            type: 'loan',
            date: new Date(new Date().setDate(new Date().getDate() - 15)),
            description: 'Home repair',
            status: 'approved',
            approvedBy: 'Owner',
            installments: {
              total: 4,
              paid: 1,
              amountPerInstallment: 250
            }
          },
          {
            _id: 'a3',
            employee: mockEmployees[2],
            amount: 150,
            type: 'advance',
            date: new Date(),
            description: 'Transportation expense',
            status: 'pending',
            approvedBy: null
          }
        ];
        
        setEmployees(mockEmployees);
        setAdvances(mockAdvances);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAdvanceDialogOpen = () => {
    setOpenAdvanceDialog(true);
  };

  const handleAdvanceDialogClose = () => {
    setOpenAdvanceDialog(false);
    setNewAdvance({
      employeeId: '',
      amount: '',
      description: ''
    });
  };

  const handleLoanDialogOpen = () => {
    setOpenLoanDialog(true);
  };

  const handleLoanDialogClose = () => {
    setOpenLoanDialog(false);
    setNewLoan({
      employeeId: '',
      amount: '',
      installments: '',
      description: ''
    });
  };

  const handleNewAdvanceChange = (e) => {
    setNewAdvance({
      ...newAdvance,
      [e.target.name]: e.target.value
    });
  };

  const handleNewLoanChange = (e) => {
    setNewLoan({
      ...newLoan,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdvance = async () => {
    try {
      // In a real app, we would make an API call
      const employee = employees.find(emp => emp._id === newAdvance.employeeId);
      
      const newAdvanceRecord = {
        _id: `a${advances.length + 1}`,
        employee,
        amount: parseFloat(newAdvance.amount),
        type: 'advance',
        date: new Date(),
        description: newAdvance.description,
        status: 'approved', // Auto-approved for owner
        approvedBy: 'Owner'
      };
      
      setAdvances([...advances, newAdvanceRecord]);
      handleAdvanceDialogClose();
      
      setAlertMessage({
        type: 'success',
        text: 'Cash advance added successfully'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding advance:', error);
      
      setAlertMessage({
        type: 'error',
        text: 'Error adding cash advance'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };

  const handleAddLoan = async () => {
    try {
      // In a real app, we would make an API call
      const employee = employees.find(emp => emp._id === newLoan.employeeId);
      
      const newLoanRecord = {
        _id: `a${advances.length + 1}`,
        employee,
        amount: parseFloat(newLoan.amount),
        type: 'loan',
        date: new Date(),
        description: newLoan.description,
        status: 'approved', // Auto-approved for owner
        approvedBy: 'Owner',
        installments: {
          total: parseInt(newLoan.installments),
          paid: 0,
          amountPerInstallment: parseFloat((newLoan.amount / newLoan.installments).toFixed(2))
        }
      };
      
      setAdvances([...advances, newLoanRecord]);
      handleLoanDialogClose();
      
      setAlertMessage({
        type: 'success',
        text: 'Loan added successfully'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding loan:', error);
      
      setAlertMessage({
        type: 'error',
        text: 'Error adding loan'
      });
      
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };

  const handleUpdateStatus = (advanceId, newStatus) => {
    // In a real app, we would make an API call
    const updatedAdvances = advances.map(advance => {
      if (advance._id === advanceId) {
        return {
          ...advance,
          status: newStatus,
          approvedBy: newStatus === 'approved' ? 'Owner' : advance.approvedBy
        };
      }
      return advance;
    });
    
    setAdvances(updatedAdvances);
    
    setAlertMessage({
      type: 'success',
      text: `Status updated to ${newStatus}`
    });
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Filter advances based on search term and filter
  const filteredAdvances = advances.filter((advance) => {
    // Filter by type
    if (filter === 'advances' && advance.type !== 'advance') return false;
    if (filter === 'loans' && advance.type !== 'loan') return false;
    if (filter === 'pending' && advance.status !== 'pending') return false;
    
    // Filter by search term
    if (searchTerm === '') return true;
    
    const fullName = `${advance.employee.firstName} ${advance.employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           advance.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Advances & Loans
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AttachMoneyIcon />}
            onClick={handleAdvanceDialogOpen}
            sx={{ mr: 2 }}
          >
            New Advance
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AccountBalanceIcon />}
            onClick={handleLoanDialogOpen}
          >
            New Loan
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
          icon={<MoneyIcon />}
          label="All Advances & Loans"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
      </Tabs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filter"
              value={filter}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="advances">Advances Only</MenuItem>
              <MenuItem value="loans">Loans Only</MenuItem>
              <MenuItem value="pending">Pending Approval</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search advances & loans..."
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell>Employee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : filteredAdvances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No advances or loans found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAdvances.map((advance) => (
                <TableRow key={advance._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {advance.employee.firstName.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {`${advance.employee.firstName} ${advance.employee.lastName}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={advance.type === 'advance' ? 'Advance' : 'Loan'} 
                      color={advance.type === 'advance' ? 'info' : 'primary'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color="primary">
                      ${advance.amount.toFixed(2)}
                      {advance.type === 'loan' && advance.installments && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {advance.installments.paid}/{advance.installments.total} paid 
                          (${advance.installments.amountPerInstallment}/month)
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(advance.date), 'MMM dd, yyyy')}
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
                  <TableCell align="right">
                    {advance.status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleUpdateStatus(advance._id, 'approved')}
                          title="Approve"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleUpdateStatus(advance._id, 'rejected')}
                          title="Reject"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Advance Dialog */}
      <Dialog open={openAdvanceDialog} onClose={handleAdvanceDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Cash Advance</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Employee"
                name="employeeId"
                value={newAdvance.employeeId}
                onChange={handleNewAdvanceChange}
                required
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={newAdvance.amount}
                onChange={handleNewAdvanceChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={newAdvance.description}
                onChange={handleNewAdvanceChange}
                placeholder="Reason for advance"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdvanceDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddAdvance}
            disabled={!newAdvance.employeeId || !newAdvance.amount}
          >
            Add Advance
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Loan Dialog */}
      <Dialog open={openLoanDialog} onClose={handleLoanDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Loan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Employee"
                name="employeeId"
                value={newLoan.employeeId}
                onChange={handleNewLoanChange}
                required
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={newLoan.amount}
                onChange={handleNewLoanChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Installments"
                name="installments"
                type="number"
                value={newLoan.installments}
                onChange={handleNewLoanChange}
                required
                helperText="Monthly payments"
              />
            </Grid>
            {newLoan.amount && newLoan.installments && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="body2" gutterBottom>
                    Monthly payment: ${(newLoan.amount / newLoan.installments).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={newLoan.description}
                onChange={handleNewLoanChange}
                placeholder="Reason for loan"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoanDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddLoan}
            disabled={!newLoan.employeeId || !newLoan.amount || !newLoan.installments}
          >
            Add Loan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdvanceManagement;