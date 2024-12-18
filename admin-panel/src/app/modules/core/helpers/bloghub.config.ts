export const API_CONFIG = {
    api_key: 'AIzaSyCDi0yomqGZ6Z7jRyc7Pku1qtyI4FceXyo'
};

export const PROVIDER_TYPE = {
    EMAIL_PASSWORD: 'EMAIL_PASSWORD',
    GOOGLE: 'GOOGLE'
};

export const LOCALSTORAGE_CONFIG = {
    prefix: 'ap',
    delimiterString: '#',
    birth_date: '20**94',
};

export const LOCALSTORAGE_TOKEN_NAME = {
    name: `${LOCALSTORAGE_CONFIG.prefix}${LOCALSTORAGE_CONFIG.delimiterString}${LOCALSTORAGE_CONFIG.birth_date}`
};

export const DEFAULT_PROFILE_ICON = {
    // image: '../../../../../assets/images/avatar/user-undefined.png'
    image: '../../../../../assets/images/avatar/icons8-user-100.png'
}

export const VERIFIED_NOT_VERIFIED_ICON = {
    verified_icon: '../../../../../assets/images/blog/verified.png',
    not_verified_icon: '../../../../../assets/images/blog/notverified.png'
}

export const DEFAULT_DISPLAYNAME_PREFIX = {
    perfix: '@'
}

export const EMAIL_VERIFICATION_STATUS = {
    VERIFIED: 'verified',
    NOT_VERIFIED: 'not_verified',
    ALREADY_VERIFIED: 'already_verified'
}