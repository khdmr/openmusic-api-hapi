class ExportsHandler {
  constructor(playlistsService, ProducerService, validator) {
    this._playlistsService = playlistsService;
    this._ProducerService = ProducerService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { targetEmail } = request.payload;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner({ playlistId, userId });

    const message = {
      targetEmail,
      playlistId,
    };

    await this._ProducerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
