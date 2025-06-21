import api from './api';

const getSetlists = async () => {
  const response = await api.get('/setlists');
  return response.data;
};

const getSetlistById = async (id) => {
  const response = await api.get(`/setlists/${id}`);
  return response.data;
};

const createSetlist = async (setlistData) => {
  const response = await api.post('/setlists', setlistData);
  return response.data;
};

const updateSetlist = async (id, setlistData) => {
  const response = await api.put(`/setlists/${id}`, setlistData);
  return response.data;
};

const deleteSetlist = async (id) => {
  await api.delete(`/setlists/${id}`);
  return id;
};

const addSongToSetlist = async (setlistId, songId, position = null) => {
  const response = await api.post(`/setlists/${setlistId}/items`, {
    songId,
    position,
  });
  return response.data;
};

const removeSongFromSetlist = async (setlistId, itemId) => {
  await api.delete(`/setlists/${setlistId}/items/${itemId}`);
  return { setlistId, itemId };
};

const updateSetlistItem = async (setlistId, itemId, itemData) => {
  const response = await api.put(`/setlists/${setlistId}/items/${itemId}`, itemData);
  return response.data;
};

const reorderSetlistItems = async (setlistId, itemIds) => {
  const response = await api.put(`/setlists/${setlistId}/reorder`, {
    itemIds,
  });
  return response.data;
};

const shareSetlist = async (setlistId, shareData) => {
  const response = await api.post(`/setlists/${setlistId}/share`, shareData);
  return response.data;
};

const exportSetlist = async (setlistId, format = 'pdf') => {
  const response = await api.get(`/setlists/${setlistId}/export?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

const getSetlistVersions = async (setlistId) => {
  const response = await api.get(`/setlists/${setlistId}/versions`);
  return response.data;
};

const createSetlistVersion = async (setlistId, versionData) => {
  const response = await api.post(`/setlists/${setlistId}/versions`, versionData);
  return response.data;
};

const getSetlistVersion = async (setlistId, versionId) => {
  const response = await api.get(`/setlists/${setlistId}/versions/${versionId}`);
  return response.data;
};

const restoreSetlistVersion = async (setlistId, versionId) => {
  const response = await api.post(`/setlists/${setlistId}/versions/${versionId}/restore`);
  return response.data;
};

const getSetlistComments = async (setlistId) => {
  const response = await api.get(`/setlists/${setlistId}/comments`);
  return response.data;
};

const addSetlistComment = async (setlistId, comment) => {
  const response = await api.post(`/setlists/${setlistId}/comments`, {
    content: comment,
  });
  return response.data;
};

const deleteSetlistComment = async (setlistId, commentId) => {
  await api.delete(`/setlists/${setlistId}/comments/${commentId}`);
  return { setlistId, commentId };
};

const setlistService = {
  getSetlists,
  getSetlistById,
  createSetlist,
  updateSetlist,
  deleteSetlist,
  addSongToSetlist,
  removeSongFromSetlist,
  updateSetlistItem,
  reorderSetlistItems,
  shareSetlist,
  exportSetlist,
  getSetlistVersions,
  createSetlistVersion,
  getSetlistVersion,
  restoreSetlistVersion,
  getSetlistComments,
  addSetlistComment,
  deleteSetlistComment,
};

export default setlistService;
