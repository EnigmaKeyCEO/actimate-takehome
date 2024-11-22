import { API_BASE_URL } from "#/api/config";

const useApi = () => {
  const apiBaseUrl = API_BASE_URL

  return { apiBaseUrl };
};

export default useApi;
