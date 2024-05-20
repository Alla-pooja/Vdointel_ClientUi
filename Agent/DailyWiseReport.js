
import React, { useState, useEffect } from "react";
import Iconify from "src/components/Iconify";
import {
  InputAdornment,
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
  Toolbar,
  OutlinedInput,
  DialogActions,
  DialogTitle,
  Stack,
  Dialog,
  DialogContent
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { styled } from "@mui/material/styles";
import { getDailyWiseReports } from "src/api/DailywiseReport";
import * as XLSX from 'xlsx';

const DailyWiseReport = () => {
  const [filterName, setFilterName] = useState("");
  const [value, setValue] = useState(null);
  const [reportDate, setReportDate] = useState('');
  const [data, setData] = useState([]);  
  const [imageURL, setImageURL] = useState('');
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  const [latency, setLatency] = useState(3); // Set latency to 3 by default
  const [highlightedCount, setHighlightedCount] = useState(0);
  const [avrgTime, setAvarageTime] = useState(0);
  const [selectedRow, setSelectedRow] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportDateError, setIsReportDateError] = useState(false); // State to track report date error
  
  const columns = [
    { id: "Sno", name: "Sno" },
    { id: "date", name: "Date" },
    { id: "CameraId", name: "Camera Id" },
    { id: "devicename", name: "Camera Name" },
    { id: "events_count", name: "Total Events" },
    { id: "total_minutes", name: "Time To Review(Min)" },
    { id: "Latency", name: "Latency" },
  ];

  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: "flex",
    padding: theme.spacing(0, 1, 0, 3),
  }));

  const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    marginLeft: 15,
    transition: theme.transitions.create(["box-shadow", "width"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
    "& fieldset": {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`,
    },
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredData = data.filter((item) => {
    return (
      (item.devicename &&
        item.devicename.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.EventsRaisedTime &&
        item.cameraname.toLowerCase().includes(
          filterName.toLowerCase()
        ))
    );
  });

  // Export to Excel
  const exportToExcel = () => {
    if (filteredData.length) {
      const sheetName = "Daily Wise Report";
      const headers = Object.keys(filteredData[0]);
      const data = [headers, ...filteredData.map(item => headers.map(key => item[key]))];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const filename = sheetName + '.xlsx';

      const maxColumnWidths = {};
      headers.forEach(header => {
        maxColumnWidths[header] = Math.max(
          20,
          ...data.map(row => (row[header] || '').toString().length)
        );
      });
      const columnWidths = headers.map(header => ({
        wch: maxColumnWidths[header]
      }));

      ws['!cols'] = columnWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet 1');

      XLSX.writeFile(wb, filename);
    } else {
      alert('No data to Export.');
    }
  };

  const handleCameraNameClick = (row) => {
    setSelectedRow(row);
    setImageURL(row.snapshot_url);
    setOpenDialog(true); // Open the dialog box
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isDataNotFound = filteredData.length === 0;

  DailyWiseReport.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };

  // For converting into "YYYY=MM-DD" format because it accepts that format ONLY
  const handleChange = (newValue, event) => {
    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    setReportDate(formattedDate);
    setIsReportDateError(false); // Reset error state when date is changed
    console.log("Formatted date:", formattedDate);
  };

  const handleLatency = (event) => {
    const latencyValue = event.target.value;
    setLatency(latencyValue);
    console.log("Updated latency:", latencyValue); // Debugging line
  };
  const reportDay = new Date(reportDate).toLocaleDateString('en-US', { weekday: 'long' });
  console.log("Report Day:", reportDay);

  // Get reports functionality
  const handleButtonClick = (event) => {
    console.log("Selected Time:", event.target.value);
    console.log("Report Date:", reportDate);
    console.log("Latency:", latency); // Debugging line
    if (!reportDate) {
      // Handle the error case where the date is not selected
      setIsReportDateError(true); // Set error state
      console.error("Report date is not selected");
      return;
    }
    // Calculate the day for the selected report date
  const reportDay = new Date(reportDate).toLocaleDateString('en-US', { weekday: 'long' });
  console.log("Report Day:", reportDay);

    getDailyWiseReports({
      date: reportDate,
      latency: latency // Ensure correct value assignment
    },
    (response) => {
      if (response.status === 200) {
        setData(response.data);
        console.log("Response data:", response.data);
      }
    });
  };

  useEffect(() => {
    // Count the number of items with latency higher than average
    const highlightedItemsCount = data.filter(item => parseFloat(item.Latency) > avrgTime).length;
    setHighlightedCount(highlightedItemsCount);
  }, [data]);
  
  return (
    <>
     <Grid sx={{ marginLeft: "1rem" }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginTop: "0.2rem" }}
        >
          <Grid item xs={3} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Report Date"
                  format="YYYY-MM-DD"
                  value={value}
                  onChange={handleChange}
                  name="reportDate"
                  renderInput={(params) => <TextField {...params}  error={isReportDateError} helperText={isReportDateError ? "Report date is required" : ""} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={3} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                type="number"
                label="Latency"
                value={latency} // Set the default value to latency state
                onChange={handleLatency}
              />
            </FormControl>
          </Grid>

          <Grid item xs={3} sx={{ height: "100%", marginTop: 2 }}>
            <Button variant="contained" onClick={handleButtonClick}>
              Get Reports
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: 1 }}
              onClick={exportToExcel}
            >
              Export To Excel
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <SearchStyle
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled", width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginTop: "1rem" }}
        >
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                    {columns.map((item) => {
                      return <TableCell key={item.id}>{item.name}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.CameraId}</TableCell>
                      <TableCell align="left">
                        <a href="#" onClick={() => handleCameraNameClick(row)}>
                          {row.devicename}
                        </a>
                      </TableCell>
                      <TableCell align="left">{row.events_count}</TableCell>
                      <TableCell align="left">{row.total_minutes}</TableCell>
                      <TableCell align="left">{row.Latency}</TableCell>
                    </TableRow>
                  ))}
                     {emptyRows >0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}
                </TableBody>
                {isDataNotFound &&(
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={openDialog}
          onClose={handleDialogClose}
        >
          <DialogTitle>Camera Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={6} style={{ marginTop: '10px' }}>
                <TextField
                  fullWidth
                  autoComplete="CameraId"
                  type="text"
                  label="CameraId"
                  value={selectedRow.CameraId}
                />
              </Grid>
              <Grid item md={6} style={{ marginTop: '10px' }}>
                <TextField
                  fullWidth
                  autoComplete="cameraName"
                  type="text"
                  label="Camera Name"
                  value={selectedRow.devicename}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="clientName"
                  type="text"
                  label="Client Name"
                  value={selectedRow.Name}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="TimeZone"
                  type="text"
                  label="TimeZone"
                  value={selectedRow.TimeZone}
                />
              </Grid>
              <Grid item md={6}>
              <TextField
                  fullWidth
                  autoComplete="generatedEvents"
                  type="number"
                  label="Generated Events"
                  value={selectedRow.events_count}
                />
              </Grid>
              
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="Escalation"
                  type="number"
                  label="No. Of Escalated Events"
                  value={selectedRow.escalated_count}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Client Monitoring Timings
                </Typography>
                <TableContainer component={Box}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>From Hour</TableCell>
                        <TableCell>To Hour</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{reportDay}</TableCell>
                        <TableCell>{selectedRow.FromHour}</TableCell>
                        <TableCell>{selectedRow.ToHour}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDialogClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Grid>
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        </Grid>
      </Grid>
    </>
  );
};

export default DailyWiseReport;
