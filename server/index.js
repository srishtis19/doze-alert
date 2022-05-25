const express = require('express');
const multer = require('multer');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ dest: 'uploads/' })
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())
const port = 8080;
const {RekognitionClient, DetectFacesCommand} = require('@aws-sdk/client-rekognition')
// import { DetectFacesCommand } from  "@aws-sdk/client-rekognition";
// import  { RekognitionClient } from "@aws-sdk/client-rekognition";

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
          return (JSON.stringify(response.FaceDetails[0])); // For unit tests.
        } catch (err) {
          console.log("Error", err);
        }
  };
  

app.get('/', (req,res) =>{
    console.log("Hello World!")
})

app.post('/sendImageBlob',upload.single('file'),(req,res) =>{
    //console.log(req.body)
    console.log(req.file.buffer)
    //res.send(req.file)
    let imageData = req.file.buffer;
    const detectedFaceAttributes = detect_faces(imageData);

 })


app.listen(port, ()=>{
    console.log(`App listening to port ${port}`)
})