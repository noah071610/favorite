import axios from "axios"

export const _url = {
  client: process.env.NEXT_PUBLIC_CLIENT_URL,
  server: process.env.NEXT_PUBLIC_SERVER_URL,
}

export const server = axios.create({
  baseURL: _url.server, // Replace with your base URL
})
