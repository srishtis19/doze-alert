import './App.css';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Main from"./components/Main"
import Navbar from"./components/Navbar"
import Box from '@mui/material/Box';


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
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Main />
      </Box>
    </ThemeProvider>
  );
}

export default App;
