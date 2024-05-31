const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(userId, { name }) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [playlistId, name, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: 'SELECT id, name, owner as username FROM playlists WHERE owner = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsService;
