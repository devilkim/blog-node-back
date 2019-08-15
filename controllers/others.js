'use strict';
// const {api} = require('../_core/middleware');
const uuid = require('uuidv4');
const path = require('path');
const controller = {};

controller.uploadImage = (req, res) => {  
  const fs = require('fs');
  const tempFilePath = req.files.upload.path;
  const tempFileName = req.files.upload.name;
  const newFileName = uuid() + path.extname(tempFileName);
  fs.readFile(tempFilePath, (err, data) => {
    const newFilePath = path.resolve(__dirname, '../public/uploads/', newFileName);    
    const newFileURL = 'http://localhost:3000' + path.resolve('/uploads/', newFileName);
    fs.writeFile(newFilePath, data, (err) => {
      const json = {
        filename: tempFileName,
        uploaded: err ? 0 : 1,
        url: newFileURL
      };
      res.send(JSON.stringify(json));
    });
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        throw err;
      }       
    });
  }); 
};

module.exports = controller;