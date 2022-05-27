import React from "react";
import useSound from 'use-sound';
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Glory from '../assets/sounds/alarms/Glory.mp3';
import { textAlign } from "@mui/system";


export default function AlarmDialog(props){
    console.log(props)

    const [play,{stop}] = useSound(Glory);

    const handleClose = ()=>{
        stop();
        props.setOpen(false);
        props.setIsMonitoring(true);
    }
    
    const handleSnooze = () => {
        stop();
        props.pause();
        props.setOpen(false);
    }

    const handleEnter = ()=>{
        play();
    }

    return(
        <Dialog
        open={props.open}
        onClose={handleClose}
        TransitionProps={{onEnter:handleEnter}} 
        disableEscapeKeyDown
        >
        <DialogTitle sx={{textAlign:'center'}}>
          {"User is Sleeping!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack direction="row" alignItems="center">
                <img src="https://media.giphy.com/media/l4HodvFAU681KEBwI/giphy.gif" width={250} />
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSnooze}>Let me sleep!</Button>
          <Button onClick={handleClose} autoFocus>
            Okay I'm up!
          </Button>
        </DialogActions>
      </Dialog>

    )
}