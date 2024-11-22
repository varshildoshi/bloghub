// import jwt_decode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
import { LOCALSTORAGE_TOKEN_NAME } from "./bloghub.config";

export const getUserDetails = (token: any) => {
    try {
        let decodedToken = jwtDecode(token);
        return decodedToken
    }
    catch (error) {
        redirectToHome();
    }
}

export const redirectToHome = () => {
    localStorage.removeItem(`${LOCALSTORAGE_TOKEN_NAME.name}`);
    window.location.href = '/';
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
