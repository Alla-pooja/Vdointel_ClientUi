import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useState } from 'react';
// material
import {
  Table,
  Stack,
  Avatar,
  // Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Link,
  Dialog,DialogActions,Button,
  TableContainer,
  TablePagination,
  Box,
Typography,Grid,TableHead,TextField,DialogTitle,DialogContent,
  // TableFooter,
  // Chip
} from '@mui/material';
// components
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import { UserListHead,UserListToolbar } from 'src/sections/@dashboard/user';
import Iconify from 'src/components/Iconify';
import ReportTable from 'src/sections/agentreports/ReportTable';
import useClientWiseGEC from 'src/api/ClientWise/useClientWiseGEC';


const TABLE_HEAD = [
    { id: 'Sno', label: 'S.No', alignRight: false },
    { id: 'Preview', label: 'Preview', alignRight: false },
    { id: 'EventNo', label: 'Event No', alignRight: false },
    { id: 'devicename', label: 'Camera Name', alignRight: false },
    { id: 'status', label: 'Event Time', alignRight: false },
    { id: 'status', label: 'Audit Review Time', alignRight: false },
    { id: 'status', label: 'Qc Time', alignRight: false },
    { id: 'status', label: 'Audited By', alignRight: false },
    { id: 'status', label: 'Qc by', alignRight: false },
    { id: 'EventType', label: 'Event Type Agent', alignRight: false },
    { id: 'is_escalated', label: 'Event Type by Qc', alignRight: false },
    { id: 'status', label: 'comment by Agent', alignRight: false },
    { id: 'status', label: 'Commnet by Qc?', alignRight: false },
    { id: 'Comments', label: 'Comments', alignRight: false },
    { id: '' }
];


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


export default function RandomSamplingfrom({reportData}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
 const[selectedRow,setSelectedRow]=useState('');
 const [imageURL, setImageURL] = useState('');
 const [openDialogImage, setOpenDialogImage] = useState(false);
 const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  function applySortFilter(array, comparator, query) {
    return filter(array, (row) => {
      const rowValues = Object.values(row).map((value) =>
        String(value).toLowerCase()
      );
      return rowValues.join(' ').includes(query.toLowerCase());
    }).sort(comparator);
  }


  const handleCameraNameClick = (row) => {
    setSelectedRow(row);
    setImageURL(row.snapshot_url);
    setOpenDialog(true); // Open the dialog box
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = reportData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reportData.length) : 0;

  const filteredUsers = applySortFilter(reportData, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
        <Box>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}    
            reportData={reportData}          
            sx={{ pt: 3}}        
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                //   rowCount={reportData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      // const { id, name, role, status, company, avatarUrl, isVerified } = row;
                      // const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={index}
                          tabIndex={-1}
                          // role="checkbox"
                          // selected={isItemSelected}
                          // aria-checked={isItemSelected}
                        >

                          <TableCell align="left">{index+1}</TableCell>
                          <TableCell align="left">
                            <Link href={row.VideoUrl} target="blank">                                
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar variant="square" alt={row.SnapshotUrl} src={row.SnapshotUrl} />                                 
                              </Stack>
                            </Link>
                          </TableCell>
                          <TableCell align="left">{row.EventNo}</TableCell>
                          <TableCell align="left">
                        <a href="#" onClick={() => handleCameraNameClick(row)}>
                          {row.devicename}
                        </a>
                      </TableCell>                          <TableCell align="left">{row.EventRaised}</TableCell>
                          <TableCell align="left">{row.ReviewStartTime}</TableCell>
                          <TableCell align="left">{row.ReviewEndTime}</TableCell>
                          <TableCell align="left">{row.Latency}</TableCell>
                          <TableCell align="left">{row.ReportedBy}</TableCell>
                          <TableCell align="left">{row.EventType}</TableCell>
                          <TableCell align="left">{row.IsEscalated === true ? (
                            <Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: "green", fontSize: 30 }} />
                            // <Chip label={<Iconify icon="mdi:check" />} color="success" size="small" variant="outlined" />
                          ):(
                            <Iconify icon="eva:close-circle-outline" sx={{ color: "red", fontSize: 30 }} />
                          )}</TableCell>
                          <TableCell align="left">{Number(row.IsAnnonced) === 1 ? (
                            <Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: "green", fontSize: 30 }} />
                            // <Chip label={<Iconify icon="mdi:check" />} color="success" size="small" variant="outlined" />
                          ):(
                            <Iconify icon="eva:close-circle-outline" sx={{ color: "red", fontSize: 30 }} />
                          )}</TableCell>
                          <TableCell align="left">{Number(row.IsCalled) === 1 ? (
                            <Iconify icon="eva:checkmark-circle-2-outline" sx={{ color: "green", fontSize: 30 }} />
                            // <Chip label={<Iconify icon="mdi:check" />} color="success" size="small" variant="outlined" />
                          ):(
                            <Iconify icon="eva:close-circle-outline" sx={{ color: "red", fontSize: 30 }} />
                          )}</TableCell>
                          <TableCell align="left">{row.Comments}</TableCell>
                          
                        </TableRow>
                      );
                    })}


                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={TABLE_HEAD.length} />
                    </TableRow>
                  )}
                  
                </TableBody>                
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={TABLE_HEAD.length} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                
                     

              </Table>
            </TableContainer>
          </Scrollbar>
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
                        <TableCell>Day</TableCell>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            // count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
 
  );
}
