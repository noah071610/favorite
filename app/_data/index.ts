import axios from "axios"

export const _url = {
  client: process.env.NEXT_PUBLIC_CLIENT_URL,
  server: process.env.NEXT_PUBLIC_SERVER_URL,
}

export const API = axios.create({
  withCredentials: true,
  baseURL: _url.server,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})
