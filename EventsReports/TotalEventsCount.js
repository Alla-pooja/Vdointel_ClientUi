import React, { useState,useEffect } from 'react';
import { filter } from 'lodash';
import Iconify from 'src/components/Iconify';
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
  Table,FormControl,InputLabel,MenuItem,
  TableHead,Select,
  TableContainer,TablePagination,Toolbar,OutlinedInput, Stack
} from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from 'src/components/Scrollbar';
import { styled } from '@mui/material/styles';
import { Construction } from '@mui/icons-material';
//import OutlinedInput from '@mui/material';
import SearchNotFound from 'src/components/SearchNotFound';
import { getClientList } from 'src/api/VideoArchivesApi';


const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    // justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
  }));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    marginLeft: 15,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
    '& fieldset': {
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


const TotalEventsCount = ({clientList}) => {

  const options3 =clientList //['Choice X', 'Choice Y', 'Choice Z'];

  const [filterName, setFilterName] = useState('');  

  const [value1, setValue1] = useState(null);
  

  const [value2, setValue2] = useState(null);
  const currentYear = new Date().getFullYear();
  const years = [(currentYear - 1).toString(),currentYear.toString(),(currentYear+1).toString()];
  const [isClientSelected, setIsClientSelected] = useState(false);

  //console.log(years)

  const [error,setError]=useState(false);
  const [isMonthSelected,setIsMonthSelected]=useState(false);
  const [isYearSelected,setIsYearSelected]=useState(false);
  const [selectedClient,setSelectedClient]=useState('');
  const [clientInfo, setClientInfo] = useState([]);

  const handleButtonClick = () => {
    // console.log(value1,value2)
    pageChange(0)
    if(!value1){
        setError(true)
        setIsMonthSelected(true)
    }

    if(!value2){
        setError(true)
        setIsYearSelected(true)
    }

    //let clientList=value3.map(item=>item.ID)

    // if(!value3){
    //     setError(true)
    //     setSelectedClient(true)
    // }
  };

    const columns = //clientList
    [
        { id: 'Sno', name: 'Sno' },
        { id: 'ClientName', name: 'Client Name' },
        { id: 'TrueEvents', name: 'True Events' },
        { id: 'FalseEvents', name: 'False Events' },
        { id: 'Escalations', name: 'Escalations' },
        { id: 'TotalEventsCount', name: 'Total Events Count' }


    ]


const [data, setData] = useState([])
const [row,rowChange] = useState([])
const [page,pageChange]=useState(0)
const [rowPerPage,rowPerPageChange]=useState(5)

// useEffect(() => {
//     setData(values)
// }, [])

const handleChangePage = (event,newpage)=>{
    if(newpage===0){
        pageChange(0);
    }
    else{
        pageChange(newpage)
    }
}
const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
    console.log("selected Client",selectedClient)
  };
const handleRowsPerPage = (e)=>{
    rowPerPageChange(e.target.value)
    pageChange(0)
}

const handleFilterByName = (event) => {
    debugger
    const pattern=event.target.value.trim()
    setFilterName(pattern);
  };

  const filteredData = data.filter((item) => {
    //console.log(item)
    return (
      (item.ClientName && item.ClientName.toLowerCase().includes(filterName.toLowerCase())) 
    );
  });
  
  const isDataNotFound = filteredData.length === 0;

//   useEffect(()=>{
//     console.log(filterName)
//   },[filterName])

  TotalEventsCount.prototype = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  }
  useEffect(() => {
    getClientList((response) => {
      if (response.status === 200) {
        setClientInfo(response.data);
      }
    });
  }, []);

  

  return (
    <Grid sx={{ marginLeft: '1rem' }}>
        <Grid container spacing={2} alignItems="center" sx={{marginTop:'0.2rem'}}>
        
            <Grid item xs={3}>
               
                <Autocomplete
                value={value1}
                onChange={(event, newValue) => {  
                    setIsMonthSelected(false)                  
                    setValue1(newValue);
                }}
                options={months}
                getOptionLabel={(option)=>option.name}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    placeholder="Select Month"
                    label='Month'
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
                    setIsYearSelected(false)
                    setValue2(newValue);
                }}
                options={years}
                getOptionLabel={(option)=>option}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    placeholder="Select Year"
                    label='Year'
                    variant="outlined"
                   error={error && isYearSelected}
                    />
                )}
                />
                {error && isYearSelected && <Typography variant="body2" color="error">Select Year</Typography>} 
            </Grid>
            
            <Grid item xs={3} sx={{ height: "100%"}}>
          {/* <FormControl fullWidth>
          <Autocomplete
              options={clientInfo}
              getOptionLabel={(option) => `${option.displayname}`}
              onChange={handleClientChange}
              value={selectedClient}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      id="select-client"
                      label="Select client"
                      variant="outlined"
                  />
              )}
          />
          </FormControl> */}

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


          {error && isClientSelected && (
            <Typography variant="body2" color="error">
              Select Client
            </Typography>
          )}
        </Grid>
               {/* <Grid item xs={3} sx={{ height: "100%" }}>
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
            {error && selectedClient && <Typography variant="body2" color="error">Select atleast one client</Typography>}

          </Grid> */}
            
            <Grid item xs={3} sx={{marginTop:2}}>
                    <Button variant="contained" onClick={handleButtonClick}>
                    Submit
                    </Button>     
                    <Button variant="contained" sx={{marginLeft:1}}>
                            Export To Excel
                    </Button>               
            </Grid>
        
        </Grid>

        <Grid container spacing={2} sx={{marginTop:2}}>
            <SearchStyle
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
            }
            /> 
        </Grid>        
   
        <Grid container spacing={2} alignItems="center" sx={{ marginTop: '1rem' }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table stickyHeader>
                <TableHead>
                            <TableRow sx={{backgroundColor: '#f2f2f2'}}>
                                {columns.map(item => {
                                    return <TableCell key={item.id}>
                                        {item.name}
                                    </TableCell>
                                })}
                            </TableRow>
                </TableHead>
                <TableBody>
                        {filteredData
                            .slice(page * rowPerPage, (page * rowPerPage) + rowPerPage)
                            .map((item, index) => {
                            return (
                                <TableRow key={`${item.EventNo}-${index}`}>
                                {columns.map((column, i) => {
                                    if (column.id === 'Sno') {
                                    return <TableCell key={i}>{page * rowPerPage + index + 1}</TableCell>;
                                    } else {
                                    return <TableCell key={i}>{item[column.id]}</TableCell>;
                                    }
                                })}
                                </TableRow>
                            );
                            })}
                </TableBody>

                {isDataNotFound && (
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

        <Grid>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                page={page}
                count={filteredData.length} 
                rowsPerPage={rowPerPage}
                component="div"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleRowsPerPage}
                sx={{ backgroundColor: '#f2f2f2' }}
            />
        </Grid>
    </Grid>
  );
};

export default TotalEventsCount;
