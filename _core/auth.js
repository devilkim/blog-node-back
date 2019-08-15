const {httpResponse} = require('./http');
const jwt = require('jsonwebtoken');
const auth = {
  REQUIRED: true,
  OPTIONAL: false,
  encodeToken: (data) => jwt.sign(data, process.env.JWT_SECRET_KEY),
  decodeToken: (token) => jwt.verify(token, process.env.JWT_SECRET_KEY),
  isAuthCustom: (token) => true,
  authType: (authType) => {
    return (req, res, next) => {        
      console.log('#####');
      try {      
        console.log('SUCCESS1');
        console.log(req.headers.authorization);
        req.token = auth.decodeToken(req.headers.authorization.replace('Bearer ', ''));
        req.isAuth = true;
        console.log('SUCCESS2');
        console.log(req.token);
        if (!auth.isAuthCustom(req.token)) {          
          throw httpResponse.unauthorized();
        }        
        console.log('SUCCESS3');
        next();
      } catch (e) {
        req.isAuth = false;
        console.log('ERROR1');
        if (authType === auth.REQUIRED) {          
          console.log('ERROR2');
          next(httpResponse.unauthorized());
        } else {
          console.log('ERROR3');
          next();
        }      
      }
    };
  }
};

module.exports = auth;