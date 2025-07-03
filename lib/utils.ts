import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface HTTPOBJ {
  endpoint: string,
  method?: string,
  headers?: {
    Authorization: string,
    [key: string]: string
  }
  authorization?: boolean,
  data?: {
    [key: string]: FormDataEntryValue | string;
  }
}

export type Response = {
  [key: string]: string | Response
};

export async function request(httpObj: HTTPOBJ, successHandler: (res: Response) => void, errorHandler: (err: Error) => void) {
  const baseURL = process.env.API_URL || 'http://localhost:3000/api';
  console.log(baseURL)
  const method = httpObj.method || 'POST';
  await axios({
    baseURL,
    url: httpObj.endpoint,
    method,
    withCredentials: httpObj?.authorization || true,
    headers: httpObj.headers || {
      "Content-Type": 'application/json'
    },
    data: JSON.stringify(httpObj.data),
  }).then((res) => successHandler(res?.data || {}))
    .catch((err) => errorHandler(err));
}