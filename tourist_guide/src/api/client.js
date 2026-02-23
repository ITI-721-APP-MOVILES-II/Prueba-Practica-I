import axios from "axios";

export const api = axios.create({
  baseURL: "http://wafi.iit.cnr.it/openervm/api",
  timeout: 15000,
});
