//in public in static a image with vdointel _bg has to insert and then it will be working
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from '../axios'
import { Box } from '@mui/system';
import { handleAccess } from 'src/utils/responseHandler';
import { getURL } from 'src/utils/config';
import { useNavigate } from 'react-router-dom';
import { repeat } from 'lodash';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  backgroundImage:'url("/static/vdointel_bg.jpg")',
 backgroundRepeat:'no-repeat',
 backgroundSize:'cover',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  alignItems: 'center',
 
}));

const CardContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  zIndex: 1, // Ensure the card is displayed above the background
  maxWidth: 380,
  width: '120%',
  top:'30px',
  left: '50%', // Center the card horizontally

  transform: 'translateX(-50%)', // Center the card horizontally

  padding: theme.spacing(4),
  backgroundColor: theme.palette.common.white, // Set background color to white
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3], // Add shadow for better visibility
  marginTop:theme.spacing(1),
}));
//----------------------------------------------------------------------

export default function Login({setToken, setAccess, setUserType, setuserData}) {

  const [isRedirect, setRedirect] = useState(true)
  const urlParams = new URLSearchParams(window.location.search);
  const { navigate } = useNavigate()

  const jsonToFormData = (data) => {
    let formdata = new FormData()
    for (let x in data)
      formdata.append(x, data[x])
    return formdata
  }



  const handleLogin = (body, type='form', date=null, shift=null, report_type=null) => {
    localStorage.clear()
    setToken(null)
    setAccess(false)
    setUserType(null)

    setuserData({
      "access_token": null,
      "token_type": null,      
      "ID": null,
      "IsLicenseBase": null,
      "IsAgentBased": null,
      "name": null,
      "displayname": null,
      "logo_url": null,
      "user_type": null,
      "client_id": null
  })

  let redirectURL = '/'

  if (date && shift) {
    redirectURL = `/?date=${date}&shift=${shift}&report_type=${report_type}`
  }



    axios({
      method: 'post',
      url: getURL('token'),
      data: body,
      validateStatus: function (status) {
        return status >= 200 || status === 400;
      }
    }).then(function (response) {
      if (
        (response.status === 200 || response.status === 201) && 
        ('access_token' in response.data) 
        && ![3, 4].includes(parseInt(response.data.user_type))
        ) {    
        
        console.log(response.data)
        
        const res = response.data
        for (let x in res)
          localStorage.setItem(x, res[x])
        const AUTH_TOKEN = `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        axios.defaults.headers.common.Authorization = AUTH_TOKEN;   
        // console.log('user_type',localStorage.getItem('user_type'))

        setuserData({
            "access_token": res['access_token'],
            "token_type": res['token_type'],
            "ID": res['ID'],
            "IsLicenseBase": res['IsLicenseBase'],
            "IsAgentBased": res['IsAgentBased'],
            "name": res['name'],
            "displayname": res['displayname'],
            "logo_url": res['logo_url'],
            "user_type": res['user_type'],
            "client_id": res['client_id']
        })
    

        setUserType(parseInt(response.data.user_typ))
	      setToken(localStorage.getItem('access_token'))
	      
        handleAccess (setAccess, AUTH_TOKEN)

        // window.location.replace(redirectURL)
          
       
        // navigate(redirectURL, { replace: true })
      }           
    })
  }

  useEffect(() => {

    let username = urlParams.get('username');
    let password = urlParams.get('password');
    let date = urlParams.get('date');
    let shift = urlParams.get('shift');
    let type = urlParams.get('type');


    if (username && password) {
      // console.log('Force login')
      handleLogin(
        jsonToFormData({
          username: username,
          password: password,
          grant_type: 'password'
        }),
        'url',
        date,
        shift,
        type,
      )
    } else 
      setRedirect(false)

  }, [])

  return (
    <Page title="Login">
    {!isRedirect && (
      <RootStyle>
        <ContentStyle>
          <CardContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}> {/* Add display: 'flex', alignItems: 'center', flexDirection: 'column' */}
  <Logo />
</Box>

            <div className='headers' style={{ textAlign: 'center' }}>
              <Typography sx={{ color: 'black' }} gutterBottom style={{ textAlign: 'center' }}>
                Sign in to VDOIntel
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>Enter your details below.</Typography>
            </div>
            <LoginForm setToken={setToken} setAccess={setAccess} setUserType={setUserType} setuserData={setuserData} />
          </CardContainer>
        </ContentStyle>
      </RootStyle>
    )}
  </Page>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
