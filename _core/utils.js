'use strict';

const condition = {
  isNull: value => value === null,
  isNotNull: value => value !== null,  
};

const result = (data = {}) => {
  return {
    isSuccess: true,
    isAuth: false,
    message: '요청이 정상 처리 되었습니다.',
    data
  };
};

const misc = {
  randomInt: (min, max) => Math.floor(Math.random() * (max - min)) + min
}

module.exports = {condition, result, misc};