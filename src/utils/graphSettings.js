const barGraphState = {
          
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
                    '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', 
                    '7 PM','8 PM', '9 PM', '10 PM', '11 PM'],
        labels: {
            style: {
                fontSize:'10px',
                fontWeight: 700,
            }
        },
        axisTicks: {
            show:false,
        },
      },
      yaxis: {
        show: false,
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

export {barGraphState, radialBarState}

