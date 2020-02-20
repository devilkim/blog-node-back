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
      try {              
        req.token = auth.decodeToken(req.headers.authorization.replace('Bearer ', ''));
        req.isAuth = true;        
        if (!auth.isAuthCustom(req.token)) {          
          throw httpResponse.unauthorized();
        }                
        next();
      } catch (e) {
        req.isAuth = false;        
        if (authType === auth.REQUIRED) {                    
          next(httpResponse.unauthorized());
        } else {          
          next();
        }      
      }
    };
  }
};

module.exports = auth;