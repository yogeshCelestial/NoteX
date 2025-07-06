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

// const baseURL = process.env.API_URL || 'http://localhost:3000/api';

// function to rotate token
async function refreshAccessToken(refresh_token: string) {
    try {
        const response = await axios({
            // baseURL,
            url: '/api/auth/refresh',
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
        // original request
        const res = await axios({
            // baseURL,
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
        // in case token expired but refresh token exist
        if (status === 401 && refresh_token) {
            const refreshed = await refreshAccessToken(refresh_token);
            if (refreshed) {
                // Retry original request
                try {
                    const res = await axios({
                        // baseURL,
                        url: httpObj.endpoint,
                        method,
                        withCredentials: true,
                        headers: httpObj.headers || { "Content-Type": 'application/json' },
                        data: JSON.stringify(httpObj.data),
                    });
                    successHandler(res?.data || {});
                    return;
                } catch (retryErr: any) {
                    if (retryErr.status === 401 || retryErr.status === 403) {
                        // if retry of original request failed with token invialidity - user cannot be re-authenticated
                        logoutHandler(false);
                    } else {
                        // if some other error in retry of original request
                        errorHandler(retryErr);
                    }
                    return;
                }
            } else {
                // if some error occured in refreshing the token
                logoutHandler(false);
                return;
            }
        } else if ((status === 401 || status === 403) && !refresh_token) {
            // in case access token invalid/expired and doesn't have refresh token
            logoutHandler(true);
            setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
            // in case we have some other error (status code)
        } else {
            errorHandler(err);
        }
    }
}