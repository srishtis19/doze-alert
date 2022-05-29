import axios from "axios"


const findRadialArray = (data) => {
    const arr = [0,0,0]
    
    data.forEach(entry => {
        if(entry.alertType==='Sleep Alert') arr[0]++;
        else if(entry.alertType==='Focus Alert') arr[1]++;
        else if(entry.alertType==='Sleep Alarm') arr[2]++;
    })

    return arr.map(entry => entry*10)


}

const getTodayData = () => {
    const URL = "http://localhost:8080/getTodayData"
    axios.get(URL)
    .then(response => {
        const data = response.data
        console.log(data)
        return data;
    })
}

function getWeeklyData() {
    const URL = "http://localhost:8080/getWeeklyData"
    axios.get(URL)
    .then(response => {
        const data = response.data
        return data
    })
}

function getMonthlyData (){
    const URL = "http://localhost:8080/getMonthlyData"
    axios.get(URL)
    .then(response => {
        console.log(response.data)
        const data = response.data
        return data
    })
}

export {findRadialArray,getTodayData,getWeeklyData,getMonthlyData}
