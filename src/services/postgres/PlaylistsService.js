const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBPlaylistSongsToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
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
      text: `
      SELECT 
        p.id, p.name, u.username 
      FROM 
        playlists p
      LEFT JOIN
        collaborations c
      ON
        p.id = c.playlist_id
      INNER JOIN
        users u
      ON
        p.owner = u.id
      WHERE 
        p.owner = $1
      OR
        c.user_id = $1
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById({ playlistId }) {
    const query = {
      text: `
      DELETE FROM 
        playlists 
      WHERE 
        id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addPlaylistSong({ playlistId, songId }) {
    const playlistSongId = `playlist_songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [playlistSongId, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getPlaylistSongs({ playlistId }) {
    const query = {
      text: `
      SELECT
        p.id,
        p.name,
        u.username,
        s.id as song_id,
        s.title,
        s.performer
      FROM
        playlists p
      INNER JOIN
        users u
      ON
        p.owner = u.id
      INNER JOIN
        playlist_songs ps
      ON
        p.id = ps.playlist_id
      INNER JOIN
        songs s
      ON
        ps.song_id = s.id
      WHERE
        p.id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    const playlist = mapDBPlaylistSongsToModel(result.rows);

    return playlist;
  }

  async deletePlaylistSong({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu didalam playlist gagal dihapus. Id lagu tidak ditemukan');
    }
  }

  async verifyPlaylistOwner({ playlistId, userId }) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const playlist = await this._pool.query(query);

    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (playlist.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess({ playlistId, userId }) {
    try {
      await this.verifyPlaylistOwner({ playlistId, userId });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator({ playlistId, userId });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
