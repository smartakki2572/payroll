// routes/reports.js
const express = require('express');
const router = express.Router();
const { auth, ownerAuth } = require('../middleware/auth');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');
const Advance = require('../models/Advance');
const User = require('../models/User');

// @route   GET /api/reports/monthly-summary
// @desc    Get monthly attendance and payroll summary
// @access  Private (owner/manager)
router.get('/monthly-summary', auth, async (req, res) => {
  try {
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Get month and year from query
    const { month, year } = req.query;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).json({ msg: 'Valid month and year are required' });
    }
    
    // Get start and end date for the month
    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0); // Last day of month
    
    // Get all employees
    const employees = await Employee.find({ 
      business: businessId,
      $or: [
        { isActive: true },
        { 
          endDate: { $gte: startDate }
        }
      ]
    });
    
    // Get attendance records for the month
    const attendanceRecords = await Attendance.find({
      business: businessId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Get salary records for the month
    const salaryRecords = await SalaryRecord.find({
      business: businessId,
      month: monthNum,
      year: yearNum
    });
    
    // Get advances/loans for the month
    const advances = await Advance.find({
      business: businessId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate summary
    const summary = {
      totalEmployees: employees.length,
      totalSalaryPaid: 0,
      totalSalaryPending: 0,
      totalAdvances: 0,
      totalLoans: 0,
      attendanceSummary: {
        present: 0,
        absent: 0,
        leave: 0,
        halfDay: 0
      },
      employeeSummaries: []
    };
    
    // Process salary records
    salaryRecords.forEach(salary => {
      if (salary.isPaid) {
        summary.totalSalaryPaid += salary.netSalary;
      } else {
        summary.totalSalaryPending += salary.netSalary;
      }
    });
    
    // Process advances/loans
    advances.forEach(advance => {
      if (advance.type === 'advance' && (advance.status === 'approved' || advance.status === 'paid')) {
        summary.totalAdvances += advance.amount;
      } else if (advance.type === 'loan' && (advance.status === 'approved' || advance.status === 'paid' || advance.status === 'partially_paid')) {
        summary.totalLoans += advance.amount;
      }
    });
    
    // Process attendance
    attendanceRecords.forEach(record => {
      if (record.status === 'present') {
        summary.attendanceSummary.present++;
      } else if (record.status === 'absent') {
        summary.attendanceSummary.absent++;
      } else if (record.status === 'leave') {
        summary.attendanceSummary.leave++;
      } else if (record.status === 'half-day') {
        summary.attendanceSummary.halfDay++;
      }
    });
    
    // Calculate individual employee summaries
    employees.forEach(employee => {
      const employeeAttendance = attendanceRecords.filter(
        record => record.employee.toString() === employee._id.toString()
      );
      
      const employeeSalary = salaryRecords.find(
        record => record.employee.toString() === employee._id.toString()
      );
      
      const employeeAdvances = advances.filter(
        record => record.employee.toString() === employee._id.toString()
      );
      
      const totalPresent = employeeAttendance.filter(
        record => record.status === 'present'
      ).length;
      
      const totalAbsent = employeeAttendance.filter(
        record => record.status === 'absent'
      ).length;
      
      const totalLeave = employeeAttendance.filter(
        record => record.status === 'leave'
      ).length;
      
      const totalHalfDay = employeeAttendance.filter(
        record => record.status === 'half-day'
      ).length;
      
      const totalAdvances = employeeAdvances.filter(
        adv => adv.type === 'advance'
      ).reduce((sum, adv) => sum + adv.amount, 0);
      
      const totalLoans = employeeAdvances.filter(
        adv => adv.type === 'loan'
      ).reduce((sum, adv) => sum + adv.amount, 0);
      
      summary.employeeSummaries.push({
        employeeId: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        hourlyRate: employee.hourlyRate,
        attendance: {
          present: totalPresent,
          absent: totalAbsent,
          leave: totalLeave,
          halfDay: totalHalfDay
        },
        totalHoursWorked: employeeAttendance.reduce(
          (sum, record) => sum + (record.hoursWorked || 0), 0
        ),
        totalOvertimeHours: employeeAttendance.reduce(
          (sum, record) => sum + (record.overtimeHours || 0), 0
        ),
        grossSalary: employeeSalary ? employeeSalary.grossSalary : 0,
        netSalary: employeeSalary ? employeeSalary.netSalary : 0,
        isPaid: employeeSalary ? employeeSalary.isPaid : false,
        advances: totalAdvances,
        loans: totalLoans
      });
    });
    
    res.json(summary);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reports/employee-performance/:employeeId
// @desc    Get performance report for an employee
// @access  Private (owner/manager)
router.get('/employee-performance/:employeeId', auth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    // Verify employee belongs to this business
    if (employee.business.toString() !== businessId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to access this employee' });
    }
    
    // Parse dates
    let start, end;
    if (startDate) {
      start = new Date(startDate);
    } else {
      // Default to 3 months ago
      start = new Date();
      start.setMonth(start.getMonth() - 3);
    }
    
    if (endDate) {
      end = new Date(endDate);
    } else {
      end = new Date();
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: 1 });
    
    // Get salary records
    const salaryRecords = await SalaryRecord.find({
      employee: employeeId,
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ year: 1, month: 1 });
    
    // Calculate performance metrics
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const workingDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => 
      record.status === 'present' || record.status === 'half-day'
    ).length;
    
    const totalHoursWorked = attendanceRecords.reduce(
      (sum, record) => sum + (record.hoursWorked || 0), 0
    );
    
    const totalOvertimeHours = attendanceRecords.reduce(
      (sum, record) => sum + (record.overtimeHours || 0), 0
    );
    
    // Calculate average hours per day
    const avgHoursPerDay = presentDays > 0 ? totalHoursWorked / presentDays : 0;
    
    // Calculate attendance rate
    const attendanceRate = workingDays > 0 ? (presentDays / workingDays) * 100 : 0;
    
    // Calculate monthly attendance breakdown
    const monthlyBreakdown = {};
    
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyBreakdown[monthYear]) {
        monthlyBreakdown[monthYear] = {
          present: 0,
          absent: 0,
          leave: 0,
          halfDay: 0,
          hoursWorked: 0,
          overtimeHours: 0
        };
      }
      
      if (record.status === 'present') {
        monthlyBreakdown[monthYear].present++;
      } else if (record.status === 'absent') {
        monthlyBreakdown[monthYear].absent++;
      } else if (record.status === 'leave') {
        monthlyBreakdown[monthYear].leave++;
      } else if (record.status === 'half-day') {
        monthlyBreakdown[monthYear].halfDay++;
      }
      
      monthlyBreakdown[monthYear].hoursWorked += record.hoursWorked || 0;
      monthlyBreakdown[monthYear].overtimeHours += record.overtimeHours || 0;
    });
    
    // Calculate salary stats
    const totalGrossSalary = salaryRecords.reduce(
      (sum, record) => sum + record.grossSalary, 0
    );
    
    const totalNetSalary = salaryRecords.reduce(
      (sum, record) => sum + record.netSalary, 0
    );
    
    const monthlySalaryBreakdown = {};
    
    salaryRecords.forEach(record => {
      const monthYear = `${record.year}-${record.month + 1}`;
      
      monthlySalaryBreakdown[monthYear] = {
        grossSalary: record.grossSalary,
        netSalary: record.netSalary,
        deductions: record.deductions,
        isPaid: record.isPaid
      };
    });
    
    // Build performance report
    const performanceReport = {
      employee: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        hourlyRate: employee.hourlyRate,
        overtimeRate: employee.overtimeRate
      },
      period: {
        start,
        end,
        totalDays
      },
      attendance: {
        workingDays,
        presentDays,
        absentDays: attendanceRecords.filter(record => record.status === 'absent').length,
        leaveDays: attendanceRecords.filter(record => record.status === 'leave').length,
        halfDays: attendanceRecords.filter(record => record.status === 'half-day').length,
        attendanceRate: parseFloat(attendanceRate.toFixed(2))
      },
      hours: {
        totalHoursWorked: parseFloat(totalHoursWorked.toFixed(2)),
        totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(2)),
        avgHoursPerDay: parseFloat(avgHoursPerDay.toFixed(2))
      },
      salary: {
        totalGrossSalary,
        totalNetSalary,
        avgMonthlySalary: salaryRecords.length > 0 ? totalNetSalary / salaryRecords.length : 0
      },
      monthlyBreakdown,
      monthlySalaryBreakdown
    };
    
    res.json(performanceReport);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reports/payroll-summary
// @desc    Get payroll summary for a specific period
// @access  Private (owner only)
router.get('/payroll-summary', auth, ownerAuth, async (req, res) => {
  try {
    // Get period from query
    const { startMonth, startYear, endMonth, endYear } = req.query;
    
    // Parse period
    const startMonthNum = parseInt(startMonth);
    const startYearNum = parseInt(startYear);
    const endMonthNum = parseInt(endMonth || startMonth);
    const endYearNum = parseInt(endYear || startYear);
    
    if (isNaN(startMonthNum) || isNaN(startYearNum) || isNaN(endMonthNum) || isNaN(endYearNum)) {
      return res.status(400).json({ msg: 'Valid month and year range required' });
    }
    
    // Build query for salary records
    const query = {
      business: req.user.id,
      $or: []
    };
    
    // Handle single month case
    if (startYearNum === endYearNum && startMonthNum === endMonthNum) {
      query.$or.push({
        year: startYearNum,
        month: startMonthNum
      });
    } else {
      // Handle multi-month case
      for (let year = startYearNum; year <= endYearNum; year++) {
        const startMonthInYear = year === startYearNum ? startMonthNum : 0;
        const endMonthInYear = year === endYearNum ? endMonthNum : 11;
        
        for (let month = startMonthInYear; month <= endMonthInYear; month++) {
          query.$or.push({
            year,
            month
          });
        }
      }
    }
    
    // Get salary records
    const salaryRecords = await SalaryRecord.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName position'
      });
    
    // Calculate summary
    const summary = {
      period: {
        start: {
          month: startMonthNum,
          year: startYearNum
        },
        end: {
          month: endMonthNum,
          year: endYearNum
        }
      },
      totalRecords: salaryRecords.length,
      totalGrossSalary: 0,
      totalNetSalary: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      deductions: {
        totalAdvances: 0,
        totalLoans: 0,
        totalOther: 0
      },
      monthlyBreakdown: {},
      employeeBreakdown: {}
    };
    
    // Process records
    salaryRecords.forEach(record => {
      // Update totals
      summary.totalGrossSalary += record.grossSalary;
      summary.totalNetSalary += record.netSalary;
      
      if (record.isPaid) {
        summary.totalPaid += record.netSalary;
      } else {
        summary.totalUnpaid += record.netSalary;
      }
      
      // Update deduction totals
      summary.deductions.totalAdvances += record.deductions.advances || 0;
      summary.deductions.totalLoans += record.deductions.loans || 0;
      summary.deductions.totalOther += record.deductions.other || 0;
      
      // Update monthly breakdown
      const monthKey = `${record.year}-${record.month + 1}`;
      if (!summary.monthlyBreakdown[monthKey]) {
        summary.monthlyBreakdown[monthKey] = {
          totalGross: 0,
          totalNet: 0,
          totalPaid: 0,
          totalUnpaid: 0,
          records: 0
        };
      }
      
      summary.monthlyBreakdown[monthKey].totalGross += record.grossSalary;
      summary.monthlyBreakdown[monthKey].totalNet += record.netSalary;
      summary.monthlyBreakdown[monthKey].records++;
      
      if (record.isPaid) {
        summary.monthlyBreakdown[monthKey].totalPaid += record.netSalary;
      } else {
        summary.monthlyBreakdown[monthKey].totalUnpaid += record.netSalary;
      }
      
      // Update employee breakdown
      const employeeId = record.employee._id.toString();
      if (!summary.employeeBreakdown[employeeId]) {
        summary.employeeBreakdown[employeeId] = {
          employee: {
            id: record.employee._id,
            name: `${record.employee.firstName} ${record.employee.lastName}`,
            position: record.employee.position
          },
          totalGross: 0,
          totalNet: 0,
          totalPaid: 0,
          totalUnpaid: 0,
          records: 0
        };
      }
      
      summary.employeeBreakdown[employeeId].totalGross += record.grossSalary;
      summary.employeeBreakdown[employeeId].totalNet += record.netSalary;
      summary.employeeBreakdown[employeeId].records++;
      
      if (record.isPaid) {
        summary.employeeBreakdown[employeeId].totalPaid += record.netSalary;
      } else {
        summary.employeeBreakdown[employeeId].totalUnpaid += record.netSalary;
      }
    });
    
    res.json(summary);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;