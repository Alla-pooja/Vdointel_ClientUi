
import { filter } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
  Checkbox
} from '@mui/material';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import Iconify from 'src/components/Iconify';
import client from 'src/api/clients';
import { getColor } from 'src/utils/color';
import DeviceAlert from './DeviceAlert';
import DeviceMoreMenu from './DeviceMoreMenu';
import DeviceListToolbar from './DeviceListToolbar';
import DeviceListHead from './DeviceListHead';
import DeviceDrawDialog from './DeviceDrawDialog';
import Switch from '@mui/material/Switch';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import ModalTemplate from './Modal';
import { getServerList ,getTimezoneList } from 'src/api/analytics';

// const TABLE_HEAD1 = [
//     { id: 'name', label: 'S No', alignRight: false },
//     { id: 'role', label: 'Camera Name', alignRight: false },
//     { id: 'company', label: 'Camera ID', alignRight: false },    
//     { id: 'cameras', label: 'Client', alignRight: false },
//     { id: 'status', label: 'Status', alignRight: false },
//     { id: 'archivestatus',label:'Is Need Archive',alignRight:false},
//     { id: 'cameratype',label:'Camera Type',alignRight:false},
//     { id: 'category',label:'Category',alignRight:false},
//     { id: '',label:'',alignRight:true},
//   ]; 

  const TABLE_HEAD = [
    { id: '', label: 'S No', alignRight: false },
    { id: '', label: 'Client name', alignRight: false },
    { id: '', label: 'Camera ID', alignRight: false },
    { id: '', label: 'Camera Name', alignRight: false },
    { id: '', label: 'Local camera name', alignRight: false },
    { id: '', label: 'Category', alignRight: false },
    { id: '', label: 'Time Zone', alignRight: false },
    { id: '', label: 'Archives', alignRight: false },
    { id: '', label: 'Camera Type', alignRight: false },
    { id: '', label: 'Speaker', alignRight: false },
    { id: '',label:'',alignRight:true},
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
  
  // function applySortFilter(array, comparator, query) {
  //   //debugger
  //   const stabilizedThis = array.map((el, index) => [el, index]);
  //   stabilizedThis.sort((a, b) => {
  //     const order = comparator(a[0], b[0]);
  //     if (order !== 0) return order;
  //     return a[1] - b[1];
  //   });
  //   if (query) {
  //     return filter(array, (_user) => {
  //       debugger
  //       return Object.values(_user).some((value) => {
  //         if (typeof value === 'string') {
  //           let y=value.toLowerCase().includes(query.toLowerCase());
  //           return value.toLowerCase().includes(query.toLowerCase());
  //           //return true; 
  //         }
  //         else if(typeof value ==='number' && !isNaN(parseFloat(query))){
  //           debugger
  //           return value.toString().startsWith(query);
  //         }
  //         return false;
  //       });
  //     });
  //   }
  //   return stabilizedThis.map((el) => el[0]);
  // }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => {
        return ['deviceid', 'devicename', 'displayname'].some((property) => {
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
  

export default function DeviceList({clientInfo,totalData,total, handleDialog, reloadClientsData,getClientid,updateClientDevices,handleMoremenu,selectedClient,onClientChange ,handleReloadPage}) {
     // console.log('totalData is',totalData)
     
      const [swich, setSwitch] = useState(false);

      const [timezoneDetails,setTimezone] = useState([]);
      useEffect(() => {
        console.log("Server ");
        getTimezoneList((response) => {
          if (response.status === 200) {
            console.log("Time Zone ", response.data);
            setTimezone(response.data)    
          }
        });
      }, []);

      const handleSwitch =(uid)=>{
        console.log(uid)
      }

      useEffect(()=>{
          console.log(swich)
      },[swich])

      const [page, setPage] = useState(0);

      const [order, setOrder] = useState('asc');

      const [selected, setSelected] = useState([]);

      const [orderBy, setOrderBy] = useState('name');

      const [filterName, setFilterName] = useState('');

      const [rowsPerPage, setRowsPerPage] = useState(10);

      const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

      // useEffect(()=>{
      //   console.log(selected)
      // },[selected])

      const [clients, setClient] = useState(total)

      const [deviceId,setDeviceId]=useState([])

      useEffect( () => setClient(total), [total])

      const handleClick = (event, name,id) => {
      
        const selectedIndex = selected.indexOf(name);
        const selectedIdIndex=deviceId.indexOf(id);
        let newSelected = [];
        let selectedId=[]; // to pass id's to archivetimings/montimings

        if (selectedIdIndex === -1) {
         // newSelected = newSelected.concat(selected, name);
          selectedId=selectedId.concat(deviceId,id)
        } else if (selectedIdIndex === 0) {
         // newSelected = newSelected.concat(selected.slice(1));
          selectedId=selectedId.concat(deviceId.slice(1))
        } else if (selectedIdIndex === selected.length - 1) {
          //newSelected = newSelected.concat(selected.slice(0, -1));
          selectedId=selectedId.concat(deviceId.slice(0,-1))
        } else if (selectedIdIndex > 0) {
         // newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
          selectedId=selectedId.concat(deviceId.slice(0,selectedIdIndex),deviceId.slice(selectedIdIndex + 1))
        }

        setSelected(selectedId);
        setDeviceId(selectedId)
      };

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const handleFilterByName = (event) => {
        
        const pattern=event.target.value.trim()
        setFilterName(pattern);
      };
    
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;
      const filteredUsers = applySortFilter(clients, getComparator(order, orderBy), filterName);

      //console.log(filteredUsers)

      const isUserNotFound = filteredUsers.length === 0;

      const [fillDevices, setFillDevices] = useState({
        isLoad: false,
        all: [],
        active: [],
        inActive: [],
        lastId: null
      })

    const [ confirmalert, setAlert ] = useState({
        title: '',
        content: '',
        open: false,
        id: null,
        status: null
    })

    const handleAlertClose = () => setAlert({...confirmalert, open:false})

    const handleAlertOpen = (event,id, status) => {
     // event.stopPropagation()
      //console.log(id)
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

    const [chkStatus,setChkStatus]=useState(true)

    const handleSelectAll = (event)=> {
      
      if (chkStatus) {
        const pageDeviceIds = filteredUsers
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                              map((client) => client.deviceid);
        setDeviceId(pageDeviceIds);  
        setChkStatus(false)     
      } 
      else {
        setDeviceId([]);
        setChkStatus(true) 
      }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceInfo,setDeviceInfo]=useState({})
    
    const handleRowClick = (rowInfo) =>{
      //debugger
      if(deviceId.length==0 || deviceId.length==1){
        setDeviceInfo(rowInfo)
        setIsModalOpen(true)
      }
    }

    const closeModal = () => {
      setIsModalOpen(false);
    }

    return (
      <>
        <Box>

              <DeviceAlert
                alert={confirmalert.open}
                handleAlertClose={handleAlertClose}
                title={confirmalert.title}
                content={confirmalert.content}
                id={confirmalert.id}
                status={confirmalert.status}
                handleStatus={handleStatus}
                />

            
            <DeviceListToolbar handleReloadPage={handleReloadPage} selectedClient={selectedClient} onClientChange={onClientChange} totalData={totalData} numSelected={deviceId.length} filterName={filterName} onFilterName={handleFilterByName}  reloadClientsData={reloadClientsData} clientInfo={clientInfo} getClientid={getClientid} deviceInfo={deviceId} totalInfo={total}/>
            <DeviceDrawDialog/>
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800,maxHeight:500 }}>
                    <Table style={{position:'sticky',top:'-1',flexDirection:'column',}}>
                        <DeviceListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={clients.length}
                            numSelected={deviceId.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAll}
                            enableStickyHeader='true'
                            style={{position:'sticky',top:'-1',}}

                        />
                       
                        <TableBody >
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, inc) => {
                               const {uid, Name,devicename, deviceid, LocalDeviceName, displayname, CameraView,Status,IsActive,server_id,Category,TimezoneId,HaveSpeaker} = row;
                                const isItemSelected = deviceId.indexOf(deviceid) !== -1;
                        

                                return (
                                    <TableRow
                                        hover
                                        key={uid}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                        
                                    >
                                        <TableCell padding="checkbox">
                                          <Checkbox checked={isItemSelected} onChange={(event) => {
                                                              event.stopPropagation()
                                                              handleClick(event, devicename,deviceid)}}
                                         />
                                        </TableCell>
                                        <TableCell>{(inc + (page * rowsPerPage))+1}</TableCell>                                          
                                        <TableCell align="left">
                                          <Typography>
                                              {displayname}
                                          </Typography>
                                          </TableCell>                                   
                                        <TableCell align="left">{deviceid}</TableCell>                                   
                                        <TableCell align="left">{devicename}</TableCell>                                        
                                        <TableCell align="left">{LocalDeviceName}</TableCell>   
                                        <TableCell align="left">
                                        {(() => {
                                                switch (Category) {
                                                  case 0:
                                                    return 'Not Assigned';
                                                  case 1:
                                                    return 'Category 1';
                                                  case 2:
                                                    return 'Category 2';
                                                  case 3:
                                                    return 'Category 3';
                                                  default:
                                                    return 'Not Assigned';
                                                }
                                              })()}
                                          
                                          </TableCell>   
                                        <TableCell align="left">
                                        {(() => {
                                                    const timezone = timezoneDetails.find(timezone => timezone.Id === TimezoneId);
                                                    return timezone ? timezone.TimeZone : 'Not selected';
                                                  })()}
                                          
                                          </TableCell>   
                                        <TableCell align="left">
                                            <Label variant="ghost" color={IsActive === 1 ? 'success': 'error'}>
                                                {IsActive === 1 ? 'Active': 'In Active'}
                                            </Label>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                              {CameraView}
                                          </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Label variant="ghost" color={ HaveSpeaker === 1 ? 'success': 'error'}>
                                                {HaveSpeaker === 1 ? 'Active': 'In Active'}
                                            </Label>
                                        </TableCell>
                                  

                                      
                                       
                                        <TableCell align="right">
                                            <DeviceMoreMenu 
                                            handleAlertOpen={(event, id, status) => handleAlertOpen(event, id, status)}
                                            handleDialog={handleDialog}
                                            handleMoremenu={handleMoremenu}
                                            row={row}
                                            />
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
                rowsPerPageOptions={[10, 20,50,100,500]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ backgroundColor: '#f3f3f3' }}
                enableStickyHeader

            />
        </Box>
        {isModalOpen && <ModalTemplate open={isModalOpen} onClose={closeModal} deviceInfo={deviceInfo} />}
      </>
    )
}
