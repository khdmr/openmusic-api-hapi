class PlaylistsHandler {
  constructor(playlistsService, songsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { userId } = request.auth.credentials;

    const { name } = request.payload;

    const playlistId = await this._playlistsService.addPlaylist(userId, { name });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { userId } = request.auth.credentials;

    const { playlists, cache } = await this._playlistsService.getPlaylists(userId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);

    if (cache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner({ playlistId, userId });
    await this._playlistsService.deletePlaylistById({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._songsService.verifySongIsExist(songId);
    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId });

    await this._playlistsService.addPlaylistSong({ playlistId, songId });

    await this._activitiesService.addActivity(playlistId, songId, userId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId });

    const playlist = await this._playlistsService.getPlaylistSongs({ playlistId });

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    await this._songsService.verifySongIsExist(songId);
    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId });

    await this._playlistsService.deletePlaylistSong({ playlistId, songId });

    await this._activitiesService.addActivity(playlistId, songId, userId, 'delete');

    const response = h.response({
      status: 'success',
      message: 'Lagu didalam playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId });
    const activities = await this._activitiesService.getActivities(playlistId);

    const response = h.response({
      status: 'success',
      data: activities,
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
