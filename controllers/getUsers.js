let formatUser = require('../services/formatUser');
let password = require('../services/password');
let selectUser = require('../database/selectUser');
let selectUsers = require('../database/selectUsers');

module.exports = function(req, res) {

  if(typeof req.query.username !== 'undefined') {
    return getSingleUser(req, res);
  }

  getUsers(
    req
  ).then(users => {
    res.json(users);
  }).catch(function(err) {
    res.status('500').json({});
  });
};

function getUsers(req) {

  if(typeof req.query.ids !== 'undefined') {
    return selectUsers.withIds(req.query.ids.split(','));
  }

  return selectUsers.all().then(
    users => formatUsers(users)
  )
}

function getSingleUser(req, res) {

  return selectUser.withUsername(
    req.query.username
  ).then(user => {

    if(typeof req.query.password !== 'undefined') {
      return validatePasswordAndGetUser(user, req, res);
    }

    return res.json(formatUser(user));

  }).catch(
    () => res.status('404').json({})
  );
}

function validatePasswordAndGetUser(user, req, res) {
  password.validate(
    req.query.password,
    user.password,
    function isValid() {
      res.json(formatUser(user));
    },
    function isNotValid() {
      res.status('404').json({});
    }
  );
}

function formatUsers(users) {
  return users.map(user => {
    return formatUser(user);
  });
}
