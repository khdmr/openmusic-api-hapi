const mapDBAlbumToModel = (songs) => {
  const mapSong = {
    id: songs[0].id,
    name: songs[0].name,
    year: songs[0].year,
    songs: [],
  };

  songs.forEach((song) => {
    if (song.songid !== null) {
      mapSong.songs.push({
        id: song.songid,
        title: song.title,
        performer: song.performer,
      });
    }
  });

  return mapSong;
};

const mapDBPlaylistSongsToModel = (playlists) => {
  const mapPlaylistSongs = {
    id: playlists[0].id,
    name: playlists[0].name,
    username: playlists[0].username,
    songs: [],
  };

  playlists.forEach((playlist) => {
    if (playlist.id !== null) {
      mapPlaylistSongs.songs.push({
        id: playlist.song_id,
        title: playlist.title,
        performer: playlist.performer,
      });
    }
  });

  return mapPlaylistSongs;
};

const mapDBActivitiesToModel = (activities) => {
  const mapActivities = {
    playlistId: activities[0].id,
    activities: [],
  };

  activities.forEach((activity) => {
    if (activity.action !== null) {
      mapActivities.activities.push({
        username: activity.username,
        title: activity.title,
        action: activity.action,
        time: activity.time,
      });
    }
  });

  return mapActivities;
};

module.exports = {
  mapDBAlbumToModel,
  mapDBPlaylistSongsToModel,
  mapDBActivitiesToModel,
};
