import { toast } from 'sonner';
import { request } from './utils';

const logoutSuccess = (auth = true) => {
    localStorage.removeItem('refresh_token');
    if (!auth) {
        toast("Authentication Failed!", {
            description: "Please login again.",
        });
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }
};

export const logoutHandler = (auth: boolean) => {
    request({
        endpoint: '/api/auth/logout', 
    }, () => logoutSuccess(auth), () => { })
}