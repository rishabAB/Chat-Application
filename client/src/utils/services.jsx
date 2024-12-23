export const baseUrl = "https://chat-application-server-roop.onrender.com/api";
// https://chat-application-server-roop.onrender.com/api
// http://localhost:5000/api

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occurred";

    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
