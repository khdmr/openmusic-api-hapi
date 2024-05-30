class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong(
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    );

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title = '', performer = '' } = request.query;

    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id: songId } = request.params;

    const song = await this._service.getSongById(songId);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });

    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id: songId } = request.params;
    const
      {
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      } = request.payload;

    await this._service.editSongById(songId, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id: songId } = request.params;

    await this._service.deleteSongById(songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
