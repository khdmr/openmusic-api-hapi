class AuthenticationsHandler {
  constructor(
    usersService,
    authenticationsService,
    tokenManager,
    validator,
  ) {
    this._usersService = usersService;
    this._authenticationsService = authenticationsService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
  }

  async postAuthenticationsHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;

    const userId = await this._usersService.verifyUserCredential({
      username,
      password,
    });

    const accessToken = this._tokenManager.generateAccessToken(userId);
    const refreshToken = this._tokenManager.generateRefreshToken(userId);

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AuthenticationsHandler;
