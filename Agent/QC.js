import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Share, CloudDownload } from '@mui/icons-material';

const QC = () => {
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRow, setSelectedRow] = useState('');
  const[selectedSpeed,setSelectedSpeed]=useState(1);
  const [currentDeviceVideos, setCurrentDeviceVideos] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  // Mock data for video and event details
  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
  const eventDetails = {
    eventNumber: "12345",
    eventName: "Sample Event",
    agentName: "Agent Smith",
    secondAgentName: "Agent Doe",
  };

  useEffect(() => {
    // Fetch clients data (mock data here for example purposes)
    setClients([
      { displayname: "Client A" },
      { displayname: "Client B" },
      { displayname: "Client C" },
    ]);

    // Fetch table data (mock data here for example purposes)
    setTableData([
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
      { Camera: 1, Eventid: "Item 1", Time: "Value 1" },
    ]);
  }, []);

  const handleClientChange = (event, value) => {
    setClient(value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handlePrevious =(event) =>{
    if(currentDeviceIndex>0){
      setCurrentDeviceIndex(currentDeviceIndex-1);
    }
  }
  const handleNext =(event) =>{
    if(currentDeviceIndex>0){
      setCurrentDeviceIndex(currentDeviceIndex-1);
    }
  }
  const handleSpeedChange =(event)=>{
    setSelectedSpeed(event.target.value);

  }
  const handleSubmit = () => {
    console.log("Selected Option:", selectedOption);
    console.log("Location:", location);
  };

  return (
    <Grid container spacing={3} sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="tags-outlined-client"
          options={clients}
          getOptionLabel={(option) => option.displayname}
          onChange={handleClientChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Qc Sampling"
              placeholder="Search Client Name..."
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3} sx={{ height: '80%' }}>
          <Grid item xs={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Camera</TableCell>
                        <TableCell>Event Id</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.Camera}</TableCell>
                          <TableCell>{row.Eventid}</TableCell>
                          <TableCell>{row.Time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
  <Grid container spacing={2} alignItems="center" sx={{ marginTop: "0.2rem" }}>
    <Grid item xs={4}>
      <TextField
        fullWidth
        autoComplete="location"
        type="text"
        label="Location"
        value={selectedRow.location}
      />
    </Grid>
    <Grid item xs={4}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="select-label">Select Option</InputLabel>
        <Select
          label="Select Option"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <MenuItem value={"Option 1"}>Option 1</MenuItem>
          <MenuItem value={"Option 2"}>Option 2</MenuItem>
          <MenuItem value={"Option 3"}>Option 3</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: '16px' }}
      >
        Submit
      </Button>
    </Grid>
  </Grid>
  <Grid container spacing={1} alignItems="center" sx={{ marginTop: '16px' }}>

  <Grid item xs={12} md={6} sx={{paddingRight:'19px'}}>
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Grid>
    <Grid item xs={10} md={5} sx={{paddingLeft:'19px',height:'50%'}}>
      <TextField
        fullWidth
        multiline
        rows={4}
        autoComplete="feedback"
        type="text"
        label="Feedback"
        placeholder="Provide your feedback here"
      />
    </Grid>
    </Grid>

  <Grid container spacing={2} sx={{ marginTop: '16px' }}>
    <Grid item xs={1}>
      <FormControl fullWidth>
        <InputLabel id="speed-label">Speed</InputLabel>
        <Select
          labelId="speed-label"
          label="Speed"
          value={selectedSpeed}
          onChange={handleSpeedChange}
          variant="outlined"
          size="large"
        >
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
          <MenuItem value={3}>3x</MenuItem>
          <MenuItem value={5}>5x</MenuItem>
          <MenuItem value={10}>10x</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrevious}
        startIcon={<ArrowBackIos />}
        disabled={currentDeviceIndex === 0}
        sx={{ marginTop: '16px' }}
      />
    </Grid>
    <Grid item xs={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        startIcon={<ArrowForwardIos />}
        disabled={currentDeviceIndex === currentDeviceVideos.length - 1}
        sx={{ marginTop: '16px', marginLeft: '15px' }}
      />
    </Grid>
  </Grid>

  <Grid container spacing={2} sx={{ marginTop: '16px' }}>
    <Grid item xs={12} md={6} style={{ marginTop: '10px' }}>
      <TextField
        fullWidth
        autoComplete="Event Notes"
        type="text"
        label="Events Notes"
        value={eventDetails.eventNumber}
      />
    </Grid>
    <Grid item xs={12} md={6} style={{ marginTop: '10px' }}>
      <TextField
        fullWidth
        autoComplete="Event Time"
        type="text"
        label="Event Time"
        value={eventDetails.eventNumber}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        autoComplete="EventType"
        type="text"
        label="Event Type"
        value={eventDetails.eventName}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        autoComplete="reviewed"
        type="text"
        label="First Reviewed By"
        value={eventDetails.agentName}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        autoComplete="second Reviewed"
        type="text"
        label="Second Reviewed By"
        value={eventDetails.secondAgentName}
      />
    </Grid>
  </Grid>
</CardContent>


            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QC;
