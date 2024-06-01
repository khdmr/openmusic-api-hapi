const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const { mapDBActivities } = require('../../utils');

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

  async getActivities(playlistId) {
    const query = {
      text: `
      SELECT 
        p.id,
        u.username,
        s.title,
        a.action,
        a.time
      FROM
        playlists p
      LEFT JOIN
        activities a
      ON
        a.playlist_id = p.id
      LEFT JOIN
        users u
      ON
        a.user_id = u.id
      LEFT JOIN
        songs s
      ON
        a.song_id = s.id
      WHERE
        p.id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const activities = await mapDBActivities(result.rows);

    return activities;
  }
}

module.exports = ActivitiesService;
