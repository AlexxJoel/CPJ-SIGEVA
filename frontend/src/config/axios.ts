import axios, { type AxiosInstance } from "axios";

const serverURL = import.meta.env.VITE_BASE_SEVER_URL;

const instance: AxiosInstance = axios.create({
  baseURL: serverURL,
  timeout: 30_000,
});

export default instance;
