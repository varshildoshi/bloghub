// import jwt_decode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

export const getUserDetails = (token: any) => {
    try {
        let decodedToken = jwtDecode(token);
        return decodedToken
    }
    catch (error) {
        redirectToLogin();
    }
}

export const redirectToLogin = () => {
    // localStorage.removeItem('access_token');
    // window.location.href = '/auth/login';
    return false;
}


export const getLoginUserInfo = () => {
    // let token: any = localStorage.getItem('access_token');
    // try {
    //     return jwtDecode(token);
    // }
    // catch (error) {
    //     return {};
    // }
}
