import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import axios from "axios"
import { Icon, Typography } from "@mui/material";
import Webcam from "react-webcam"
import { Button } from "@mui/material";
import { useStopwatch } from 'react-timer-hook';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { makeblob } from "../blob";
import SleepAlert from "./Alert";
import AlarmDialog from "./AlarmDialog";
// import DrowsinessAlert from "../utils/Alert";
import { sendAlertData } from "../utils/sendAlertData";

export default function Main(props){

        

        const webcamRef = React.useRef(null);
        const [state, setState] = React.useState({
            statusText:"Focussed",
            alertText:"",
            isOpen:false
        });
        const [isAlarmOpen,setIsAlarmOpen] = React.useState(false)
        const [isMonitoring, setIsMonitoring] = React.useState(false)
        var alarmCount = 0
        var sleepAlertCount = 0
        var yawnAlertCount = 0
        var phoneCount = 0

        const submitImage = (blob) =>{
            let data = new FormData;
            let URL = "http://localhost:8080/sendImageBlob";
            //console.log(blob)
            data.append('file',blob,'face_image');
            data.append('useFocusMode',props.focusMode?true:false);
            //console.log(...data) 
            
            axios.post(URL, data)
            .then(response => {
                //console.log('response', response)
                const Attributes = response.data
                console.log(Attributes)
                // if(!faceAttributes.EyesOpen.Value){
                //     setState("Drowsiness Detected!")
                // }
                // else if(faceAttributes.MouthOpen.Value){
                //     setState("Yawn Detected!")
                // }
                // else {
                //     setState("Focussed")
                // }
                if(props.focusMode){
                    handleFocusAlerts(Attributes)
                }
                else{
                    handleSleepAlerts(Attributes)
                }
                
               
              }).catch(error => {
                console.log('error', error)
              })
            console.log("submitted!")
        }

        React.useEffect(() => {
            if(isMonitoring){
                const interval = setInterval(() => {
                const imageSrc = webcamRef.current.getScreenshot();
                const blob = makeblob(imageSrc)
                //console.log(blob)
                submitImage(blob);
                }, 4000);
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
        
        const handleMonitoring = () =>{

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

        const handleSleepAlerts = (faceData) =>{

            // console.log(eyesClosedArray)
            // const newArray = eyesClosedArray.map(value => {return value})
            // newArray.pop();
            // newArray.push(!faceData.EyesOpen.Value);
            // setEyesClosedArray(newArray)
            // console.log(eyesClosedArray)

            // if(eyesClosedArray.every(element => element===true)){
            //     console.log("sound alarm!")
            //     //setIsMonitoring(false);
                
            //     //sound alarm
            //     //set isMonitoring as false
            //     //create a modal
            //     //set isMonitroing as true only after modal closed
            //     //last 3 in another component
            // }
            // console.log(alertCount)
            // if(alertCount===3){
            //     //sound alarm and modal
            //     setIsMonitoring(false)
            //     setIsAlarmOpen(true)
            //     console.log("User is Sleeping!")
                
                
            // }
        
            // else if(!faceData.EyesOpen.Value){
            //     setState({
            //         statusText:"Drowsiness Detected!",
            //         alertText:"Some motivational text regarding drowsiness",
            //         isOpen:true
            //     })
            //     alertCount = alertCount+1;
                

            // }
        
            // else if(faceData.MouthOpen.Value){
            //     setState({
            //         statusText:"Yawning Detected!",
            //         alertText:"Some motivational text regarding yawn",
            //         isOpen:true
            //     })
                
            // }

            // else {
            //     setState({
            //         statusText:"Focussed",
            //         alertText:"",
            //         isOpen:false
            //     });
            //     alertCount = 0;
            // }

            if(faceData.MouthOpen.Value){
                yawnAlertCount++
                sleepAlertCount = 0
                alarmCount++
            }

            else if(!faceData.EyesOpen.Value){
                sleepAlertCount++
                yawnAlertCount = 0
                alarmCount++
            }
            else {
                sleepAlertCount = 0
                yawnAlertCount = 0
                alarmCount = 0
            }

            if(alarmCount===6){

                alarmCount = 0
                sendAlertData('Sleep Alarm')
                setIsMonitoring(false)
                setIsAlarmOpen(true)
                
                //sound alarm
                //stop monitoring
                //reset alarm count

            }

            else if(yawnAlertCount===1){
                //sound alert
                //reset yawn alert count
                yawnAlertCount = 0
                sendAlertData('Yawn Alert')
                setState({
                    statusText:"Yawning Detected!",
                    alertText:"Some motivational text regarding yawn",
                    isOpen:true
                })


            }

            else if(sleepAlertCount===2){
                //sound alert
                //reset sleep alert count
                sleepAlertCount = 0
                sendAlertData('Sleep Alert')
                setState({
                    statusText:"Drowsiness Detected!",
                    alertText:"Some motivational text regarding drowsiness",
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
                //focussed state
                setState({
                    statusText:"Focussed",
                    alertText:"",
                    isOpen:false
                });
            }

        }

        const handleFocusAlerts = (Attributes) => {

            if(Attributes.phoneDetected){
                phoneCount++   
            }
            else {
                phoneCount = 0
                handleSleepAlerts(Attributes)
            }
            if(phoneCount==3){

                phoneCount=0
                sendAlertData('Focus Alert')
                setState({
                    statusText:"Using Phone!",
                    alertText:"Don't use your phone pls",
                    isOpen:true
                })
                
            }

            else if(phoneCount==2){
                setState({
                    ...state,
                    statusText:"Possible usage of phone"
                })
            }

        }


    return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <SleepAlert 
            state={state} 
            setState={setState} 
            notifOptions = {props.notifOptions} 
        />
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
            <Typography variant="h5" component="div" className="greetText">
                Random text here to greet the user!
            </Typography>
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
                //endIcon={<ArrowRightOutlinedIcon />}
            >
                <Typography variant="h6"> {isRunning? `Take a break!`: `Start Focussing >>`} </Typography>  
            </Button>
        </Box>
    </Box>)

}