
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const dotenv = require('dotenv')  
require('dotenv').config()
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  const data = {

    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = process.env.MAILCHIMP;

  const options = {
    method: "POST",
    auth: `WHATEVER_YOU_TYPE:${process.env.AUTH}`
  }

  const request = https.request(url, options, function(response) {
    console.log(response.statusCode);
    if (response.statusCode ===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure.html",function(req,res){
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running on port 3000.");
});

