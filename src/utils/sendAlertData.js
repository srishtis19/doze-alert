import axios from "axios"

// This function logs the date and time to MongoDB server whenever alarm/alert is sounded
export const sendAlertData = (alertType) => {

    let URL = "http://localhost:8080/sendAlertData";
    let date = new Date();
    let data = {
        time: {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            hour: date.getHours()
        },
        alertType: alertType
    }

    axios.post(URL, data)
    .then(response =>{
        console.log("Alert Logged")
    })
}