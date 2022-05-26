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

export default function Main(){

        const webcamRef = React.useRef(null);
        const [state, setState] = React.useState("Focussed");
        const [isMonitoring, setIsMonitoring] = React.useState(false)

        const submitImage = (blob) =>{
            // let data = new FormData;
            // let URL = "http://localhost:8080/sendImageBlob";
            // //console.log(blob)
            // data.append('file',blob,'face_image');
            // //console.log(...data) 
            
            // axios.post(URL, data)
            // .then(response => {
            //     //console.log('response', response)
            //     const faceAttributes = response.data
            //     console.log(faceAttributes)
            //     if(!faceAttributes.EyesOpen.Value){
            //         setState("Drowsiness Detected!")
            //     }
            //     else if(faceAttributes.MouthOpen.Value){
            //         setState("Yawn Detected!")
            //     }
            //     else {
            //         setState("Focussed")
            //     }
            //   }).catch(error => {
            //     console.log('error', error)
            //   })
            console.log("submitted!")
        }

        React.useEffect(() => {
            if(isMonitoring){
                const interval = setInterval(() => {
                const imageSrc = webcamRef.current.getScreenshot();
                const blob = makeblob(imageSrc)
                //console.log(blob)
                submitImage(blob);
                }, 5000);
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
        }


    return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

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
                        {state}
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