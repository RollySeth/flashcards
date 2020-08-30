const express = require("express");
// import path from 'path';
const path=require("path");
const routes = require("./routes");
const server = express();
const bodyParser = require('body-parser');
// const cors = require('cors');

// server.use(cors());
server.use(bodyParser.json()) // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true }))
// server.use(express.static(__dirname + '/public'));
// server.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/index.html'))); 
// server.get("/", (req,res) => res.sendFile(path.join(__dirname+'/public/index.html'))); 
// server.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/index.html'))).listen(5000,() => console.log('Server on port 5000'))

server.use(express.json());
server.use(express.static("public"));

server.use(routes);
module.exports = server;
