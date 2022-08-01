import axios from "axios";
import { useState } from "react";

export const useSpotifyToken = () => {
  const [token, setToken] = useState("");
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  const refreshToken = async () => {
    const options = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    };
    const search = await axios
      .request(options)
      .catch((err) => console.log("!!!!error!!!!", err));
    const newToken = await search?.data?.access_token;
    setToken(newToken);
  };

  const getStoredToken = () => {
    const storedToken = localStorage.getItem("spotifyToken") || "";
    if (!storedToken) {
      refreshToken();
    }
    setToken(storedToken);
  };

  return { token, refreshToken, getStoredToken, setToken };
};
