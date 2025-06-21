import api from './api';

const getSongs = async () => {
  const response = await api.get('/songs');
  return response.data;
};

const getSongById = async (id) => {
  const response = await api.get(`/songs/${id}`);
  return response.data;
};

const createSong = async (songData) => {
  const response = await api.post('/songs', songData);
  return response.data;
};

const updateSong = async (id, songData) => {
  const response = await api.put(`/songs/${id}`, songData);
  return response.data;
};

const deleteSong = async (id) => {
  await api.delete(`/songs/${id}`);
  return id;
};

const uploadAttachment = async (songId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/songs/${songId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

const deleteAttachment = async (songId, attachmentId) => {
  await api.delete(`/songs/${songId}/attachments/${attachmentId}`);
  return { songId, attachmentId };
};

const getSongsByBand = async (bandId) => {
  const response = await api.get(`/bands/${bandId}/songs`);
  return response.data;
};

const importSongFromSpotify = async (spotifyId) => {
  const response = await api.post('/songs/import/spotify', { spotifyId });
  return response.data;
};

const searchSongs = async (query) => {
  const response = await api.get(`/songs/search?q=${query}`);
  return response.data;
};

const songService = {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  uploadAttachment,
  deleteAttachment,
  getSongsByBand,
  importSongFromSpotify,
  searchSongs,
};

export default songService;
