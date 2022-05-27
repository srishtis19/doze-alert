import React from "react";
import Box from "@mui/material/Box";
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
import useSound from 'use-sound'
import Bell from '../assets/sounds/alerts/Bell.mp3'
import Bubble from '../assets/sounds/alerts/Bubble.mp3'
import Chime from '../assets/sounds/alerts/Chime.mp3'
import Doorbell from '../assets/sounds/alerts/Doorbell.mp3'
import Interface from '../assets/sounds/alerts/Interface.mp3'
import Positive from '../assets/sounds/alerts/Positive.mp3'
import Glory from '../assets/sounds/alarms/Glory.mp3'
import Morning from '../assets/sounds/alarms/Morning.mp3'
import Phone from '../assets/sounds/alarms/Phone.mp3'
import Rain from '../assets/sounds/alarms/Rain.mp3'
import Work from '../assets/sounds/alarms/Work.mp3'

export default function Settings({notifOptions,setNotifOptions}){

    const alertToneOptions = ['Bell','Bubble','Chime','Doorbell','Interface','Positive']
    const alarmToneOptions = ['Glory','Morning','Phone','Rain','Work']

    // const [notifOptions, setNotifOptions] = React.useState({
    //     alertTone:'Bell',
    //     alarmTone:'Glory',
    //     volume:70
    // })
    const [focusMode,setFocusMode] = React.useState(false)

    const [playBell] = useSound(Bell)
    const [playBubble] = useSound(Bubble)
    const [playChime] = useSound(Chime)
    const [playDoorbell] = useSound(Doorbell)
    const [playInterface] = useSound(Interface)
    const [playPositive] = useSound(Positive)
    const [playGlory] = useSound(Glory,{
        sprite: {
            sample:[0,3000]
        }
    })
    const [playMorning] = useSound(Morning,{
        sprite: {
            sample:[0,3000]
        }
    })
    const [playPhone] = useSound(Phone,{
        sprite: {
            sample:[0,3000]
        }
    })
    const [playRain] = useSound(Rain,{
        sprite: {
            sample:[0,3000]
        }
    })
    const [playWork] = useSound(Work,{
        sprite: {
            sample:[0,3000]
        }
    })

    const playAlerts = [playBell,playBubble,playChime,playDoorbell,playInterface,playPositive]
    const playAlarms = [playGlory,playMorning,playPhone,playRain,playWork]

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
                        {alertToneOptions.map((tone,index)=> (
                            <MenuItem className="listItem"value={tone} onClick={playAlerts[index]}>{tone}</MenuItem>
                        ))}
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
                        defaultValue="Glory"
                    >
                        {alarmToneOptions.map((tone,index)=> (
                            <MenuItem 
                                value={tone} 
                                className="listItem" 
                                onClick={()=>playAlarms[index]({id:'sample'})}>{tone}</MenuItem>
                        ))}
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