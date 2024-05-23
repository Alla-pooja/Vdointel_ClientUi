// import React, { useState, useEffect } from "react";
// import { filter } from "lodash";
// import Iconify from "src/components/Iconify";
// import {
//   InputAdornment,
//   Grid,
//   Box,
//   Autocomplete,
//   Button,
//   TextField,
//   Typography,
//   TableCell,
//   TableRow,
//   TableBody,
//   Table,
//   TableHead,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   TableContainer,
//   TablePagination,
//   Toolbar,
//   OutlinedInput,
//   Link,
//   Stack,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import PropTypes from "prop-types";
// import Scrollbar from "src/components/Scrollbar";
// import { Construction } from "@mui/icons-material";
// //import OutlinedInput from '@mui/material';
// import SearchNotFound from "src/components/SearchNotFound";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled } from "@mui/material/styles";
// import * as XLSX from "xlsx";
// import DailyWiseForm from "./DailyWiseForm";
// import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { getClientList } from "src/api/VideoArchivesApi";
// import { getHourlyWiseEvents } from "src/api/DailywiseReport";
// import dayjs from "dayjs";
// import * as Yup from "yup";
// const HourlyWiseCameraReport = ({ clientList }) => {

//   const [filterName, setFilterName] = useState("");

//   const [data, setData] = useState([]);
//   const [row, rowChange] = useState([]);
//   const [rowPerPage, rowPerPageChange] = useState(5);
//   const [fromDate, setFromDate] = useState(null);
//   const [isValidFrom, setIsValidFrom] = useState(false);
//   const [isValidTo, setIsValidTo] = useState(false);
//   const [imageURL, setImageURL] = useState("");
//   const [openDialogImage, setOpenDialogImage] = useState(false);
//   const [selectedClient, setSelectedClient] = useState("");
//   const [clientInfo, setClientInfo] = useState([]); // State for storing client data
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const[client,setClient]=useState([]);
//   const[date,setDate]=useState("");
//   const[clientid,setClientid]=useState([]);
//   const [errors, setErrors] = useState({
//     date:"",
   
//    });
//   const columns =
//     //clientList
//     [
//       { id: "Sno", name: "Sno" },
//       { id: "Date", name: "Date" },
//       { id: "Client", name: "Client" },
//       { id: "CameraName", name: "Camera" },
//       { id: "event_hour", name: "Hour" },
//       { id: "category", name: "category" },
//       { id: "true_event_count", name: "True Events" },
//       { id: "false_event_count", name: "False Events" },
//       { id: "Totalevents", name: "Total Events" },
//       { id: "aht", name: "AHT" },
//       { id: "art", name: "ART" },

//     ];
//   // const values = [
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,
//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,

//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,

//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,
//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,

//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,

//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,
//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,
//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,
//   //   },
//   //   {
//   //     Date: "12-04-2023",
//   //     Clientname: 123,
//   //     Camera: "camera1",
//   //     Hour:6,
//   //     category:6,
//   //     TrueEvents:10,
//   //     FalseEvents:10,
//   //     TotalEvents: 0,
//   //     Aht: 0,
//   //     Art: 0,

//   //   },
//   // ];

//   const RootStyle = styled(Toolbar)(({ theme }) => ({
//     height: 96,
//     display: "flex",
//     // justifyContent: 'space-between',
//     padding: theme.spacing(0, 1, 0, 3),
//   }));

//   const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
//     width: 240,
//     marginLeft: 15,
//     transition: theme.transitions.create(["box-shadow", "width"], {
//       easing: theme.transitions.easing.easeInOut,
//       duration: theme.transitions.duration.shorter,
//     }),
//     "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
//     "& fieldset": {
//       borderWidth: `1px !important`,
//       borderColor: `${theme.palette.grey[500_32]} !important`,
//     },
//   }));
//   const handleClientChange = (event) => {
//     console.log("selected Group", event.target.value);
//     setSelectedClient(event.target.value);
//   };

//   const handleChange = (newValue,event) => {
//     const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
//     setDate(formattedDate);
//     setErrors((prevState) => ({ ...prevState, date: "" }));
//   };

 

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - client.length) : 0;

  
//   const handleFilterByName = (event) => {
//     debugger;
//     const pattern = event.target.value.trim();
//     setFilterName(pattern);
//   };

//   const filteredData = data.filter((item) => {
//     //console.log(item)
//     return (
//       (item.Date &&
//         item.Date.toLowerCase().includes(filterName.toLowerCase())) ||
//       (item.Client &&
//         item.Client.toLowerCase().includes(filterName.toLowerCase())) ||
      
//       (item.CameraName &&
//         item.CameraName.toLowerCase().includes(filterName.toLowerCase()))
     
    
//     );
//   });
//   //export to excel
//   const exportToExcel = () => {
//     if (filteredData.data && filteredData.data.length > 0) {
//       const sheetName = filteredData.name;
//       const headers = Object.keys(filteredData.data[0]);
//       const data = [
//         headers,
//         ...filteredData.data.map((item) => headers.map((key) => item[key])),
//       ];

//       const ws = XLSX.utils.aoa_to_sheet(data);
//       const filename = sheetName + ".xlsx";

//       const maxColumnWidths = {};
//       headers.forEach((header) => {
//         maxColumnWidths[header] = Math.max(
//           20,
//           ...data.map((row) => (row[header] || "").toString().length)
//         );
//       });
//       const columnWidths = headers.map((header) => ({
//         wch: maxColumnWidths[header],
//       }));

//       ws["!cols"] = columnWidths;

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet 1");

//       XLSX.writeFile(wb, filename);
//     } else if (filteredData.length) {
//       const sheetName = "Supervisor Qc Report";
//       const headers = Object.keys(filteredData[0]);
//       const data = [
//         headers,
//         ...filteredData.map((item) => headers.map((key) => item[key])),
//       ];

//       const ws = XLSX.utils.aoa_to_sheet(data);
//       const filename = sheetName + ".xlsx";

//       const maxColumnWidths = {};
//       headers.forEach((header) => {
//         maxColumnWidths[header] = Math.max(
//           20,
//           ...data.map((row) => (row[header] || "").toString().length)
//         );
//       });
//       const columnWidths = headers.map((header) => ({
//         wch: maxColumnWidths[header],
//       }));

//       ws["!cols"] = columnWidths;

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet 1");

//       XLSX.writeFile(wb, filename);
//     } else {
//       alert("No data to Export.");
//       return;
//     }
//   };
//   const isDataNotFound = filteredData.length === 0;
//   HourlyWiseCameraReport.prototype = {
//     numSelected: PropTypes.number,
//     filterName: PropTypes.string,
//     onFilterName: PropTypes.func,
//   };
//   const calculatesubtotal = (data) => {
//     let totalTrueEvents = 0;
//     let totalFalseEvents = 0;
//     let totalTotalEvents = 0;
//     let totalAht = 0;
//     let totalArt = 0;

//     data.forEach((row) => {
//       totalTrueEvents += row.TrueEvents;
//       totalFalseEvents += row.FalseEvents;
//       totalTotalEvents += row.TotalEvents;
//       totalAht += row.Aht;
//       totalArt += row.Art;
//     });

//     return {
//       TrueEvents: totalTrueEvents,
//       FalseEvents: totalFalseEvents,
//       TotalEvents: totalTotalEvents,
//       Aht: totalAht,
//       Art: totalArt,
//     };
//   };
//   const schema = Yup.object().shape({
//     date: Yup.string().required("date is required"),
  
    
//   });
//   const handleButtonClick = async (event) => {
//     event.preventDefault();
//     try {
//       await schema.validate({ date }, { abortEarly: false });
//       console.log("Form submitted successfully");

//       getHourlyWiseEvents(
//         {
//           date: date,
//           client_id: selectedClient ? selectedClient : 0 ,
//         },
//         (response) => {
//           if (response.status === 200) {
//             setData(response.data);
//             console.log("Response data:", response.data);
//           }
//         }
//       );
//     } catch (error) {
//       const newErrors = { date: "" };
//       error.inner.forEach((err) => {
//         newErrors[err.path] = err.message;
//       });
//       setErrors(newErrors);
//     }
//   };

 
  
  

  
//   //................................UseEffects------------------------------------>
//   // useEffect(() => {
//   //   setData(values);
//   // }, []);

//   useEffect(() => {
//     getClientList((response) => {
//       if (response.status === 200) {
//         console.log("response data",response.data);
//         setClientInfo(response.data);

//       }
//     });
//   }, []);


//   return (
//     <>
//       <Grid sx={{ marginLeft: "1rem" }}>
//         <Grid
//           container
//           spacing={2}
//           alignItems="center"
//           sx={{ marginTop: "0.2rem" }}
//         >
//           <Grid item xs={3}>
//             <FormControl fullWidth>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DateTimePicker
//                   label="From Date"
//                   id="from-date"
//                   // ampm={false}
//                   // viewRenderers={{
//                   //   hours: renderTimeViewClock,
//                   //   minutes: renderTimeViewClock,
//                   //   seconds: renderTimeViewClock,
//                   // }}
//                   format="YYYY-MM-DD HH:mm"
//                   value={date}
//                   required={true}
//                   onChange={handleChange}
//                   sx={{ border: "none" }}
//                 />
//               </LocalizationProvider>
//             </FormControl>
//           </Grid>
//           <Grid item xs={3} sx={{ height: "100%" }}>
//             <FormControl fullWidth>
//               <InputLabel id="group-label">Client</InputLabel>
//               <Select
//                 labelId="group-label"
//                 value={selectedClient}
//                 onChange={handleClientChange}
//                 label="Group"
//               >
//                 {clientInfo.map((group) => (
//                   <MenuItem key={group.ID} value={group.ID}>
//                     {group.displayname}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={3} sx={{ height: "100%", marginTop: 2 }}>
//             <Button variant="contained" onClick={handleButtonClick}>
//                 Search
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ marginLeft: 1 }}
//               onClick={exportToExcel}
//             >
//               Export To Excel
//             </Button>
//           </Grid>
//         </Grid>

//         <Grid container spacing={2} sx={{ marginTop: 2 }}>
//           <SearchStyle
//             value={filterName}
//             onChange={handleFilterByName}
//             placeholder="Search"
//             startAdornment={
//               <InputAdornment position="start">
//                 <Iconify
//                   icon="eva:search-fill"
//                   sx={{ color: "text.disabled", width: 20, height: 20 }}
//                 />
//               </InputAdornment>
//             }
//           />
//         </Grid>

//         <Grid
//           container
//           spacing={2}
//           alignItems="center"
//           sx={{ marginTop: "1rem" }}
//         >
//           <Scrollbar>
//             <TableContainer sx={{ minWidth: 800 }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
//                     {columns.map((item) => {
//                       return <TableCell key={item.id}>{item.name}</TableCell>;
//                     })}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                 {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index,subtotal) => (
//                     <>
//                       {/* Render subtotal row if the client changes */}
                     
//                       {/* Render regular row */}
//                       <TableRow key={row.id}>
//                         <TableCell align="left">{index + 1}</TableCell>
//                         <TableCell align="left">{row.Date}</TableCell>
//                         <TableCell align="left">{row.Client}</TableCell>
//                         <TableCell align="left">{row.CameraName}</TableCell>
//                         <TableCell align="left">{row.event_hour}</TableCell>
//                         <TableCell align="left">{row.category}</TableCell>
//                         <TableCell align="left">{row.true_event_count}</TableCell>
//                         <TableCell align="left">{row.false_event_count}</TableCell>
//                         <TableCell align="left">{row.Totalevents}</TableCell>
//                         <TableCell align="left">{row.aht}</TableCell>
//                         <TableCell align="left">{row.art}</TableCell>
//                       </TableRow>
//                       <TableRow key={`subtotal-${index}`} sx={{ backgroundColor: "#e0e0e0" }}>
//                           <TableCell align="left" colSpan={2}></TableCell>
//                           <TableCell align="left"></TableCell>

//                           <TableCell align="left">Subtotal</TableCell>
//                           <TableCell align="left">{true_event_count}</TableCell>
//                           <TableCell align="left">{subtotal.false_event_count}</TableCell>
//                           <TableCell align="left">{subtotal.Totalevents}</TableCell>
//                           <TableCell align="left">{subtotal.aht}</TableCell>
//                           <TableCell align="left">{subtotal.art}</TableCell>
//                           <TableCell align="left" colSpan={2}></TableCell>
//                         </TableRow>
//                     </>
//                   ))}
//                 </TableBody>

//                 {/* {isDataNotFound && (
//                   <TableBody>
//                     <TableRow>
//                       <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
//                         <SearchNotFound searchQuery={filterName} />
//                       </TableCell>
//                     </TableRow>
//                   </TableBody>
//                 )} */}
//               </Table>
//             </TableContainer>
//           </Scrollbar>
//         </Grid>

//         <Grid>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             page={page}
//             count={filteredData.length}
//             rowsPerPage={rowPerPage}
//             component="div"
//             sx={{ backgroundColor: "#f2f2f2" }}
//           />
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default HourlyWiseCameraReport;
import React, { useState, useEffect } from "react";
import {
  InputAdornment,
  Grid,
  FormControl,
  Button,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
  MenuItem,
  Select,
  InputLabel,
  TableContainer,
  TablePagination,
  Toolbar,
  OutlinedInput,
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import Iconify from "src/components/Iconify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as XLSX from "xlsx";
import SearchNotFound from "src/components/SearchNotFound";
import { styled } from "@mui/material/styles";
import { getClientList } from "src/api/VideoArchivesApi";
import { getHourlyWiseEvents } from "src/api/DailywiseReport";
import dayjs from "dayjs";
import * as Yup from "yup";

const HourlyWiseCameraReport = () => {
  const [filterName, setFilterName] = useState("");
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [date, setDate] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [clientInfo, setClientInfo] = useState([]);
  const [page, setPage] = useState(0);
  const [client, setClient] = useState([]);

  const columns = [
    { id: "Sno", name: "Sno" },
    { id: "Date", name: "Date" },
    { id: "Client", name: "Client" },
    { id: "CameraName", name: "Camera" },
    { id: "event_hour", name: "Hour" },
    { id: "category", name: "category" },
    { id: "true_event_count", name: "True Events" },
    { id: "false_event_count", name: "False Events" },
    { id: "Totalevents", name: "Total Events" },
    { id: "aht", name: "AHT" },
    { id: "art", name: "ART" },
  ];

  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: "flex",
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
    setSelectedClient(event.target.value);
  };

  const handleChange = (newValue) => {
    const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
    setDate(formattedDate);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    const pattern = event.target.value.trim();
    setFilterName(pattern);
  };

  const filteredData = data.filter((item) => {
    return (
      (item.Date &&
        item.Date.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.Client &&
        item.Client.toLowerCase().includes(filterName.toLowerCase())) ||
      (item.CameraName &&
        item.CameraName.toLowerCase().includes(filterName.toLowerCase()))
    );
  });

  const exportToExcel = () => {
    if (filteredData.length > 0) {
      const headers = Object.keys(filteredData[0]);
      const data = [
        headers,
        ...filteredData.map((item) => headers.map((key) => item[key])),
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const filename = "HourlyWiseCameraReport.xlsx";

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
      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

      XLSX.writeFile(wb, filename);
    } else {
      alert("No data to Export.");
      return;
    }
  };

  const schema = Yup.object().shape({
    date: Yup.string().required("date is required"),
  });

  const handleButtonClick = async (event) => {
    event.preventDefault();
    try {
      await schema.validate({ date }, { abortEarly: false });
      getHourlyWiseEvents(
        {
          date: date,
          client_id: selectedClient ? selectedClient : 0,
        },
        (response) => {
          if (response.status === 200) {
            setData(response.data);
          }
        }
      );
    } catch (error) {
      const newErrors = { date: "" };
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    getClientList((response) => {
      if (response.status === 200) {
        setClientInfo(response.data);
      }
    });
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const calculateSubtotal = (data) => {
    let true_event_count = 0;
    let false_event_count = 0;
    let Totalevents = 0;
    let aht = 0;
    let art = 0;

    data.forEach((row) => {
      true_event_count += row.true_event_count;
      false_event_count += row.false_event_count;
      Totalevents += row.Totalevents;
      aht += row.aht;
      art += row.art;
    });

    return {
      true_event_count,
      false_event_count,
      Totalevents,
      aht,
      art,
    };
  };

  const groupedData = groupBy(filteredData, "event_hour");

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
                  format="YYYY-MM-DD HH:mm"
                  value={date}
                  required={true}
                  onChange={handleChange}
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
                <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "0.2rem", marginLeft: "1rem" }}
        >
          <TableContainer sx={{ minWidth: 800 }}>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(groupedData).map(([hour, group], index) => (
                    <React.Fragment key={index}>
                      {group
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.Date}</TableCell>
                            <TableCell>{row.Client}</TableCell>
                            <TableCell>{row.CameraName}</TableCell>
                            <TableCell>{row.event_hour}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>{row.true_event_count}</TableCell>
                            <TableCell>{row.false_event_count}</TableCell>
                            <TableCell>{row.Totalevents}</TableCell>
                            <TableCell>{row.aht}</TableCell>
                            <TableCell>{row.art}</TableCell>
                          </TableRow>
                        ))}
                      {/* Subtotal Row for each hour */}
                      <TableRow>
                        <TableCell colSpan={6}>Subtotal for {hour}:00</TableCell>
                        {Object.values(calculateSubtotal(group)).map(
                          (value, index) => (
                            <TableCell key={index}>{value}</TableCell>
                          )
                        )}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default HourlyWiseCameraReport;
