const express = require('express');
const multer = require('multer');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ dest: 'uploads/' })
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
const port = 8080;
const {RekognitionClient, DetectFacesCommand, DetectLabelsCommand} = require('@aws-sdk/client-rekognition');
const MongoClient = require('mongodb').MongoClient

// import { DetectFacesCommand } from  "@aws-sdk/client-rekognition";
// import  { RekognitionClient } from "@aws-sdk/client-rekognition";
const connectionString = 'mongodb+srv://adminuser:engage2022@cluster0.9okh4wu.mongodb.net/?retryWrites=true&w=majority'


const REGION = "ap-south-1"; 
const rekognitionClient = new RekognitionClient({ region: REGION });

const detect_faces = async (imageData) => {
  const params = {
    Image: {
      Bytes: imageData,
    },
    Attributes: ["ALL"]
  }

  try {
    const response = await rekognitionClient.send(new DetectFacesCommand(params));
    console.log(response.FaceDetails[0].EyesOpen)
    return (response.FaceDetails[0]); // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

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

app.post('/sendImageBlob',upload.single('file'),(req,res) =>{
    //console.log(req.body)
    console.log(req.file.buffer)
    console.log(req.body.useFocusMode)
    //res.send(req.file)
    let imageData = req.file.buffer;
    
    if(req.body.useFocusMode==="true"){

      detect_faces_phones(imageData).then(({detectedFaceAttributes,Labels}) =>{
        console.log(detectedFaceAttributes);
        console.log(Labels);
        //detecting Mobile Phone label from labels
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

    else {
      detect_faces(imageData).then((detectedFaceAttributes) => {
        console.log(detectedFaceAttributes);
        res.json({
            EyesOpen:detectedFaceAttributes.EyesOpen,
            MouthOpen:detectedFaceAttributes.MouthOpen,
            })
        });

    }
})

app.post('/sendAlertData',jsonParser,(req,res) => {
  const data = req.body
  MongoClient.connect(connectionString).then((client => {
    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')
  
  //console.log(data)
    alertData.insertOne(data)
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      console.log(err)
    })
  }))

  res.json(data)

})

app.get('/getAlertData',(req,res) => {

  MongoClient.connect(connectionString).then(client => {
    console.log("Database Connected!")
    var db = client.db('analytics-data')
    var alertData = db.collection('alert-data')
    const data = alertData.find().toArray()
    .then(results => {
      console.log(results)
      res.send(results)
    })
    .catch(err => console.log(err))
  })
})

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
      console.log(results)
      res.send(results)
    })
    .catch(err => console.log(err))
  })
})

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

    console.log(lastDayOfWeek,firstDayOfWeek)
    
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
    console.log(query)
    
    
    const data = alertData.find(query).toArray()
    .then(results => {
      console.log(results)
      res.send(results)
    })
    .catch(err => console.log(err))
  })
})

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
      console.log(results)
      res.send(results)
    })
    .catch(err => console.log(err))
  })
})

app.listen(port, ()=>{
    console.log(`App listening to port ${port}`)
})