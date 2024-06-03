const mapDBAlbumToModel = (albums) => {
  const mapSong = {
    id: albums[0].id,
    name: albums[0].name,
    year: albums[0].year,
    coverUrl: albums[0].cover,
    songs: [],
  };

  albums.forEach((album) => {
    if (album.songid !== null) {
      mapSong.songs.push({
        id: album.songid,
        title: album.title,
        performer: album.performer,
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
    if (playlist.song_id !== null) {
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
