const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    usersService,
    playlistsService,
    collaborationsService,
    validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      usersService,
      playlistsService,
      collaborationsService,
      validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
