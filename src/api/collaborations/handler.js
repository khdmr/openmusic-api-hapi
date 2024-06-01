class CollaborationsHandler {
  constructor(usersService, playlistService, collaborationsService, validator) {
    this._usersService = usersService;
    this._playlistService = playlistService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;

    this.postCollaboratorHandler = this.postCollaboratorHandler.bind(this);
    this.deleteCollaboratorHandler = this.deleteCollaboratorHandler.bind(this);
  }

  async postCollaboratorHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { playlistId, userId: userIdCollab } = request.payload;

    await this._usersService.verifyUserIsExist(userIdCollab);
    await this._playlistService.verifyPlaylistOwner({ playlistId, userId });

    const collaborationId = await this._collaborationsService.addCollaboration({
      playlistId,
      userIdCollab,
    });

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaboratorHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { userId } = request.auth.credentials;
    const { playlistId, userId: userIdCollab } = request.payload;

    await this._playlistService.verifyPlaylistOwner({ playlistId, userId });
    await this._usersService.verifyUserIsExist(userIdCollab);

    await this._collaborationsService.deleteCollaboration({
      playlistId,
      userIdCollab,
    });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
