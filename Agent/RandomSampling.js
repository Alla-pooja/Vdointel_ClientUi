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
  Select,
  InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
  Toolbar,
  OutlinedInput,
  Stack,
  Dialog,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
//import OutlinedInput from '@mui/material';
import SearchNotFound from "src/components/SearchNotFound";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { styled } from "@mui/material/styles";
import { getClientList } from "src/api/VideoArchivesApi";
import { getAgentEscalteReport } from "src/api/escalatedReports";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import * as XLSX from 'xlsx';

const RandomSampling = ({ clientList }) => {
  const options3 = clientList; //['Choice X', 'Choice Y', 'Choice Z'];

  const [filterName, setFilterName] = useState("");
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = [
    (currentYear - 1).toString(),
    currentYear.toString(),
    (currentYear + 1).toString(),
  ];

  //console.log(years)
  const [selectedClient, setSelectedClient] = useState(""); // State for selected client
  const [clientInfo, setClientInfo] = useState([]); // State for storing client data
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [isValidFrom, setIsValidFrom] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const columns =
    //clientList
    [
      { id: "Sno", name: "Sno" },
      { id: "Name", name: "QC List Name" },
      { id: "Date", name: "Date" },
      { id: "fromtime", name: "From Time" },
      { id: "totime", name: "To Time" },
      { id: "type", name: "Event Type" },
      { id: "devices", name: "Devices" },
      { id: "group", name: "Group By" },
      { id: "events", name: "Number of Events" },
      {id:"action",name:'Action'},
    ];
  const values = [
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
    {
      Name: "Agent 1",
      Date: "20-05-24",
      fromtime: 2,
      totime: 23,
      type: 30,
      devices: 1,
      group: 90,
      events: 10,
    },
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

  const handleButtonClick = () => {
    const fromDatefor = fromDate;
    const isValidDate = (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    };

    const parseDate = (dateString) => {
      if (!isValidDate(dateString)) {
        console.error("Invalid date:", dateString);
        return null; // Return null if the date string is invalid
      }
      return new Date(dateString);
    };

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fromDateObj = parseDate(fromDatefor);
    const formattedFromDate = "";
    const formattedToDate = "";

    if (fromDateObj) {
      const formattedFromDate = formatDateTime(fromDateObj);
      console.log("Formatted fromDate:", formattedFromDate, formattedToDate);

      const clientId = selectedClient ? selectedClient : 0;

      const body = {
        from_datetime: formattedFromDate,
        from_time: formattedToDate,
        to_time: clientId,
      };
      getAgentEscalteReport(body, (response) => {
        if (response.status === 200) {
          console.log("messages ", response.data);
          setData(response.data);
          // setDeviceStats(response.data)
        }
      });
    }
  };

  const exportToExcel = () => {
    if (filteredData.length) {
      const sheetName = "Random sampling";
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFilterByName = (event) => {
    debugger;
    const pattern = event.target.value.trim();
    setFilterName(pattern);
  };
  const handleFromDateChange = (date) => {
    setFromDate(date);
    setIsValidFrom(!!date);
  };
  const handleFromTimeChange = (time) => {
    setFromTime(time);
  };
  const handleToTimeChange = (time) => {
    setToTime(time);
  };
  const handleDeleteRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };
  

  const filteredData = data.filter((item) => {
    //console.log(item)
    return (
      (item.Name &&
        item.Name.toLowerCase().includes(filterName.toLowerCase())) 
      
      
    );
  });

  const isDataNotFound = filteredData.length === 0;
  RandomSampling.prototype = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };

  //   useEffect(() => {
  //     getClientList((response) => {
  //       if (response.status === 200) {
  //         setClientInfo(response.data);
  //       }
  //     });
  //   }, []);
  useEffect(() => {
    setData(values);
  }, []);
  useEffect(() => {
    getClientList((response) => {
      if (response.status === 200) {
        console.log("response data", response.data);
        setClientInfo(response.data);
      }
    });
  }, []);

  return (
    <>
      <Grid sx={{ marginLeft: "1rem" }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ marginTop: "0.2rem" }}
        >
          <Grid item xs={4} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="From Date"
                  id="from-date"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  format="YYYY-MM-DD HH:mm"
                  value={fromDate}
                  required={true}
                  onChange={handleFromDateChange}
                  sx={{ border: "none" }}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="From Time"
                  value={fromTime}
                  onChange={handleFromTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="To Time"
                  value={toTime}
                  onChange={handleToTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid
            container
            spacing={4}
            alignItems="center"
            sx={{ marginTop: "0.2rem", marginLeft: "0.1rem" }}
          >
            <Grid item xs={14} sm={3} md={4}>
              <FormControl fullWidth>
                <InputLabel>Event Types</InputLabel>

                <Select
                  // value={dropdown1Value}
                  // onChange={handleDropdown1Change}
                  label="event type"
                  fullWidth
                >
                  <MenuItem value="True Events">True Events</MenuItem>
                  <MenuItem value="False Events">False Events</MenuItem>
                  <MenuItem value="Both">Both</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={14} sm={3} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sampling Type</InputLabel>
                <Select
                  // value={dropdown1Value}
                  // onChange={handleDropdown1Change}
                  label="sampling type"
                  fullWidth
                >
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="Fixed Value">Fixed value</MenuItem>

                  {/* Add your dropdown options here */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
    <TextField
      label="Percentage or Fixed value"
      // value={textField1Value}
      // onChange={(e) => setTextField1Value(e.target.value)}
      fullWidth
    />
  </Grid>
          </Grid>

          <Grid
            item
            xs={3}
            sx={{ height: "100%", marginTop: 0.5, marginBottom: 0.5 }}
          >
            <Button variant="contained" onClick={handleButtonClick}>
              Get Audits
            </Button>
            <Button variant="contained" sx={{ marginLeft: 1 }} onClick={exportToExcel}>
              Export To Excel
            </Button>
          </Grid>
        </Grid>

        {/* <Grid container spacing={2} sx={{ marginTop: 2 }}>
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
      </Grid> */}

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
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">{index + 1}</TableCell>
                        {/* <TableCell>
                    <img
                      src={row.SnapshotUrl}
                      alt={`Image NotFound `}
                      style={{ maxWidth: '50px', maxHeight: '100px', cursor: 'pointer' }}
                      onClick={() => handlePlayImage(row)}

                    />
                    </TableCell>                     */}
                        <TableCell align="left">{row.Name}</TableCell>
                        <TableCell align="left">{row.Date}</TableCell>
                        <TableCell align="left">{row.fromtime}</TableCell>
                        <TableCell align="left">{row.totime}</TableCell>
                        <TableCell align="left">{row.type}</TableCell>

                        <TableCell align="left">{row.devices}</TableCell>
                        <TableCell align="left">{row.group}</TableCell>
                        <TableCell align="left">{row.events}</TableCell>
                        <TableCell align="left">
                          <Button
                            variant="contained"
                            onClick={() => handleDeleteRow(index)}
                          >
                            Delete
                          </Button>
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

        <Grid>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
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

export default RandomSampling;
