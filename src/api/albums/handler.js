class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum(name, year);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const album = await this._service.getAlbumById(albumId);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });

    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const { id: albumId } = request.params;

    await this._service.editAlbumById(albumId, { name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasi diperbarui',
    });

    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;

    await this._service.deleteAlbumById(albumId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasi dihapus',
    });

    response.code(200);
    return response;
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateCoverImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/images/${filename}`;
    await this._service.editAlbumCover(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyAlbumIsExist(albumId);

    await this._service.verifyAlbumLike(albumId, userId);
    await this._service.addAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;

    await this._service.verifyAlbumIsExist(albumId);

    const likes = Number(await this._service.getAlbumLikes(albumId));

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyAlbumIsExist(albumId);

    await this._service.deleteAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Anda batal menyukai album ini',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
