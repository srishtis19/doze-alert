import React from "react";
import axios from "axios"
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Webcam from "react-webcam"
import { useStopwatch } from 'react-timer-hook';
import { makeblob } from "../utils/blob";
import SleepAlert from "./Alert";
import AlarmDialog from "./AlarmDialog";
import { sendAlertData } from "../utils/sendAlertData";


export default function Main(props){

    const webcamRef = React.useRef(null);

    // Store the current monitoring status
    const [state, setState] = React.useState({
        statusText:"Focussed",
        alertText:"",
        isOpen:false
    });

    const [isAlarmOpen,setIsAlarmOpen] = React.useState(false)
    const [isMonitoring, setIsMonitoring] = React.useState(false)

    // These variable store the number of times yawning/sleeping/phone usage was detected
    // A Yawn Alert Sounds when the respective alert count is 1
    // A Sleep Alert Sounds when the respective alert count is 2
    // A Focus Alert Sounds when the respective alert count is 3
    // A Sleep Alarm Sounds when the respective alarm count is 6
    // This is to make sure that events like blinking of an eye are not mistakenly identified, leading to false alerts
    var alarmCount = 0
    var sleepAlertCount = 0
    var yawnAlertCount = 0
    var phoneCount = 0

    const alertMessages = ['Walk it Out: Go and get some air to freshen up!',
                            'Feeling Sleepy? Eat healthy snacks to keep yourself energized!',
                            'Drowsy? Take a short break, listen to your favourite music to refresh!']

    //This function posts the image data captured to the backend and recieves the detected face data back
    const submitImage = (blob) =>{

        let URL = "http://localhost:8080/sendImageBlob";
        let data = new FormData;
    
        data.append('file',blob,'face_image');
        data.append('useFocusMode',props.focusMode? true:false );
        
        axios.post(URL, data)
        .then(response => {

            const Attributes = response.data
            if(props.focusMode){
                handleFocusAlerts(Attributes)
            }
            else{
                handleSleepAlerts(Attributes)
            }
        })
        .catch(error => {
            console.log('error', error)
         })

    }

    // This hooks captures image from Webcam every 3 seconds when monitoring is enabled and submits it to backend
    React.useEffect(() => {

        if(isMonitoring){

            const interval = setInterval(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob = makeblob(imageSrc)

            submitImage(blob);
            }, 3000);

            return () => clearInterval(interval);
        }

    }, [isMonitoring]);

    const {
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        reset,
        } = useStopwatch({ autoStart:false});
        
    const handleMonitoring = () => {

        if(isRunning){
            pause();
        }
        else{
            start();
        }

        setIsMonitoring((prevState)=>!prevState)

        sleepAlertCount = 0
        yawnAlertCount = 0
        alarmCount = 0

    }

    //This function performs the required tasks depending on the face data detected
    const handleSleepAlerts = (faceData) =>{

        // Step-1: Update Alert and Alarm Counts

        //Yawning detected
        if(faceData.MouthOpen.Value){

            //Increment Yawn Alert Count and Alarm Count 
            //Reset Sleep Count
            yawnAlertCount++
            sleepAlertCount = 0
            alarmCount++
        }

        //Closed Eyes detected
        else if(!faceData.EyesOpen.Value){

            //Increment Sleep Alert Count and Alarm Count
            //Reset Yawn Alert Count
            sleepAlertCount++
            yawnAlertCount = 0
            alarmCount++
        }

        //No sleep attribute detected
        else {

            //Reset all counts
            sleepAlertCount = 0
            yawnAlertCount = 0
            alarmCount = 0
        }

        //Step-2: Perform actions based on the alert and alarm counts

        if(alarmCount===6){

            //Reset Alarm Count
            alarmCount = 0

            //Sound Alarm
            //Stop monitoring(until user responds to alarm)
            sendAlertData('Sleep Alarm')
            setIsMonitoring(false)
            setIsAlarmOpen(true)

        }

        else if(yawnAlertCount===1){
            
            //Reset Yawn Alert Count
            yawnAlertCount = 0

            //Sound Yawn Alert
            sendAlertData('Yawn Alert')

            const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];

            setState({
                statusText:"Yawning Detected!",
                alertText:randomMessage,
                isOpen:true
            })

        }

        else if(sleepAlertCount===2){

            //Reset Sleep Alert Count
            sleepAlertCount = 0
            
            //Sound Sleep Alert
            sendAlertData('Sleep Alert')

            const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];

            setState({
                statusText:"Drowsiness Detected!",
                alertText:randomMessage,
                isOpen:true
            })
        }

        else if(sleepAlertCount==1){

            setState({
                ...state,
                statusText:"Drowsiness Possible!"
            })
        }

        else {

            setState({
                statusText:"Focussed",
                alertText:"",
                isOpen:false
            });
        }

    }

    const handleFocusAlerts = (Attributes) => {

        //Step-1: Update alert and alarm counts
        if(Attributes.phoneDetected){
            phoneCount++   
        }

        else {
            phoneCount = 0
            handleSleepAlerts(Attributes)
        }

        if(phoneCount==3){

            //Reset phone count
            phoneCount=0

            //Sound Focus Alert
            sendAlertData('Focus Alert')
            setState({
                statusText:"Using phone!",
                alertText:"Focus! Put your phone down, pick your work up :))",
                isOpen:true
            })
            
        }

        else if(phoneCount==2){

            setState({
                ...state,
                statusText:"Possibly using phone"
            })
        }
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

            {/* Alert Bar */}
            <SleepAlert 
                state={state} 
                setState={setState} 
                notifOptions = {props.notifOptions} 
            />

            {/* Alarm Dialog Box */}
            <AlarmDialog 
                open = {isAlarmOpen} 
                setOpen = {setIsAlarmOpen}
                setIsMonitoring = {setIsMonitoring}
                pause = {pause}
                notifOptions = {props.notifOptions} 
            />

            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                {/* Greeting Text */}
                <Typography variant="h5" className="greetText" sx={{fontWeight:'500'}}>
                    <Stack direction="row" alignItems="center">
                        Conquer the day (and night!) with Doze Alert! 
                        <WbSunnyIcon fontSize="large" sx={{color:'#4285F4', margin:'10px'}} />
                    </Stack>
                </Typography>

                {/* Webcam */}
                <Box className="webcamContainer">

                    <Stack direction="row" spacing={2} className="alert">
                        <CrisisAlertIcon 
                            sx={{
                                color:'#2C7CDB'
                            }}
                        />
                        <Typography variant="body1">
                            {state.statusText}
                        </Typography>
                    </Stack>

                    <Box className="timer" >
                        {hours!==0 && <span>{hours<10 && 0}{hours}</span>}
                        {minutes!==0 && <span>:{minutes<10 && 0}{minutes}</span>}
                        :{seconds<10 && 0}<span>{seconds}</span>
                    
                    </Box>

                    <Webcam
                        width={800}
                        height={600}
                        className="webcam"
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                </Box>

                {/* Button to start/stop monitoring */}
                <Button 
                    variant="contained" 
                    size="large"
                    uppercase={false}
                    sx={{
                        background: 'linear-gradient(96.79deg, #4285F4 0%, #186EFC 100%)',
                        boxShadow: '0px 0px 10px rgba(41, 132, 255, 0.56)',
                        borderRadius: '8px',
                        color:'white',
                        padding: '16px',
                        textTransform:'none',
                    }} 
                    startIcon={<HourglassTopIcon />}
                    onClick = {handleMonitoring}
                >
                    <Typography variant="h6"> {isRunning? `Take a break!`: `Start Monitoring >>`} </Typography>  
                </Button>

            </Box>
            
        </Box>
    )

}