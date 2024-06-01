const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const activityId = `activity-${nanoid(16)}`;

    const query = {
      text: `
      INSERT INTO 
            activities 
        VALUES 
            ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        `,
      values: [activityId, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }
  }
}

module.exports = ActivitiesService;
