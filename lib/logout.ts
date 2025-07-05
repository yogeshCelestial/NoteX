import { request } from './utils';

const logoutSuccess = () => {
    localStorage.removeItem('refresh_token');
    setTimeout(() => {
    window.location.href = '/login';
    }, 3000);
};

export const logoutHandler = () => {
    request({
        endpoint: '/auth/logout', headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
        }
    }, logoutSuccess, () => { })
}