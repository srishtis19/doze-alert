import React from "react";
import useSound from 'use-sound';
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


export default function AlarmDialog(props){
    
    const alarmTone = props.notifOptions.alarmTone
    const volume = props.notifOptions.volume/100
    const alarmUrl = `${process.env.PUBLIC_URL}/sounds/alarms/${alarmTone}.mp3`

    const [play,{stop}] = useSound(alarmUrl,{volume:volume});

    const handleClose = () => {
        stop();
        props.setOpen(false);
        props.setIsMonitoring(true);
    }
    
    const handleSnooze = () => {
        stop();
        props.pause();
        props.setOpen(false);
    }

    const handleEnter = () => {
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
          {"Wake up, soldier!"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Stack direction="row" alignItems="center">
                <img src="https://media.giphy.com/media/l4HodvFAU681KEBwI/giphy.gif" width={250} />
                Don't fall back, you're almost there! Take a deep breath and get back to work. Let's do this!
            </Stack>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSnooze}>Let me sleep!</Button>
          <Button onClick={handleClose} autoFocus>
            Yes I'm up!
          </Button>
        </DialogActions>
        
      </Dialog>

    )
}