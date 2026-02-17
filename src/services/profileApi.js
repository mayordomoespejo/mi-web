import apiClient from "./apiClient";

export async function getExperience() {
  const response = await apiClient.get("/experience");
  return response.data;
}

export async function getEducation() {
  const response = await apiClient.get("/education");
  return response.data;
}

export async function getProfileSummary() {
  const response = await apiClient.get("/profile-summary");
  return response.data;
}
