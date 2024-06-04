
import React, { useState, useEffect } from 'react';
import {
  Grid, Button, TextField, Typography, TableCell, TableRow,
  TableBody, Table, TableHead, TableContainer, TablePagination,OutlinedInput,
  FormControl, InputLabel, MenuItem, Select, Checkbox, Autocomplete,InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getClientList, getCamerasList } from 'src/api/VideoArchivesApi';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Iconify from "src/components/Iconify";
import SearchNotFound from "src/components/SearchNotFound";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

const months = [
  { name: 'January', value: '1' },
  { name: 'February', value: '2' },
  { name: 'March', value: '3' },
  { name: 'April', value: '4' },
  { name: 'May', value: '5' },
  { name: 'June', value: '6' },
  { name: 'July', value: '7' },
  { name: 'August', value: '8' },
  { name: 'September', value: '9' },
  { name: 'October', value: '10' },
  { name: 'November', value: '11' },
  { name: 'December', value: '12' }
];

const TotalFalseEvents = () => {
  const [filterName, setFilterName] = useState('');
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [activeCameras, setActiveCameras] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [error, setError] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientInfo, setClientInfo] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedClientCameras, setSelectedClientCameras] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = [(currentYear - 1).toString(), currentYear.toString(), (currentYear + 1).toString()];

  useEffect(() => {
    getClientList((response) => {
      if (response.status === 200) {
        setClientInfo(response.data);
      }
    });
    getCamerasList((response) => {
      if (response.status === 200) {
        setCameras(response.data);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedClient) {
      const filteredCameras = cameras.filter(camera => camera.clientid === selectedClient);
      setSelectedClientCameras(filteredCameras);
    } else {
      setSelectedClientCameras([]);
    }
  }, [selectedClient, cameras]);

  const handleButtonClick = () => {
    if (!value1) {
      setError(true);
      setIsMonthSelected(true);
    }
    if (!value2) {
      setError(true);
      setIsYearSelected(true);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
  };

  const columns = [
    { id: 'Sno', name: 'Sno' },
    { id: 'ClientName', name: 'Client Name' },
    { id: 'CameraName', name: 'Camera Name' },
    { id: 'FalseEvents', name: 'False Events' },
    { id: 'TotalFalseEvents', name: 'Total Events Count' }
  ];

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((item) => (
    item.ClientName && item.ClientName.toLowerCase().includes(filterName.toLowerCase())
  ));

  const isDataNotFound = filteredData.length === 0;

  return (
    <Grid sx={{ marginLeft: '1rem' }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginTop: '0.2rem' }}>
        <Grid item xs={3}>
          <Autocomplete
            value={value1}
            onChange={(event, newValue) => {
              setIsMonthSelected(false);
              setValue1(newValue);
            }}
            options={months}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Month"
                label="Month"
                variant="outlined"
                error={error && isMonthSelected}
              />
            )}
          />
          {error && isMonthSelected && <Typography variant="body2" color="error">Select Month</Typography>}
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            value={value2}
            onChange={(event, newValue) => {
              setIsYearSelected(false);
              setValue2(newValue);
            }}
            options={years}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Year"
                label="Year"
                variant="outlined"
                error={error && isYearSelected}
              />
            )}
          />
          {error && isYearSelected && <Typography variant="body2" color="error">Select Year</Typography>}
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
              {clientInfo.map((client) => (
                <MenuItem key={client.ID} value={client.ID}>
                  {client.displayname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && !selectedClient && (
            <Typography variant="body2" color="error">
              Select Client
            </Typography>
          )}
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            multiple
            id="tags-outlined-cameras"
            options={selectedClientCameras}
            getOptionLabel={(option) => `${option.deviceid} ${option.devicename}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Camera"
                placeholder="Search Camera ID Or Name..."
              />
            )}
          />
        </Grid>
        <Grid item xs={3} sx={{ marginTop: 2 }}>
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

      <Grid container spacing={2} alignItems="center" sx={{ marginTop: '1rem' }}>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f2f2f2' }}>
                {columns.map((item) => (
                  <TableCell key={item.id}>
                    {item.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={`${item.EventNo}-${index}`}>
                    {columns.map((column, i) => (
                      <TableCell key={i}>
                        {column.id === 'Sno' ? page * rowsPerPage + index + 1 : item[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
            {isDataNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    No Data Found
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>

      <Grid>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          page={page}
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          component="div"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{ backgroundColor: '#f2f2f2' }}
        />
      </Grid>
    </Grid>
  );
};

export default TotalFalseEvents;
