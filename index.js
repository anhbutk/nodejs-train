'use strict';
const Hapi = require('hapi')
const Boom = require('boom')
const Joi = require('joi')
const Blipp = require('blipp');
const Inert = require('inert');
const Vision = require('vision');
const Jwt = require('hapi-auth-jwt')
const HapiSwagger = require('hapi-swagger');
const contactDatas = require('./data/contacts.js');
const userHanlder = require('./contact/login');
 const HapiLevel = require('hapi-level');                [1]
 const UserStore = require('./data/user-store');    
const Hello = require('./contact/hello');
const server = new Hapi.Server()
const options = {
    info: {
        'title': 'HAPI API Documentation for Hung pham'
    }
};
server.connection({
    port: 8080
});

server.route({
    method: 'GET',
    path: '/api/login',
    config: {
        description: 'create new access token',
        notes: 'Returns 200 when login success.',
        tags: ['api'], // ADD THIS TAG
        handler: (request, reply) => {
            reply(contactDatas);
        }
    }
});

server.route({
    method: 'GET',
    path: '/api/contacts',
    config: {
        description: 'Get a contact lisr',
        notes: 'Returns contact list.',
        tags: ['api'], // ADD THIS TAG
        handler: (request, reply) => {
            reply(contactDatas);
        }
    }
});

server.route({
    method: 'GET',
    path: '/api/contacts/{id}',
    config: {
        description: 'Get a contact detail',
        notes: 'Returns a contact from file by id as paramenter',
        tags: ['api'], // ADD THIS TAG
        handler: (request, reply) => {
            let contact = contactDatas.find(contact => contact.id === request.params.id);
            if (!contact) {
                return reply(Boom.notFound('Contact not found!'));
            }
            reply(contact);
        }
    }
});
const payloadValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
});



server.route({
    method: 'POST',
    path: '/api/contacts',
    config: {
        description: 'create a new contact',
        notes: 'Returns a contact be created',
        tags: ['api'], // ADD THIS TAG
        handler: (request, reply) => {
            let submittedData = request.payload;
            submittedData.id = contactDatas.length + 1;
            contactDatas.push(submittedData);
            //fs.appendFile("results.json", submittedData)
            reply(submittedData);
        },
        validate: {
            payload: payloadValidator
        }
    }
});

server.route({
    method: 'PUT',
    path: '/api/contacts/{id}',
    config: {
        description: 'update a contact',
        notes: 'Returns a contact be updated',
        tags: ['api'], // ADD THIS TAG
        handler: (request, reply) => {
            const name = request.payload.name;
            reply('you add 1 user name:' + name);
        }
    }
});
server.route({
    method: 'DELETE',
    path: '/api/contacts/{id}',
    config: {
        handler: (request, reply) => {
            reply('you delete 1 user name:');
        },
        description: 'Delete a contact',
        notes: 'Returns a contact be deleted by id in the path',
        tags: ['api'], // ADD THIS TAG
        validate: {
            params: {
                id: Joi.number()
                    .required()
                    .description('the id for deleting contact'),
            }
        }
    }
});
server.route({
    method: 'GET',
    path: '/hello/{name}',
    config:{
        description: 'Return an object with hello message',
        validate:{
            params :{
                name: Joi.string().min(3).required()
            }
        },
        pre: [],
        handler: function (request,reply) {
             const name = request.params.name;        
             reply({message: 'Hello  '  +server.plugins.hello.getHello('Anh Nguyen')});   
            }
    }
});

server.register([
    Inert,
     { 
         register: Hello, options: {}
     },  {
         register: HapiLevel, options:{ config: { valueEncoding: 'json' }}
     },
     UserStore,
    Blipp,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    },
    Jwt], (err) => {
        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });
