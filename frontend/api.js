import axios from "axios";
import { baseURL } from './config';

export default axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  },
});