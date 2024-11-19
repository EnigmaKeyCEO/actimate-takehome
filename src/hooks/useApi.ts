const useApi = () => {
  const apiBaseUrl = process.env.VITE_API_BASE_URL ?? "http://localhost:8888/.netlify/functions";

  return { apiBaseUrl };
};

export default useApi;
