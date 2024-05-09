
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import {
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Link,
} from '@mui/material';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Iconify from 'src/components/Iconify';
import ClientReport from './ClientReport';
import ClientMoreMenu from './ClientMoreMenu';
import ClientAlert from './ClientAlert';
import client from 'src/api/clients';
import { getColor } from 'src/utils/color';
import ClientListHead from './ClientListHead';

const TABLE_HEAD = [
    { id: 'name', label: 'S No', alignRight: false },
    { id: 'ID', label: 'Client ID', alignRight: false },       
    { id: 'displayname', label: 'Client Name', alignRight: false },
    { id: 'devicescount', label: 'No Of Cameras', alignRight: false },
    { id: 'CreatedBy', label: 'Created By', alignRight: false },    
    { id: 'CreatedOn', label: 'Created On', alignRight: false },    
    { id: 'ClientType', label: 'Client Type', alignRight: false }, 
    { id: 'isVerified', label: 'Event Send To', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: ''},
  ];
  
  // ----------------------------------------------------------------------
  
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
  
  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    // console("UPDate:=====", order)
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    console.log("stabilizedThis:::", stabilizedThis)
    if (query) {
      return filter(array, (_user) => {
        return ['ID', 'displayname', 'CreatedBy','CreatedOn','devicescount'].some((property) => {
          const value = _user[property];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query.toLowerCase());
          } else if (typeof value === 'number' && !isNaN(parseFloat(query))) {
            return value.toString().startsWith(query);
          }
          return false;
        });
      });
    }
    return stabilizedThis.map((el) => el[0]);
  }

export default function ClientList({total, active, inactive, handleMoremenu,handleDialog, reloadClientsData}) {

      const [page, setPage] = useState(0);

      const [order, setOrder] = useState('asc');

      const [selected, setSelected] = useState([]);

      const [orderBy, setOrderBy] = useState('name');

      const [filterName, setFilterName] = useState('');

      const [rowsPerPage, setRowsPerPage] = useState(5);

      const handleRequestSort = (event, property) => {
        console.log("order details",event);
        console.log("order by details",orderBy);
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        console.log('New order:', isAsc ? 'desc' : 'asc');
        console.log('New property:', property);
      };
      const [clients, setClient] = useState(total)

      useEffect( () => setClient(total), [total])

      const handleActiveInActive = (status='all') => {
        console.log(status)
        if (status === 'active')
          setClient(active)
        else if (status === "inactive")
          setClient(inactive)
        else
          setClient(total)
      }

      // console.log('Total', total)
      // console.log('clients', clients)

    
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
    
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;
      const filteredUsers = applySortFilter(clients, getComparator(order, orderBy), filterName);

      const isUserNotFound = filteredUsers.length === 0;

      


    const [ confirmalert, setAlert ] = useState({
        title: '',
        content: '',
        open: false,
        id: null,
        status: null
    })

    const handleAlertClose = () => setAlert({...confirmalert, open:false})

    const handleAlertOpen = (id, status) => {
      console.log(id)
        if (status === 'status' && Number(id.Status) === 0)
          handleStatus(id.ID, 1)
        else {
          // let title = status === 'status' ? 'Are you sure?' : 'Are you sure?'
          let content = status === 'status' ? 'Are you sure want to inactive this record?': 'Are you sure want to delete this record permanently?'
          let btn = status === 'status' ? "Yes, inactive record!": "Yes, delete record!"
          let upStatus = status === 'delete' ? 2 : 0
          setAlert({
              title: btn,
              content: content,
              open: true,
              id: id.ID,
              status: upStatus
          })
        }        
    }

    const handleStatus = (id, status) => {
        // console.log(id, status)
        if (status === 2)
          client.deleteClient(id, (response) => {
            if (response.status === 200) {
              
              // console.log('Delete', response.data)
              reloadClientsData()
              handleAlertClose() // close confim box
            }
          })
        else
          client.updateSataus(id, status, (response) => {
            if (response.status === 200) {
              reloadClientsData() //reload data
              // console.log(response.data)
              handleAlertClose() // close confim box
            }
          })
        
        // const update_status = status === 'delete' ? 2 : status === 'status' ? 2
        // let body = { Id: id }
        // if (status !== 2) {
        //     body.Status = status            
        //     updateStatus(body)
        // } else 
        //     deleteRecord(body)

        // handleAlertClose()
        // isReloadData(true)
    }

    return (
        <Box>

              <ClientAlert
                alert={confirmalert.open}
                handleAlertClose={handleAlertClose}
                title={confirmalert.title}
                content={confirmalert.content}
                id={confirmalert.id}
                status={confirmalert.status}
                handleStatus={handleStatus}
                />

            <ClientReport total={total.length} active={active.length} inactive={inactive.length} listHandler={handleActiveInActive}/>


            <UserListToolbar sx={{ backgroundColor: "#f3f3f3" }} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                    <ClientListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={clients.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            enableStickyHeader='true'
                            style={{position:'sticky',top:'-1',}}

                        />
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, inc) => {
                                const {ID, displayname, devicescount,CreatedBy, CreatedOn, ClientType, IsAgentBased, Status} = row;
                                const isItemSelected = selected.indexOf(displayname) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={ID}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                    >
                                        <TableCell>{(inc + (page * rowsPerPage))+1}</TableCell>    
                                        <TableCell align="left">{ID}</TableCell>                                   
                                    
                                        <TableCell component="th" scope="row" padding="none">
                                            {displayname && (
                                              <Stack direction="row" alignItems="center" spacing={2}>
                                                  {/* <Avatar alt={Name} src={IsAgentBased} /> */}
                                                  <Avatar sx={{ bgcolor: getColor[displayname[0].toLowerCase()] }}>{displayname && displayname[0].toUpperCase()}</Avatar>
                                                  <Typography variant="subtitle2" noWrap>
                                                      {displayname}
                                                  </Typography>
                                              </Stack>
                                            )} 
                                        </TableCell>     
                                        <TableCell align="left"><Link href="#">{devicescount}</Link></TableCell>
                                        <TableCell align="left">{CreatedBy}</TableCell>

                                        <TableCell align="left">{CreatedOn}</TableCell>
                                        <TableCell align="left">{ClientType}</TableCell>



                                        <TableCell align="left">
                                        <TableCell align="left">{IsAgentBased === 1 ? 'Tier 1' : 'Client'}</TableCell>

                                          {/* <Iconify sx={{ color: IsAgentBased === 1 ? 'green': 'red', fontSize: 20 }} icon={IsAgentBased === 1 ? 'eva:checkmark-circle-outline': 'eva:close-circle-outline'}/> */}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Label variant="ghost" color={Status === 1 ? 'success': 'error'}>
                                                {Status === 1 ? 'Active': 'In Active'}
                                            </Label>
                                        </TableCell>

                                        <TableCell align="right">
                                            <ClientMoreMenu 
                                            handleAlertOpen={handleAlertOpen}
                                            handleDialog={handleDialog}
                                            handleMoremenu={handleMoremenu}
                                            row={row}/>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>

                        {isUserNotFound && (
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

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}
