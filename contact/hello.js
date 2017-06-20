exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            return reply('Hello World\n');
        }
    });
    next();
    const getHello = function(name) {
     const target = name || "world";
     return `Hello ${target}`;
   };
   server.expose({ getHello: getHello });
};
exports.register.attributes = {
    name: 'hello'
};