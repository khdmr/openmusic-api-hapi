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

module.exports = {
  mapDBAlbumToModel,
};
