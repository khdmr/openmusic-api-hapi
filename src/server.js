require('dotenv').config();

const Hapi = require('@hapi/hapi');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
