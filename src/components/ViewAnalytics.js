import React from "react";
import axios from "axios";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import ReactApexChart from "react-apexcharts";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem";


export default function ViewAnalytics(){
    

    const [radialBarData,setRadialBarData] = React.useState({
        type:'Today',
        data:[0,0,0]
    })
    const [barGraphData,setBarGraphData] = React.useState({
        type:'Today',
        data:[]
        // data:[{
        //     name: 'Sleep Alerts',
        //     data: [2,4,0,3,0,0,0,0,1,3,5,1,2,4,0,3,0,0,0,0,1,3,5,1]
        //   }, {
        //     name: 'Focus Alerts',
        //     data: [0,0,0,2,5,0,4,1,0,0,1,0,2,4,0,3,0,0,0,0,1,3,5,1]
        //   }, {
        //     name: 'Sleep Alarm',
        //     data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        //   }]
    })

    const getTodayData = () => {
        const URL = "http://localhost:8080/getTodayData"
        axios.get(URL)
        .then(response => {
            const data = response.data
            console.log(data)
            return data;
        })
    }

    const findRadialArray = (data,type) => {
        const arr = [0,0,0]
        
        data.forEach(entry => {
            if(entry.alertType==='Sleep Alert') arr[0]++;
            else if(entry.alertType==='Focus Alert') arr[1]++;
            else if(entry.alertType==='Sleep Alarm') arr[2]++;
        })
        const maxElement = Math.max(...arr)
        console.log(arr,maxElement)
        const series = arr.map(entry =>entry*10)
        console.log(series)
        setRadialBarData({
            type:type,
            data:series
        })
        console.log(radialBarData)
    
    }

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
            console.log(series)
            setBarGraphData({
                type:type,
                data:series
            })
            console.log(barGraphData)




        })
    }


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
    
    
    const barGraphState = {
          
        series: [{
          name: 'Sleep Alerts',
          data: [2,4,0,3,0,0,0,0,1,3,5,1,2,4,0,3,0,0,0,0,1,3,5,1]
        }, {
          name: 'Focus Alerts',
          data: [0,0,0,2,5,0,4,1,0,0,1,0,2,4,0,3,0,0,0,0,1,3,5,1]
        }, {
          name: 'Sleep Alarm',
          data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        },],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            width:'100px',
            background:'transparent',
            stacked: true,
            fontFamily:'Inter',
            foreColor:'white',
            zoom: {
              enabled: true
            },
            toolbar: {
              show:false
            }
          },
          grid: {
            show:false,
          },
          dataLabels: {
            style: {
                fontWeight:'800',
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth:'75%',
            },
          },
          xaxis: {
            categories: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM','8 AM', '9 AM',
                            '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM','8 PM', '9 PM',
                            '10 PM', '11 PM'],
            labels: {
                style: {
                    fontSize:'10px',
                    fontWeight: 700,
                }
            },
            // axisBorder: {
            //     show:false,
            // },
            axisTicks: {
                show:false,
            },
          },
          yaxis: {
            show: false,
            // axisBorder: {
            //     show: false,
            // },
            axisTicks: {
                show: false,
            },
            crosshairs: {
                show: false,
            }
          },

          legend: {
            position: 'right',
            offsetY: 40,
            markers: {
                radius: 20
            }
          },
          colors: ['#008FFB','#00E396','#FEB019'],
          theme: {
              mode:"dark",
          },
          fill: {
            opacity: 1
          }
        },
      
      
      };

    const radialBarState = {
          
        series: [60, 40, 20],
        options: {
          chart: {
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              track: {
                background: 'transparent',
                margin:7,
              },
              hollow: {
                  size: '30%'
              },
              endAngle:250,
              dataLabels: {
                name: {
                //   show:false,
                  fontSize: '18px',
                  fontFamily:'Inter',
                  offsetY:-10,
                },
                value: {
                  fontSize: '40px',
                  fontWeight:500,
                  fontFamily:'Inter',
                  color:'white',
                  formatter: function(w) {
                      return w/10
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  color: 'white',
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                        return a + b
                      }, 0) / 10
                  }
                }
              }
            }
          },
          stroke: {
            lineCap: "round",
          },
          labels: ['Sleep Alerts', 'Focus Alerts', 'Sleep Alarms'],
        },
      
      
      };

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
            console.log(data)
            // setBarGraphData({
            //     ...barGraphData,
            //     type:type
            // })
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
        
        // setRadialBarData({
        //     ...radialBarData,
        //     type:type,
        // })
        axios.get(URL)
        .then(response => {
            const data = response.data
            console.log(data)
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
            <Stack 
                direction="row" 
                spacing={20} 
                justifyContent='space-between'
                sx={{
                    alignItems:'center',
                    marginTop:'100px',
                    //marginLeft:'-80px'
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
                    <ReactApexChart options={radialBarState.options} series={radialBarData.data} type="radialBar" height={320} />          
            <Stack 
                direction="row" 
                spacing={20} 
                justifyContent="space-between"
                sx={{
                    alignItems:'center',
                    // marginLeft:'-50px'
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

