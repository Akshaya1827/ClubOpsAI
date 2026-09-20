const API_BASE_URL = "http://localhost:5000/api";

export const sendAIMessage = async (message) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "You are not logged in. Please log in first."
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to communicate with ClubOps AI"
    );
  }

  return data;
};