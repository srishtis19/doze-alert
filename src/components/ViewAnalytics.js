import React from "react";
import axios from "axios";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem";
import ReactApexChart from "react-apexcharts";
import { barGraphState, radialBarState } from "../utils/graphSettings";

export default function ViewAnalytics(){
    
    // React states to store the data displayed on View Analytics Page
    const [radialBarData,setRadialBarData] = React.useState({
        type:'Today',
        data:[0,0,0]
    })
    const [barGraphData,setBarGraphData] = React.useState({
        type:'Today',
        data:[]
    })

    // Helper function to process data to display on Radial Bar Graph
    const findRadialArray = (data,type) => {

        const arr = [0,0,0]
        
        data.forEach(entry => {
            if(entry.alertType==='Sleep Alert') arr[0]++;
            else if(entry.alertType==='Focus Alert') arr[1]++;
            else if(entry.alertType==='Sleep Alarm') arr[2]++;
        })

        const series = arr.map(entry =>entry*10)

        setRadialBarData({
            type:type,
            data:series
        })
    
    }

    // Helper function to process data to display on Bar Graph
    const findBarGraphArray = (data,type) => {

        const sleepAlertArray = new Array(24).fill(0)
        const focusAlertArray = new Array(24).fill(0)
        const sleepAlarmArray = new Array(24).fill(0)

        data.forEach((entry)=>{

            switch (entry.alertType){
                case 'Sleep Alert':
                    sleepAlertArray[entry.time.hour]++
                    break
                
                case 'Focus Alert':
                    focusAlertArray[entry.time.hour]++
                    break
                
                case 'Sleep Alarm':
                    sleepAlarmArray[entry.time.hour]++
            }
        })

        const series = [
            {
                name:'Sleep Alerts',
                data: sleepAlertArray
            },
            {
                name:'Focus Alerts',
                data: focusAlertArray
            },
            {
                name:'Sleep Alarm',
                data: sleepAlarmArray
            }
        ]

        setBarGraphData({
            type:type,
            data:series
        })
    }

    // Fetches data for the graphs on inital loading of page
    const onStart = () => {
        const URL = "http://localhost:8080/getTodayData"
        axios.get(URL)
        .then(response => {
            const data = response.data
            console.log(data)
            findRadialArray(data,'Today')
            findBarGraphArray(data,'Today')
        })

    }
    React.useEffect(()=>{onStart()},[])
    
    const changeBarGraph = (event) => {

        const type = event.target.value

        var URL;
        switch(type){
            case 'Today':
                URL = "http://localhost:8080/getTodayData"
                break
            
            case 'This Week':
                URL = "http://localhost:8080/getWeeklyData"
                break

            case 'This Month':
                URL = "http://localhost:8080/getMonthlyData"
        }

        axios.get(URL)
        .then(response => {
            const data = response.data
            findBarGraphArray(data,type)
            
        })
          
    }
    
    const changeRadialBar = (event) => {

        const type = event.target.value

        var URL;
        switch(type){
            case 'Today':
                URL = "http://localhost:8080/getTodayData"
                break
            
            case 'This Week':
                URL = "http://localhost:8080/getWeeklyData"
                break

            case 'This Month':
                URL = "http://localhost:8080/getMonthlyData"
        }

        axios.get(URL)
        .then(response => {
            const data = response.data
            findRadialArray(data,type)
            
        })
          
    }
    
    return(
        <Box 
            sx={{
                marginLeft:'100px',
                marginTop: '25px',
                width:'40%'
            }}
        >
            <h1 className="settings--title">View Analytics</h1>

            {/* Section to display total alerts sounded */}
            <Stack 
                direction="row" 
                spacing={20} 
                justifyContent='space-between'
                sx={{
                    alignItems:'center',
                }}
            >

                <h2> Total Alerts </h2>
                <FormControl 
                    sx={{
                        width:150,
                        marginLeft:'auto',
                        marginRight:'75px'
                    }}
                >

                    <InputLabel variant="outlined"></InputLabel>
                    <Select
                        value={radialBarData.type}
                        onChange={changeRadialBar}
                        defaultValue="Today"
                    >
                        <MenuItem className="listItem" value="Today">Today</MenuItem>
                        <MenuItem className="listItem" value="This Week">This Week</MenuItem>
                        <MenuItem className="listItem" value="This Month">This Month</MenuItem>
                    </Select>

                </FormControl>

            </Stack>
            <ReactApexChart 
                options={radialBarState.options} 
                series={radialBarData.data} 
                type="radialBar" 
                height={320}
            />   

            {/* Section to display alerts sounded vs time */}       
            <Stack 
                direction="row" 
                spacing={20} 
                justifyContent="space-between"
                sx={{
                    alignItems:'center',
                }}
            >

                <h2>User activity by time</h2>
                <FormControl 
                    sx={{
                        width:150,
                        marginRight:'75px',
                        marginLeft:'auto'

                    }}>

                    <InputLabel variant="outlined"></InputLabel>
                    <Select
                        value={barGraphData.type}
                        onChange={changeBarGraph}
                        defaultValue="Today"
                    >
                        <MenuItem className="listItem" value="Today">Today</MenuItem>
                        <MenuItem className="listItem" value="This Week">This Week</MenuItem>
                        <MenuItem className="listItem" value="This Month">This Month</MenuItem>
                    </Select>

                </FormControl>

            </Stack>
            <ReactApexChart 
                options={barGraphState.options} 
                series={barGraphData.data} 
                type="bar" 
                height={350} 
                width={600}
             />

        </Box>
    )
}

