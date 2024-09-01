import axios from "axios";

const api_base = "http://localhost:4000/api/v1";

export const baseApi = axios.create({
  baseURL: api_base,
});
