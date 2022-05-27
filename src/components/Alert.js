import useSound from 'use-sound';
import React from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { Slide } from '@mui/material';

import Bell from '../assets/sounds/alerts/Bell.mp3';

export default function SleepAlert(props) {

    console.log(props)

    const [play] = useSound(Bell);
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
            autoHideDuration={3000}
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
