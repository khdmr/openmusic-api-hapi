const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
};
