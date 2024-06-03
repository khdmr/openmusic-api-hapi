const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration({ playlistId, userIdCollab }) {
    const collaborationId = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [collaborationId, playlistId, userIdCollab],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('kolaborasi gagal ditambahkan');
    }

    await this._cacheService.delete(`playlistOwner:${userIdCollab}`);

    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userIdCollab }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userIdCollab],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('kolaborasi gagal dihapus');
    }
    await this._cacheService.delete(`playlistOwner:${userIdCollab}`);
  }

  async verifyCollaborator({ playlistId, userId }) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
