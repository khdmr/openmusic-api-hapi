const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    usersService,
    authenticationsService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      usersService,
      authenticationsService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
