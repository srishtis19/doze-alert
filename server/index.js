const express = require('express');
const multer = require('multer');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
var jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())

const port = 8080;

const {RekognitionClient, DetectFacesCommand, DetectLabelsCommand} = require('@aws-sdk/client-rekognition');
const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://adminuser:engage2022@cluster0.9okh4wu.mongodb.net/?retryWrites=true&w=majority'

const REGION = "ap-south-1"; 
const rekognitionClient = new RekognitionClient({ region: REGION });

// This function sends the image data to Amazon Rekognition to detect faces
const detect_faces = async (imageData) => {
  const params = {
    Image: {
      Bytes: imageData,
    },
    Attributes: ["ALL"]
  }

  try {
    const response = await rekognitionClient.send(new DetectFacesCommand(params));
    return (response.FaceDetails[0]); // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

// This function send image data to Amazon Rekognition to detect faces and labels (eg: mobile phone)
const detect_faces_phones = async (imageData) => {

  const params1 = {
    Image: {
      Bytes: imageData,
    },
    Attributes: ["ALL"]
  }

  const params2 = {
    Image: {
      Bytes: imageData,
    }
  }

  const response1 = await rekognitionClient.send(new DetectFacesCommand(params1));
  const response2 = await rekognitionClient.send(new DetectLabelsCommand(params2));

  const [Result1, Result2] = await Promise.all([response1,response2])

  return({
    detectedFaceAttributes:Result1.FaceDetails[0],
    Labels:Result2.Labels
  })
}
  

app.get('/', (req,res) =>{
    console.log("Hello World!")

})

//Recieves image data, detects faces and labels and returns detected attributes
app.post('/sendImageBlob',upload.single('file'),(req,res) =>{

  let imageData = req.file.buffer;
  
  // If focus mode is ON, detect faces and labels
  if(req.body.useFocusMode==="true"){

    detect_faces_phones(imageData).then(({detectedFaceAttributes,Labels}) =>{

      // Searching the array of labels for Mobile Phone label
      const phoneIndex = Labels.findIndex(label => {
            return label.Name === 'Mobile Phone'
      })
      const isPhoneDetected = phoneIndex>=0 ? true: false

      res.json({
        EyesOpen:detectedFaceAttributes.EyesOpen,
        MouthOpen:detectedFaceAttributes.MouthOpen,
        phoneDetected:isPhoneDetected
      })
    })
    
  }

  // If focus mode id OFF, detect faces only
  else {
    detect_faces(imageData).then((detectedFaceAttributes) => {

      res.json({
          EyesOpen:detectedFaceAttributes.EyesOpen,
          MouthOpen:detectedFaceAttributes.MouthOpen,
          })

      });
  }

})

//Recieves date and time whenever an alert/alarm is sounded and posts it to database
app.post('/sendAlertData',jsonParser,(req,res) => {

  const data = req.body
  MongoClient.connect(connectionString).then((client => {

    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')
  
    alertData.insertOne(data)
    .then(result => {
      console.log("Data logged!")
    })
    .catch(err => {
      console.log(err)
    })
  }))

  res.json(data)

})

//Retrieves the alert statistics for the current date from database
app.get('/getTodayData',(req,res) => {

  MongoClient.connect(connectionString).then(client => {

    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')

    var today = new Date()

    const query = {
      'time.year': today.getFullYear(),
      'time.month': today.getMonth(),
      'time.date': today.getDate()
    }

    const data = alertData.find(query).toArray()
    .then(results => {
      res.send(results)
    })
    .catch(err => console.log(err))
  })
})

//Retrieves the alert statistics for the current week from database
app.get('/getWeeklyData',(req,res) => {

  MongoClient.connect(connectionString).then(client => {

    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')
    
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();
  
    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
  
    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    
    //queries date between first and last day of the week
    const query = {
      $and: [
        {'time.year':todayObj.getFullYear()},
        {$or:[{
          'time.month':firstDayOfWeek.getMonth(),
          'time.date':{$gt:firstDayOfWeek.getDate()-1}
        },
        {
          'time.month':lastDayOfWeek.getMonth(),
          'time.date':{$lt:lastDayOfWeek.getDate()+1}
        }]}
      ]
    }
    
    const data = alertData.find(query).toArray()
    .then(results => {
      res.send(results)
    })
    .catch(err => console.log(err))

  })

})

//Retrieves the alert statistics for the current month from database
app.get('/getMonthlyData',(req,res) => {

  MongoClient.connect(connectionString).then(client => {

    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')

    var today = new Date()
    const query = {
      'time.year': today.getFullYear(),
      'time.month': today.getMonth(),

    }

    const data = alertData.find(query).toArray()
    .then(results => {
      res.send(results)
    })
    .catch(err => console.log(err))

  })
  
})

app.listen(port, ()=>{
    console.log(`App listening to port ${port}`)
})