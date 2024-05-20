
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
  OutlinedInput,
  Stack,Dialog,DialogContent
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import { Construction } from "@mui/icons-material";
//import OutlinedInput from '@mui/material';
import SearchNotFound from "src/components/SearchNotFound";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { styled } from "@mui/material/styles";
import { getClientList } from "src/api/VideoArchivesApi";
import { getAgentEscalteReport } from "src/api/escalatedReports";


const QcReports = ({ clientList }) => {
  const options3 = clientList; //['Choice X', 'Choice Y', 'Choice Z'];

  const [filterName, setFilterName] = useState("");
  const currentYear = new Date().getFullYear();
  const years = [
    (currentYear - 1).toString(),
    currentYear.toString(),
    (currentYear + 1).toString(),
  ];

  //console.log(years)
  const [selectedClient, setSelectedClient] = useState(''); // State for selected client
  const [clientInfo, setClientInfo] = useState([]); // State for storing client data
 
  const [error, setError] = useState(false);

  const [isClientSelected, setIsClientSelected] = useState(false);

  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isValidFrom, setIsValidFrom] = useState(false);
  const [isValidTo, setIsValidTo] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);


  const columns =
  //clientList
  [
    { id: "Sno", name: "Sno" },
    { id: "Name", name: "Agent Name" },
    { id: "Production", name: "Production" },
    { id: "Tier", name: "Tier-2" },
    { id: "Escalations", name: "Escalations" },
    { id: "Sampling", name: "QA Sampling" },
    { id: "Validation", name: "Validation" },
    { id: "score", name: "QA Score(%)" },
    { id: "grade", name: "Grade" },
  ];
  const values =[
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},
    {Name:'Agent 1',Production:1023,Tier:2,Escalations:23,Sampling:30,Validation:1,score:90,grade:'A'},

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
    const toDatefor = toDate;
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
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fromDateObj = parseDate(fromDatefor);
    const toDateObj = parseDate(toDatefor);
    const formattedFromDate = ''
    const formattedToDate = ''

    if (fromDateObj && toDateObj) {
      const formattedFromDate = formatDateTime(fromDateObj);
      const formattedToDate = formatDateTime(toDateObj);
      console.log('Formatted fromDate:', formattedFromDate ,formattedToDate );

      const clientId = selectedClient ? selectedClient : 0;

      const body = { 
        from_datetime : formattedFromDate,
        to_datetime : formattedToDate,
        client_id : clientId
      }
      getAgentEscalteReport(body,(response) => {
        if (response.status === 200) {
          console.log("messages ",response.data)
          setData(response.data)
          // setDeviceStats(response.data)
        }
      })

    }

    

  };


 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClientChange = (event) => {
    console.log("selected Group", event.target.value);
    setSelectedClient(event.target.value)
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
  const handleValidationClick =()=>{

  }
  const handleToDateChange = (date) => {
    setToDate(date);
    setIsValidTo(!!date);
  };

  const filteredData = data.filter((item) => {
    //console.log(item)
    return (
      (item.EventNo &&
        item.EventNo.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.EventType &&
        item.EventType.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.CmaeraName &&
        item.CmaeraName.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.EventsRaisedTime &&
        item.EventsRaisedTime.toLowerCase().includes(
          filterName.toLowerCase()
        )) ||
      (item.AuditedBy &&
        item.AuditedBy.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.SecondAuditedBy &&
        item.SecondAuditedBy.toLowerCase().includes(
          filterName.toLowerCase()
        )) ||
      (item.SecondAuditedTime &&
        item.SecondAuditedTime.toLowerCase().includes(filterName.toLowerCase()))
    );
  });

  const isDataNotFound = filteredData.length === 0;
  QcReports.prototype = {
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
        <Grid item xs={3} sx={{ height: "100%" }}>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="To Date"
                  id="to-date"
                  required
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  format="YYYY-MM-DD HH:mm"
                  value={toDate}
                  onChange={handleToDateChange}
                  sx={{ border: "none" }}
                />
              </LocalizationProvider>
            </FormControl>
        </Grid>

        <Grid item xs={3} sx={{ height: "100%"}}>
         
          <FormControl fullWidth>
                <InputLabel id="group-label">Type</InputLabel>
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


          {error && isClientSelected && (
            <Typography variant="body2" color="error">
              Select Client
            </Typography>
          )}
        </Grid>

        <Grid item xs={3} sx={{ height: "100%", marginTop: 2 }}>
          <Button variant="contained" onClick={handleButtonClick}>
            Submit
          </Button>
          <Button variant="contained" sx={{ marginLeft: 1 }}>
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
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                    <TableCell align="left">{row.Production}</TableCell>
                    <TableCell align="left">{row.Tier}</TableCell>
                    <TableCell align="left">{row.Escalations}</TableCell>
                    <TableCell align="left">{row.Sampling}</TableCell>
                    <TableCell align="left">
                        <a href="#" onClick={() => handleValidationClick(row)}>
                          {row.Validation}
                        </a>
                      </TableCell>                    <TableCell align="left">{row.score}</TableCell>
                    <TableCell align="left">{row.grade}</TableCell>

                  
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

export default QcReports;
