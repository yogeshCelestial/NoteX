/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { logoutHandler } from "./logout";

interface httpObj {
    endpoint: string,
    method?: string,
    headers?: { [key: string]: string },
    data?: { [key: string]: FormDataEntryValue | string }
}

export type Response = { [key: string]: string | Response };

const baseURL = process.env.API_URL || 'http://localhost:3000/api';

async function refreshAccessToken(refresh_token: string) {
    try {
        const response = await axios({
            baseURL,
            url: '/auth/refresh',
            method: 'POST',
            withCredentials: false,
            headers: { Authorization: `Bearer ${refresh_token}` },
        });
        if (response.data && 'refresh_token' in response.data) {
            localStorage.setItem('refresh_token', String(response.data.refresh_token));
            return true;
        }
    } catch (err: any) {
        console.log(err?.message);
        // ignore, handled in main flow
    }
    return false;
}

export async function httpHelper(
    httpObj: httpObj,
    successHandler: (res: Response) => void,
    errorHandler: (err: Error) => void
) {
    const method = httpObj.method || 'POST';
    try {
        const res = await axios({
            baseURL,
            url: httpObj.endpoint,
            method,
            withCredentials: true,
            headers: httpObj.headers || { "Content-Type": 'application/json' },
            data: JSON.stringify(httpObj.data),
        });
        successHandler(res?.data || {});
    } catch (err: any) {
        const refresh_token = localStorage.getItem('refresh_token');
        const status = err?.response?.status || err?.status;
        if (status === 401 && refresh_token) {
            const refreshed = await refreshAccessToken(refresh_token);
            if (refreshed) {
                // Retry original request
                try {
                    const res = await axios({
                        baseURL,
                        url: httpObj.endpoint,
                        method,
                        withCredentials: true,
                        headers: httpObj.headers || { "Content-Type": 'application/json' },
                        data: JSON.stringify(httpObj.data),
                    });
                    successHandler(res?.data || {});
                    return;
                } catch (retryErr: any) {
                    // user cannot be re-authenticated
                    if (retryErr.status === 401) {
                        logoutHandler();
                    } else {
                        errorHandler(retryErr);
                    }
                    return;
                }
            } else {
                errorHandler(err);
                logoutHandler();
                return;
            }
        } else {
            errorHandler(err);
        }
    }
}