import axios from "axios";

const API_BASE = "http://localhost:9000";

export const syncFlagged = async () => {
  const res = await axios.get(`${API_BASE}/sync`);
  return res.data;
};

export const getFlagged = async (page = 1, limit = 50) => {
  const res = await axios.get(
    `${API_BASE}/flagged?page=${page}&limit=${limit}`
  );
  return res.data;
};
