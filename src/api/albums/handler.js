class AlbumsHandler {
  constructor(service) {
    this._service = service;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum(name, year);

      const response = h.response({
        status: 'success',
        data: {
          id: albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
