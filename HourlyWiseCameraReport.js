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
  Link,
  Stack,
  Dialog,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import { Construction } from "@mui/icons-material";
//import OutlinedInput from '@mui/material';
import SearchNotFound from "src/components/SearchNotFound";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx";
import DailyWiseForm from "./DailyWiseForm";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getClientList } from "src/api/VideoArchivesApi";

const HourlyWiseCameraReport = ({ clientList }) => {

  const [filterName, setFilterName] = useState("");
  const [error, setError] = useState(false);

  const [data, setData] = useState([]);
  const [row, rowChange] = useState([]);
  const [rowPerPage, rowPerPageChange] = useState(5);
  const [fromDate, setFromDate] = useState(null);
  const [isValidFrom, setIsValidFrom] = useState(false);
  const [isValidTo, setIsValidTo] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [clientInfo, setClientInfo] = useState([]); // State for storing client data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const[client,setClient]=useState([]);
  const columns =
    //clientList
    [
      { id: "Sno", name: "Sno" },
      { id: "Date", name: "Date" },
      { id: "Clientname", name: "Client" },
      { id: "Camera", name: "Camera" },
      { id: "Hour", name: "Hour" },
      { id: "category", name: "category" },
      { id: "TrueEvents", name: "True Events" },
      { id: "FalseEvents", name: "False Events" },
      { id: "TotalEvents", name: "Total Events" },
      { id: "Aht", name: "AHT" },
      { id: "Art", name: "ART" },

    ];
  const values = [
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,
    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,

    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,

    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,
    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,

    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,

    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,
    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,
    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,
    },
    {
      Date: "12-04-2023",
      Clientname: 123,
      Camera: "camera1",
      Hour:6,
      category:6,
      TrueEvents:10,
      FalseEvents:10,
      TotalEvents: 0,
      Aht: 0,
      Art: 0,

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
  const handleClientChange = (event) => {
    console.log("selected Group", event.target.value);
    setSelectedClient(event.target.value);
  };



  const handleButtonClick = () => {};
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - client.length) : 0;

  
  const handleFilterByName = (event) => {
    debugger;
    const pattern = event.target.value.trim();
    setFilterName(pattern);
  };
  const handleFromDateChange = (date) => {
    setIsValidFrom(!!date);
  };

  const filteredData = data.filter((item) => {
    //console.log(item)
    return (
      (item.EventNo &&
        item.EventNo.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.EventType &&
        item.EventType.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.CmaeraName &&
        item.CmaeraName.toLowerCase().includes(filterName.toLowerCase()))
     
    
    );
  });
  //export to excel
  const exportToExcel = () => {
    if (filteredData.data && filteredData.data.length > 0) {
      const sheetName = filteredData.name;
      const headers = Object.keys(filteredData.data[0]);
      const data = [
        headers,
        ...filteredData.data.map((item) => headers.map((key) => item[key])),
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const filename = sheetName + ".xlsx";

      const maxColumnWidths = {};
      headers.forEach((header) => {
        maxColumnWidths[header] = Math.max(
          20,
          ...data.map((row) => (row[header] || "").toString().length)
        );
      });
      const columnWidths = headers.map((header) => ({
        wch: maxColumnWidths[header],
      }));

      ws["!cols"] = columnWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet 1");

      XLSX.writeFile(wb, filename);
    } else if (filteredData.length) {
      const sheetName = "Supervisor Qc Report";
      const headers = Object.keys(filteredData[0]);
      const data = [
        headers,
        ...filteredData.map((item) => headers.map((key) => item[key])),
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const filename = sheetName + ".xlsx";

      const maxColumnWidths = {};
      headers.forEach((header) => {
        maxColumnWidths[header] = Math.max(
          20,
          ...data.map((row) => (row[header] || "").toString().length)
        );
      });
      const columnWidths = headers.map((header) => ({
        wch: maxColumnWidths[header],
      }));

      ws["!cols"] = columnWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet 1");

      XLSX.writeFile(wb, filename);
    } else {
      alert("No data to Export.");
      return;
    }
  };
  const isDataNotFound = filteredData.length === 0;
  HourlyWiseCameraReport.prototype = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };
  const calculatesubtotal = (data) => {
    let totalTrueEvents = 0;
    let totalFalseEvents = 0;
    let totalTotalEvents = 0;
    let totalAht = 0;
    let totalArt = 0;

    data.forEach((row) => {
      totalTrueEvents += row.TrueEvents;
      totalFalseEvents += row.FalseEvents;
      totalTotalEvents += row.TotalEvents;
      totalAht += row.Aht;
      totalArt += row.Art;
    });

    return {
      TrueEvents: totalTrueEvents,
      FalseEvents: totalFalseEvents,
      TotalEvents: totalTotalEvents,
      Aht: totalAht,
      Art: totalArt,
    };
  };

 
  
  

  
  //................................UseEffects------------------------------------>
  useEffect(() => {
    setData(values);
  }, []);

  useEffect(() => {
    getClientList((response) => {
      if (response.status === 200) {
        console.log("response data",response.data);
        setClientInfo(response.data);

      }
    });
  }, []);


  return (
    <>
      <Grid sx={{ marginLeft: "1rem" }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginTop: "0.2rem" }}
        >
          <Grid item xs={3}>
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
          <Grid item xs={3} sx={{ height: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="group-label">Client</InputLabel>
              <Select
                labelId="group-label"
                value={selectedClient}
                onChange={handleClientChange}
                label="Group"
              >
                {clientInfo.map((group) => (
                  <MenuItem key={group.ID} value={group.ID}>
                    {group.displayname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3} sx={{ height: "100%", marginTop: 2 }}>
            <Button variant="contained" onClick={handleButtonClick}>
                Search
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
                  {data.map((row, index,subtotal) => (
                    <>
                      {/* Render subtotal row if the client changes */}
                     
                      {/* Render regular row */}
                      <TableRow key={row.id}>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">{row.Date}</TableCell>
                        <TableCell align="left">{row.Clientname}</TableCell>
                        <TableCell align="left">{row.Camera}</TableCell>
                        <TableCell align="left">{row.Hour}</TableCell>
                        <TableCell align="left">{row.category}</TableCell>
                        <TableCell align="left">{row.TrueEvents}</TableCell>
                        <TableCell align="left">{row.FalseEvents}</TableCell>
                        <TableCell align="left">{row.TotalEvents}</TableCell>
                        <TableCell align="left">{row.Aht}</TableCell>
                        <TableCell align="left">{row.Art}</TableCell>
                      </TableRow>
                      <TableRow key={`subtotal-${index}`} sx={{ backgroundColor: "#e0e0e0" }}>
                          <TableCell align="left" colSpan={2}></TableCell>
                          <TableCell align="left"></TableCell>

                          <TableCell align="left">Subtotal</TableCell>
                          <TableCell align="left">{subtotal.TrueEvents}</TableCell>
                          <TableCell align="left">{subtotal.FalseEvents}</TableCell>
                          <TableCell align="left">{subtotal.TotalEvents}</TableCell>
                          <TableCell align="left">{subtotal.Aht}</TableCell>
                          <TableCell align="left">{subtotal.Art}</TableCell>
                          <TableCell align="left" colSpan={2}></TableCell>
                        </TableRow>
                    </>
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
            page={page}
            count={filteredData.length}
            rowsPerPage={rowPerPage}
            component="div"
            sx={{ backgroundColor: "#f2f2f2" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default HourlyWiseCameraReport;
