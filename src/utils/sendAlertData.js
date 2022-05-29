import axios from "axios"

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
    //console.log(data)

    axios.post(URL, data)
    .then(response =>{
        console.log(response.data)
    })
}