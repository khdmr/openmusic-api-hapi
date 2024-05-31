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

module.exports = {
  mapDBAlbumToModel,
  mapDBPlaylistSongsToModel,
};
