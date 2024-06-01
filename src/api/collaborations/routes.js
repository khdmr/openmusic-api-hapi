const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaboratorHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
