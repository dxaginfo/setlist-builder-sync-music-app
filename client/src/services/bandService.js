import api from './api';

const getBands = async () => {
  const response = await api.get('/bands');
  return response.data;
};

const getBandById = async (id) => {
  const response = await api.get(`/bands/${id}`);
  return response.data;
};

const createBand = async (bandData) => {
  const response = await api.post('/bands', bandData);
  return response.data;
};

const updateBand = async (id, bandData) => {
  const response = await api.put(`/bands/${id}`, bandData);
  return response.data;
};

const deleteBand = async (id) => {
  await api.delete(`/bands/${id}`);
  return id;
};

const getBandMembers = async (bandId) => {
  const response = await api.get(`/bands/${bandId}/members`);
  return response.data;
};

const addBandMember = async (bandId, memberData) => {
  const response = await api.post(`/bands/${bandId}/members`, memberData);
  return response.data;
};

const updateBandMember = async (bandId, memberId, memberData) => {
  const response = await api.put(`/bands/${bandId}/members/${memberId}`, memberData);
  return response.data;
};

const removeBandMember = async (bandId, memberId) => {
  await api.delete(`/bands/${bandId}/members/${memberId}`);
  return { bandId, memberId };
};

const getBandSetlists = async (bandId) => {
  const response = await api.get(`/bands/${bandId}/setlists`);
  return response.data;
};

const getBandSongs = async (bandId) => {
  const response = await api.get(`/bands/${bandId}/songs`);
  return response.data;
};

const searchBandMembers = async (email) => {
  const response = await api.get(`/users/search?email=${email}`);
  return response.data;
};

const bandService = {
  getBands,
  getBandById,
  createBand,
  updateBand,
  deleteBand,
  getBandMembers,
  addBandMember,
  updateBandMember,
  removeBandMember,
  getBandSetlists,
  getBandSongs,
  searchBandMembers,
};

export default bandService;
