import axios from "axios";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

/**
 * Creates the default axios object to access the backend.
 */
export default axios.create({
  baseURL: "http://10.0.0.159:3000",
  responseType: "json",
});
