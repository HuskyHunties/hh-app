import axios from "axios";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

/**
 * Creates the default axios object to access the backend.
 */
export default axios.create({
  //baseURL: "https://husky-hunties.azurewebsites.net",
  //baseURL: "http://localhost:3000",
  baseURL: "http://34.86.145.222:3000",
  responseType: "json",
});
