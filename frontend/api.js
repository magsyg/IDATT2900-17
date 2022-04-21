import axios from "axios";
import { baseURL } from './config';

export default axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
    Authorization:'Token 71fdc88b4a624e06b28cecd120e1937bcc34b25c'
  },
});