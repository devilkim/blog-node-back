const httpStatus = require('http-status');
const camelcase = require('camelcase');
const {auth} = require('./utils');
const http = {};

function HttpResponse(httpStatus, message, data) {
  this.httpStatus = httpStatus;
  this.message = message;
  this.data = data;
}

const httpResponse = {};        
for (let key in httpStatus) {
  const temp = key.split('_');
  if (key.indexOf("_NAME") > -1) {
    httpResponse[camelcase(httpStatus[key])] = (data) => {
      return new HttpResponse(parseInt(temp[0], 10), httpStatus[temp[0] + '_MESSAGE'], data);                
    };       
  }        
};

const httpRequest = (req) => {
  req._param = req.param;
  req.queries = req.query;
  req.bodies = req.body;
  req.header = (key, defaultValue) => httpParameter('header', key, req.headers[key], defaultValue);
  req.param = (key, defaultValue) => httpParameter('param', key, req.params[key], defaultValue);
  req.query = (key, defaultValue) => httpParameter('query', key, req.queries[key], defaultValue);
  req.body = (key, defaultValue) => httpParameter('body', key, req.bodies[key], defaultValue);
  return req;
};

const httpParameter = (type, key, value, defaultValue) => {
  if (value === undefined && defaultValue === undefined) {
    throw httpResponse.badRequest({'message': `Required parameter(${type}.${key})`});
  } else if (value === undefined) {
    return defaultValue;
  } else {
    return value;
  }    
};
http.api = (controllerMethod) => { 
  return (req, {}, next) => {    
    controllerMethod(httpRequest(req), httpResponse)
    .then(resultObject => {
      next(resultObject);
    })
    .catch(e => {
      console.error(e);
      next(e);
    });
  };
};
http.notFound = ({}, res, next) => {    
  next(httpResponse.notFound());
};
http.res = (type) => {            
  return (data, {}, res, {}) => {
    res.type(type); 
    if (!(data instanceof HttpResponse)) {            
      if (data === null || data === undefined) {
        data = httpResponse.internalServerError({message: 'Unknown error'});
      } else {
        data = httpResponse.internalServerError({message: data + ''});
      }            
    }
    const env = process.env.ENVIRONMENT || 'production';
    if (data.data === null || data.data === undefined) {
      if (data.httpStatus >= 500 && env.toLowerCase() === 'production') {
        res.status(data.httpStatus).send({code: data.httpStatus , status: httpStatus[data.httpStatus]});        
      } else {
        res.status(data.httpStatus).send({code: data.httpStatus , status: httpStatus[data.httpStatus], message: data.message});
      }            
    } else {            
      if (data.httpStatus >= 500 && env.toLowerCase() === 'production') {
        res.status(data.httpStatus).send({code: data.httpStatus , status: httpStatus[data.httpStatus]});        
      } else {
        res.status(data.httpStatus).send(data.data);
      }             
    }
  }
};
http.httpResponse = httpResponse;

module.exports = http;