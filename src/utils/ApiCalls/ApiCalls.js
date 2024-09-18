import axios from "axios";

const api_base = "https://electronics-ecomm-back.vercel.app/api/v1";

export const baseApi = axios.create({
  baseURL: api_base,
});
