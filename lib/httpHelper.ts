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
async function refreshAccessToken() {
    try {
        const response = await axios({
            // baseURL,
            url: '/api/auth/refresh',
            method: 'POST',
            withCredentials: true,
        });
        if (response) {
            return true;
        }
    } catch (err: any) {
        console.log(err?.message);
        // ignore, handled in main flow
    }
    return false;
};

const fetchWithAccessToken = async (obj: httpObj, success: (res: Response) => void) => {
    const method = obj.method || 'POST';
    const res = await axios({
        // baseURL,
        url: obj.endpoint,
        method,
        withCredentials: true,
        headers: obj.headers || { "Content-Type": 'application/json' },
        data: JSON.stringify(obj.data),
    });
    success(res?.data || {});
}

export async function httpHelper(
    httpObj: httpObj,
    successHandler: (res: Response) => void,
    errorHandler: (err: Error) => void
) {
    try {
        // original request
        await fetchWithAccessToken(httpObj, successHandler);
    } catch (err: any) {
        const status = err?.response?.status || err?.status;
        if (status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry original request
                try {
                    await fetchWithAccessToken(httpObj, successHandler);
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
        } else if (status === 403) {
            // in case access token invalid/expired
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