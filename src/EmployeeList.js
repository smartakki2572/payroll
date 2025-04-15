import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    hourlyRate: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchEmployees = async () => {
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
            isActive: true,
            joiningDate: '2023-01-10'
          },
          { 
            _id: '2', 
            firstName: 'Jane', 
            lastName: 'Smith', 
            position: 'Manager', 
            hourlyRate: 25,
            isActive: true,
            joiningDate: '2022-11-05'
          },
          { 
            _id: '3', 
            firstName: 'Robert', 
            lastName: 'Johnson', 
            position: 'Sales Associate', 
            hourlyRate: 16,
            isActive: false,
            joiningDate: '2023-02-15'
          },
          // Add more mock employees as needed
        ];
        
        setEmployees(mockEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      hourlyRate: '',
      contactNumber: '',
    });
  };

  const handleNewEmployeeChange = (e) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value
    });
  };

  const handleAddEmployee = async () => {
    try {
      // In a real app, we would post to the API
      // For now, we'll just update our state
      const newEmployeeWithId = {
        _id: String(employees.length + 1),
        ...newEmployee,
        isActive: true,
        joiningDate: new Date().toISOString().split('T')[0]
      };
      
      setEmployees([...employees, newEmployeeWithId]);
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleViewEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Paginate employees
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Employees
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddDialogOpen}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search employees by name or position..."
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
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Hourly Rate</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {employee.firstName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {`${employee.firstName} ${employee.lastName}`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>${employee.hourlyRate.toFixed(2)}/hr</TableCell>
                  <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.isActive ? 'Active' : 'Inactive'} 
                      color={employee.isActive ? 'success' : 'error'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewEmployee(employee._id)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={newEmployee.firstName}
                onChange={handleNewEmployeeChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={newEmployee.lastName}
                onChange={handleNewEmployeeChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newEmployee.email}
                onChange={handleNewEmployeeChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={newEmployee.position}
                onChange={handleNewEmployeeChange}
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
                value={newEmployee.hourlyRate}
                onChange={handleNewEmployeeChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={newEmployee.contactNumber}
                onChange={handleNewEmployeeChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddEmployee}
            disabled={
              !newEmployee.firstName || 
              !newEmployee.lastName || 
              !newEmployee.email || 
              !newEmployee.position || 
              !newEmployee.hourlyRate
            }
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeList;