const express = require('express');
var bodyParser = require('body-parser');
const multiparty = require('multiparty');
const app = express();
var jsonParser = bodyParser.json()
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors)
const port = 4040;

app.get('/', (req,res) =>{
    console.log("Hello World!")
})

app.post('/sendImageBlob',(req,res) =>{
//     console.log(req.body)
//     res.send(req.body)
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        console.log(fields)
        res.end(util.inspect({fields: fields, files: files}));
      });


 })


app.listen(port, ()=>{
    console.log(`App listening to port ${port}`)
})