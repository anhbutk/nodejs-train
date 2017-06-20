'use strict';
const Uuid = require('uuid');
const Boom = require('boom');
exports.register = function (server, options, next) {
    // [1] // [2]
    // [3]
    let store;
    server.dependency('hapi-level', (server, after) => {
        store = server.plugins['hapi-level'].db;
        return after();
    });
    const getUser = function (userId, callback) {
        return store.get(userId, callback);
    }
    const createUser = (userDetails, callback) => {
        const userId = Uuid.v4();
        const user = {
            id: userId,
            details: userDetails
        };
        store.put(userId, user, (err) => {
            callback(err, user);
        });
    }
  server.route([{
    method: 'GET',
    path: '/api/user/{userid}',
    config: {
        description:'retrieve a user',
        handler: function(request,reply){
            const userId = request.params.userid;
            getUser(userId, (err,user)=>{
                if(err)
                {
                    return reply(Boom.notFound(err));
                }
                reply(user);
            });
        }
    }
  },
  {
    method: 'POST',
    path: '/api/user',
    config:{
        description:'create a new user',
        handler: function(request,reply){
            const userDetail = request.payload;
            console.log(userDetail);
            createUser(userDetail, (err,user)=>{
                if(err){
                    return reply(Boom.badRequest(err));
                }
               reply(user);
            })
        }
    }
  }]);
  server.expose({
      getUser: getUser,
      createUser: createUser
  })
return next();
};
exports.register.attributes = {
    name:'userStore'
};