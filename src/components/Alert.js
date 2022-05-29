import useSound from 'use-sound';
import React from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { Slide } from '@mui/material';

//import Bell from '../assets/sounds/alerts/Bell.mp3';

export default function SleepAlert(props) {

    console.log(props)

    const alertTone = props.notifOptions.alertTone
    const volume = props.notifOptions.volume/100
    const alertUrl = `${process.env.PUBLIC_URL}/sounds/alerts/${alertTone}.mp3`

    const [play] = useSound(alertUrl,{volume:volume});
    const handleClose = ()=>{
        props.setState({
            ...props.state,
            isOpen :false
        })
    }

    const handleEnter = ()=>{
        play();
    }

    return (
        <Snackbar 
            anchorOrigin = {{vertical:'top',horizontal:'center'}}  
            open={props.state.isOpen} 
            autoHideDuration={4000}
            TransitionComponent={Slide}
            onClose={handleClose}
            TransitionProps={{onEnter:handleEnter}}
        >
            <Alert severity="warning" sx={{ width: '100%' }}>
                {props.state.alertText}
            </Alert>
        </Snackbar>
    )
};
