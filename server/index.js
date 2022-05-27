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
const { response } = require('express');
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

app.listen(port, ()=>{
    console.log(`App listening to port ${port}`)
})