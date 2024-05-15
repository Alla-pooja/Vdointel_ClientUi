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
import * as XLSX from 'xlsx';
const DailyWiseReport = () => {
  const [filterName, setFilterName] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [row, rowChange] = useState([]);
  const [page, pageChange] = useState(0);
  const [rowPerPage, rowPerPageChange] = useState(5);
  const[date,setDate]=useState(null);
  const [isValidFrom, setIsValidFrom] = useState(false);
  const [isValidTo, setIsValidTo] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
  const [maxWidth, setMaxWidth] = useState('md');
  const [timezones, setTimezone] = useState([])
  const [timezone, setZone] = useState('')
  const [latency, setLatency] = useState(3); // Set latency to 3 by default

  const columns =
  //clientList
  [
    { id: "Sno", name: "Sno" },
    { id: "Date", name: "Date" },
    { id: "CameraId", name: "Camera Id" },
    { id: "cameraname", name: "Camera Name" },
    { id: "auditedby", name: "Audited By" },
    { id: "totaleventstime", name: "Total Events Time" },
    { id: "timetoreview", name: "Time To Review(Min)" },
    { id: "Latency", name: "Latency" },
  ];
  const values = [
    { Date: '12-04-2023', CameraId: 123, cameraname: 'camera1', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 456, cameraname: 'camera2', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 789, cameraname: 'camera3', auditedby: 0, totaleventstime: 0, timetoreview: 0,Latency:0 },
    { Date: '12-04-2023', CameraId: 101112, cameraname: 'camera4', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 131415, cameraname: 'camera5', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 161718, cameraname: 'camera6', auditedby: 0, totaleventstime: 0, timetoreview: 0,Latency:0 },
    { Date: '12-04-2023', CameraId: 192021, cameraname: 'camera7', auditedby: 0, totaleventstime: 0, timetoreview: 0,Latency:0 },
    { Date: '12-04-2023', CameraId: 222324, cameraname: 'camera8', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 252627, cameraname: 'camera9', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0},
    { Date: '12-04-2023', CameraId: 282930, cameraname: 'camera10', auditedby: 0, totaleventstime: 0, timetoreview: 0 ,Latency:0}
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


  const handleChangePage = (event, newpage) => {
    if (newpage === 0) {
      pageChange(0);
    } else {
      pageChange(newpage);
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleButtonClick = () => {   
    
  };


  const handleTimeZone = (event) => {
    setZone(event.target.value)
  }
  const handleRowsPerPage = (e) => {
    rowPerPageChange(e.target.value);
    pageChange(0);
  };

  const handleFilterByName = (event) => {
    debugger;
    const pattern = event.target.value.trim();
    setFilterName(pattern);
  };
  
  const filteredData = data.filter((item) => {
    //console.log(item)
    return (    
      (item.CmaeraName &&
        item.cameraname.toLowerCase().includes(filterName.toLowerCase())) ||
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
      const sheetName = "Supervisor Qc Report";
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
    setImageURL(row.snapshot_url); 
    setOpenDialog(true); // Open the dialog box
  };
  

  const handleClose=(event)=>{
    // setOpenDialog(false);
    setOpenDialogImage(false);
  }
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const isDataNotFound = filteredData.length === 0;
  DailyWiseReport.prototype = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };
 

  //................................UseEffects------------------------------------>
  useEffect(() => {
    setData(values)
}, [])
 
  // useEffect(() => {
  //   getClientList((response) => {
  //     if (response.status === 200) {
  //       console.log("response data",response.data);
  //       setClientInfo(response.data);

  //     }
  //   });
  // }, []);

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
                  // value={reportDate}
                  // onChange={(e) => handleFilterBox(e, null, "reportDate")}
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
                autoComplete="Latency"
                type="number"
                label="Latency"
                value={latency} // Set the default value to latency state
                onChange={(e) => setLatency(e.target.value)} 
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
                      <TableCell align="left">{row.Date}</TableCell>
                      <TableCell align="left">{row.CameraId}</TableCell>
                      <a href="#" onClick={() => handleCameraNameClick(row)}>
                        {row.cameraname}
                      </a>{" "}
                      <TableCell align="left">{row.auditedby}</TableCell>
                      <TableCell align="left">{row.totaleventstime}</TableCell>
                      <TableCell align="left">{row.timetoreview}</TableCell>
                      <TableCell align="left">{row.Latency}</TableCell>
                      <TableCell align="left">
                        {row.SupervisorUpdatedOn}
                      </TableCell>
                      <TableCell align="left">
                        {row.is_supervisor_escalated}
                      </TableCell>
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
                />
              </Grid>
              <Grid item md={6} style={{marginTop:'10px'}}>
                <TextField
                  fullWidth
                  autoComplete="cameraName"
                  type="text"
                  label="Camera Name"
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
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  autoComplete="Escalation"
                  type="number"
                  label="No. Of Escalated Events"
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
            onRowsPerPageChange={handleRowsPerPage}
            sx={{ backgroundColor: "#f2f2f2" }}
          />
        </Grid>
      </Grid>

    </>
  );
};

export default DailyWiseReport;
