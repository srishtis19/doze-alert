import './App.css';
import React from 'react';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Main from"./components/Main"
import Navbar from"./components/Navbar"
import ViewAnalytics from './components/ViewAnalytics';
import Settings from './components/Settings';


//Custom theme for the application 
const theme = createTheme({
  palette: {
    mode:"dark",
    primary: {
      main: '#4285F4'
    },
    background: {
      paper: '#040A20',
      default: '#040A20'
    },
    action:{
      hover:'rgba(0,0,0,0)',
      hoverOpacity:'0',
      selected:'rgba(0,0,0,0)',
      selectedOpacity:'0',
      // focus:'rgba(0,0,0,0)',
      // focusOpacity:'0'
    }
  },
  typography: {
    fontFamily: "Inter"
  }

})

function App() {

  const [notifOptions, setNotifOptions] = React.useState({
    alertTone:'Bell',
    alarmTone:'Glory',
    volume:70
  })
  const [focusMode,setFocusMode] = React.useState(false)

  return (
    
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={
                <Main 
                  notifOptions={notifOptions} 
                  focusMode={focusMode}
                  setFocusMode={setFocusMode}
                />
              } 
            />
            <Route 
              path='settings' 
              element={
                <Settings 
                  notifOptions={notifOptions} 
                  setNotifOptions={setNotifOptions}
                  focusMode={focusMode}
                  setFocusMode={setFocusMode}
                />
              } 
            />
            <Route path='view-analytics' element={<ViewAnalytics />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
    
  );
}

export default App;
