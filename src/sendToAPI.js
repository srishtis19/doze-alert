// import Axios from 'axios';

// var API_URL = 'https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect'
// var API_KEY = '82e581c6390f47088999a21e46f590e6'

// export const sendImageToAPI= async (imgData)=> {
//     const config = {
//         headers: { 'content-type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': API_KEY},
//       };
//     const response = Axios
//       .post(API_URL, imgData, config)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//     $.ajax({
//      url: API_URL ,
//      beforeSend: function(xhrObj){
//          // Request headers
//          xhrObj.setRequestHeader("Content-Type","application/octet-stream");
//          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",API_KEY);
//      },
//      type: 'POST',
//      processData: false,
//      contentType: 'application/octet-stream',
//      data:imgData 
//   })
//  .done(function(data) {console.log(JSON.stringify(data))})
//  .fail(function() {alert("error");});
    
 //}

 