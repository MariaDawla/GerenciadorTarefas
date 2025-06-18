import axios from "axios";

console.log(axios);

const api = axios.create({
  baseURL: "http://localhost:3001/",
});

export { api };
