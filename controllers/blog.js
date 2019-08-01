'use strict';
const {api} = require('../_core/middleware');
const model = require('../models/blog');
const uuid = require('uuidv4');
const path = require('path');
const controller = {};

controller.ping = api(async ({}, {ok}) => {        
    return ok({'blog': 'pong'});
});

controller.uploadImage = (req, res) => {  
  const fs = require('fs');
  const tempFilePath = req.files.upload.path;
  const tempFileName = req.files.upload.name;
  const newFileName = uuid() + path.extname(tempFileName);
  fs.readFile(tempFilePath, (err, data) => {
    const newFilePath = path.resolve(__dirname, '../public/uploads/', newFileName);
    // const newFileURL = path.resolve('/uploads/', newFileName);
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
      console.log('file deleted');
    });
  }); 
};

controller.boards = api(async ({}, {ok}) => {    
    const boards = await model.boards();    

    return ok({boards});
});

controller.boardsByTag = api(async ({query}, {ok}) => {    
  const name = query('name');

  const boards = await model.boardsByTagName(name);

  return ok({boards});
});

controller.board = api(async ({query}, {ok}) => {    
  const no = query('no');

  const board = await model.board(no);

  return ok({board});
});

controller.addBoard = api(async ({body}, {ok}) => {
  const title = body('title');    
  const contents = body('contents');
  const tags = body('tags');
  const isPublic = body('isPublic');
  
  await model.addBoard(title, contents, tags, isPublic);
  
  return ok({});
});

controller.tagsByRecently = api(async ({}, {ok}) => {      
  const tags = await model.tagsByRecently();

  return ok({tags});
});

controller.tagsByBest = api(async ({}, {ok}) => {
  const tags = await model.tagsByBest();

  return ok({tags});
});

module.exports = controller;