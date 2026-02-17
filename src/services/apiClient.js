import axios from "axios";
import experience from "../mocks/experience.json";
import education from "../mocks/education.json";
import profile from "../mocks/profile.json";

const routes = {
  "/experience": experience,
  "/education": education,
  "/profile-summary": profile
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 5000
});

apiClient.defaults.adapter = async (config) => {
  await delay(350);

  const method = config.method?.toLowerCase() || "get";
  const rawUrl = config.url || "";
  const endpoint = rawUrl.replace("/api", "");

  if (method !== "get") {
    return {
      data: { message: "Method Not Allowed" },
      status: 405,
      statusText: "Method Not Allowed",
      headers: {},
      config
    };
  }

  if (!(endpoint in routes)) {
    return {
      data: { message: "Not Found" },
      status: 404,
      statusText: "Not Found",
      headers: {},
      config
    };
  }

  return {
    data: routes[endpoint],
    status: 200,
    statusText: "OK",
    headers: {},
    config
  };
};

export default apiClient;
