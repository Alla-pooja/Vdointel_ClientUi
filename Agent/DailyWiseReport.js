import React, { useState, useEffect } from "react";
import { filter } from "lodash";
import Iconify from "src/components/Iconify";
import {
  InputAdornment,
  Grid,
  Box,
  Autocomplete,
  Button,
  TextField,
  Typography,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
  MenuItem,
  Select, InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
  Toolbar,
  OutlinedInput,DialogActions,DialogTitle,
  Link,
  Stack,Dialog,DialogContent
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import { Construction } from "@mui/icons-material";
//import OutlinedInput from '@mui/material';
import SearchNotFound from "src/components/SearchNotFound";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from "@mui/material/styles";
import { getDailyWiseReports } from "src/api/DailywiseReport";
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
const DailyWiseReport = () => {
  const [filterName, setFilterName] = useState("");
  const[value,setValue]=useState('');
  const[value2,setValue2]=useState('');
  const [data, setData] = useState([]);
  const [row, rowChange] = useState([]);
  const [rowPerPage, rowPerPageChange] = useState(5);
  const [isValidTo, setIsValidTo] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [timezones, setTimezone] = useState([])
  const [timezone, setZone] = useState('')
  const [latency, setLatency] = useState(3); // Set latency to 3 by default
  const [highlightedCount, setHighlightedCount] = useState(0);
  const [avrgTime, setAvarageTime] = useState(0);
  const[selectedrow,setSelectedRow]=useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns =
  //clientList
  [
    { id: "Sno", name: "Sno" },
    { id: "date", name: "Date" },
    { id: "CameraId", name: "Camera Id" },
    { id: "devicename", name: "Camera Name" },
    { id: "count", name: "Total Events Time" },
    { id: "total_minutes", name: "Time To Review(Min)" },
    { id: "Latency", name: "Latency" },
  ];
 

  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: "flex",
    // justifyContent: 'space-between',
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
  const handleTimeZone = (event) => {
    setZone(event.target.value)
  }
 

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  
  const filteredData = data.filter((item) => {
    //console.log(item)
    return (    
      (item.devicename &&
        item.devicename.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.EventsRaisedTime &&
        item.cameraname.toLowerCase().includes(
          filterName.toLowerCase()
        ))
    );
  });
  //export to excel
  const exportToExcel = () => {
    if (filteredData.data && filteredData.data.length > 0) {
      const sheetName = filteredData.name;
      const headers = Object.keys(filteredData.data[0]);
      const data = [headers, ...filteredData.data.map(item => headers.map(key => item[key]))];
  
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
    } else if (filteredData.length) {
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
      return;
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
  DailyWiseReport.prototype = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };
   
//for converting in to "YYYY=MM-DD format beacuse it aceepting in that formT ONLY"

const handleChange = (newValue,event) => {
  const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    setValue(formattedDate);

    console.log("format date",formattedDate)
};
const handleLatency=(event) =>{
  setLatency(event.target.latency);
}

// get reports functionaity
  const handleButtonClick = (event) => {
    console.log("selected Time ",event.target.value)
    console.log("selected Time ",value);
    getDailyWiseReports({
      date: value,
      latency: 3
      },
      (response) => {
        if (response.status === 200) {
          setData(response.data)
          console.log("response data",response.data);
        }
      })
  }
 

  //................................UseEffects------------------------------------>
  
 
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
                  renderInput={(params) => <TextField {...params} />}
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
                  {data.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.CameraId}</TableCell>
                      <a href="#" onClick={() => handleCameraNameClick(row)}>
                        {row.devicename}
                      </a>{" "}
                      <TableCell align="left">{row.count}</TableCell>
                      <TableCell align="left">{row.total_minutes}</TableCell>
                      <TableCell align="left">{row.Latency}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>

                {/* {isDataNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}
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
              <Grid item md={6} style={{marginTop:'10px'}}>
                <TextField
                  fullWidth
                  autoComplete="CameraId"
                  type="text"
                  label="CameraId"
                  value={selectedrow.CameraId}
                />
              </Grid>
              <Grid item md={6} style={{marginTop:'10px'}}>
                <TextField
                  fullWidth
                  autoComplete="cameraName"
                  type="text"
                  label="Camera Name"
                  value={selectedrow.devicename}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="clientName"
                  type="text"
                  label="Client Name"
                />
              </Grid>
              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-labell">
                    Timezone
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={timezone}
                    label="Timezone"
                    onChange={handleTimeZone}
                  >
                    {timezones.map((item, key) => (
                      <MenuItem key={key} value={item.Id}>
                        {item.TimeZone}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="generatedEvents"
                  type="number"
                  label="Generated Events"
                  value={selectedrow.count}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="Escalation"
                  type="number"
                  label="No. Of Escalated Events"
                  value={selectedrow.Latency}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
            
              <Grid item xs={12}>

              <Typography variant="h6" gutterBottom style={{marginTop:'20px'}}>
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
                        <TableCell>friday</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>9</TableCell>
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
            page={page}
            count={filteredData.length}
            rowsPerPage={rowPerPage}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ backgroundColor: "#f2f2f2" }}
          />
        </Grid>
      </Grid>

    </>
  );
};

export default DailyWiseReport;
