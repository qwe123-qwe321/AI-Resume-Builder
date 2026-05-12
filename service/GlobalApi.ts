import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_KEY: string = import.meta.env.VITE_STRAPI_API_KEY || '';
const BASE_URL: string = import.meta.env.VITE_BASE_URL || '';
const axiosClient: AxiosInstance = axios.create({
  baseURL: (BASE_URL ? BASE_URL.replace(/\/$/, '') : '') + '/api/',
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const CreateNewResume = (data: Record<string, unknown>): Promise<AxiosResponse> =>
  axiosClient.post("/user-resumes", data);

const GetUserResumes = (userEmail: string): Promise<AxiosResponse> =>
  axiosClient.get("/user-resumes?filters[userEmail][$eq]=" + userEmail);

const UpdateResumeDetail = (
  id: string | number | undefined,
  data: Record<string, unknown>
): Promise<AxiosResponse> => axiosClient.put("/user-resumes/" + id, data);

const GetResumeById = (id: string | number | undefined): Promise<AxiosResponse> =>
  axiosClient.get("/user-resumes/" + id + "?populate=*");

const DeleteResumeById = (id: string | number | undefined): Promise<AxiosResponse> =>
  axiosClient.delete("/user-resumes/" + id);

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};