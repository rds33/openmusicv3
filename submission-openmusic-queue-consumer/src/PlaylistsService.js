const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlist_songs
      ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistInfo(playlistId) {
    const query = {
      text: `SELECT id, name
      FROM playlists
      WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = PlaylistsService;