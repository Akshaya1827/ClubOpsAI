import { getAuthToken } from "./authService";

const API_BASE_URL =
  "http://localhost:5000/api";

export const sendAIMessage = async (
  message
) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication required. Please log in."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/ai/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        message,
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response."
    );
  }

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    throw new Error(
      "Your session expired. Please log in again."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "AI request failed."
    );
  }

  return data;
};