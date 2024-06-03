const {
  AlbumPayloadSchema,
  CoverImageHeadersSchema,
} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateCoverImageHeaders: (hedaers) => {
    const validationResult = CoverImageHeadersSchema.validate(hedaers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
