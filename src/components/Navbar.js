import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate} from 'react-router-dom';

//Declaring properties and setting for the navigation bar
const drawerWidth = 240;

const iconList = [<VideocamOutlinedIcon></VideocamOutlinedIcon>,
                  <AssessmentOutlinedIcon></AssessmentOutlinedIcon>,
                  <SettingsIcon></SettingsIcon>]

const openedMixin = (theme) => ({

  width: drawerWidth,

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),

  overflowX: 'hidden',
});

const closedMixin = (theme) => ({

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),

  overflowX: 'hidden',

  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },

});

//Custom UI components created for Navbar
const DrawerHeader = styled('div')(({ theme }) => ({

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,

}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(

  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),

);

export default function Navbar() {

  let currComponent;

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isSelected,setIsSelected] = React.useState(currComponent)

  const navigate = useNavigate();

  const Location = new useLocation();
  switch(Location.pathname) {
    case "/":
      currComponent = "Video"
      break
    case "/view-analytics":
      currComponent = "View Analytics"
      break
    case "/settings":
      currComponent = "Settings"
  }
 
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelected = (text) => {

    setIsSelected(text)

    switch(text) {
      case "Video":
        navigate('/')
        break;
      
      case "View Analytics":
        navigate('/view-analytics')
        break;
        
      case "Settings":
        navigate('/settings')
    }

  };

  return (
    <div>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
                justifyContent: 'center',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton 
            onClick={handleDrawerClose}
            sx={{
                ...(!open && { display: 'none' }),
              }}
            >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>

        </DrawerHeader>
        <Divider />

        <List
          sx={{
            display:'flex',
            flexWrap:'wrap',
            flexDirection:'column',
            justifyContent:'center',
            height:'75%'
          }}>

          {['Video', 'View Analytics', 'Settings'].map((text,index) => (
            <ListItem key={text} className="menuButton"  selected={text===isSelected? true:false} >

              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={()=>handleSelected(text)}
                className="listItem"
              >

                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: text===isSelected? '#4285F4': 'white'
                  }} 
                >
                  {iconList[index]}
                </ListItemIcon>

                <ListItemText 
                  primary={text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: text===isSelected?'#4285F4': 'white' 
                  }}
                />

              </ListItemButton>

            </ListItem>
          ))}
          
        </List>

      </Drawer>
    </div>

  );
}
