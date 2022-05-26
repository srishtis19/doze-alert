import React from "react";
import Box from "@mui/material/Box";
import Avatar from '@mui/material/Avatar';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Typography from "@mui/material/Typography";
import  Divider  from "@mui/material/Divider";
import Select from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Switch from '@mui/material/Switch';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrackChangesTwoToneIcon from '@mui/icons-material/TrackChangesTwoTone';

export default function Settings(){

    const alertToneOptions = ['Bell']
    const alarmToneOptions = ['Bell']

    const [notifOptions, setNotifOptions] = React.useState({
        alertTone:'Bell',
        alarmTone:'Bell',
        volume:70
    })
    const [focusMode,setFocusMode] = React.useState(false)

    const changeAlertTone = (event) => {
        setNotifOptions({
            ...notifOptions,
            alertTone: event.target.value
        })
    }

    const changeAlarmTone = (event) => {
        setNotifOptions({
            ...notifOptions,
            alarmTone: event.target.value
        })
    }

    const changeVolume = (event,newValue) => {
        setNotifOptions({
            ...notifOptions,
            volume: newValue
        })
    }

    const changeMode = (event) => {
        setFocusMode(event.target.checked)
    }

    return(

        <Box 
            sx={{
                marginLeft:'100px',
                marginTop: '25px',
                width:'50%'
            }}
        >
            <h1 className="settings--title">Settings</h1>
            <Stack spacing={2} direction="row" alignItems="center" className="heading">
                <NotificationsActiveIcon/>
                <h3>Notifications</h3>
            </Stack>
            <h4 className="subheading">Change your notifcation preferences here</h4>
            <Divider />
            <Stack direction="row" alignItems="center" sx={{marginBlock:'20px'}} >
                <p className="option">Alert Sound</p>
                <FormControl 
                    sx={{
                        width:120,
                        marginLeft:'auto',
                        marginRight:'75px'
                    }}
                    size="small">
                    <InputLabel>Alert Sound</InputLabel>
                    <Select
                        value={notifOptions.alertTone}
                        label="Alert Tone"
                        onChange={changeAlertTone}
                        defaultValue="Bell"
                    >
                        {alertToneOptions.map((tone)=> (<MenuItem value={tone}>{tone}</MenuItem>))}
                    </Select>
                </FormControl>
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" sx={{marginBlock:'20px'}} >
                <p className="option">Alarm Sound</p>
                <FormControl 
                    sx={{
                        width:120,
                        marginLeft:'auto',
                        marginRight:'75px'
                    }}
                    size="small">
                    <InputLabel>Alarm Sound</InputLabel>
                    <Select
                        value={notifOptions.alarmTone}
                        label="Alarm Tone"
                        onChange={changeAlarmTone}
                        defaultValue="Bell"
                    >
                        {alarmToneOptions.map((tone)=> (<MenuItem value={tone}>{tone}</MenuItem>))}
                    </Select>
                </FormControl>
            </Stack>
            <Divider />
            <Stack  direction="row" alignItems="center" sx={{marginBlock:'20px'}} >
                <p className="option">Volume</p>
                <Stack 
                    spacing={2} 
                    direction="row" 
                    alignItems="center"
                    sx={{
                        marginLeft:'auto',
                        marginRight:'30px'
                    }}
                >
                    <VolumeDown />
                    <Slider defaultValue={70} sx={{width:'150px'}} value={notifOptions.volume} onChange={changeVolume} />
                    <VolumeUp />
                </Stack>  
            </Stack> 
            <Divider /> 
            <Box sx={{marginTop:'60px'}}>
                <Stack direction="row" alignItems="end">
                    <Box>
                        <Stack spacing={2} direction="row" alignItems="end" className="heading">
                            <TrackChangesTwoToneIcon />
                            <h3>Focus Mode</h3>
                        </Stack>
                        <h4 className="subheading">Enabling focus mode helps you beat distractions like phone,etc.</h4> 
                    </Box> 
                    <Switch
                        checked={focusMode}
                        onChange={changeMode}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx ={{
                            marginLeft:'auto',
                            marginRight:'100px'
                        }}
                    /> 
                </Stack>
            </Box>
        </Box>

    )
}