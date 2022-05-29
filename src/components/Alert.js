import React from 'react';
import useSound from 'use-sound';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';


export default function SleepAlert(props) {

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

            <Alert severity="warning" sx={{ width: '100%', fontSize:'large', fontWeight:'bold'}}>
                {props.state.alertText}
            </Alert>

        </Snackbar>
    )
};
