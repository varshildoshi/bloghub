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