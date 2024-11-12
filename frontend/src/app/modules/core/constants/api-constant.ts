export const API_PATH: any = {
    // ADMIN AUTH
    ADMIN_LOGIN: '/admin/login',

    // AUTH
    LOGIN_POST: '/login',
    DIRECT_LOGIN_POST: '/directlogin',
    REGISTER: '/register',
    CHECK_USER_EMAIL: '/checkuseremail',
    FORGET_PASSWORD: '/forgetpassword',
    RESET_PASSWORD: '/resetpassword',
    VERIFY_ACCOUNT: '/verifyaccount',
    RESEND_LINK: '/resendverifytoken',

    // User Logout
    LOGOUT: '/logout',

    // Admin Logout
    ADMIN_LOGOUT: '/admin/logout',

    // CAMPAIGN
    GET_ALL_CAMPAIGN: 'campaign?',
    CREATE_CAMPAIGN: 'campaign',
    UPDATE_CAMPAIGN_STATUS: 'campaign/',
    GET_CAMPAIGN_BY_GUID: 'campaign/',
    UPDATE_CAMPAIGN_PRIZE: 'campaign/',

    // DELETE CAMPAIGN PRIZE
    DELETE_CAMPAIGN_PRIZE: 'campaign/',

    // CAMPAIGN PRIZE
    PRIZE: '/prize',
    GET_CAMPAIGN_PRIZE: 'campaign/',
    CREATE_CAMPAIGN_PRIZE: 'campaign/',

    // CAMPAIGN GAME
    CAMPAIGN_GAME: 'game',
    CAMPAIGN_GAME_UPDATE: 'campaign/',
    CAMPAIGN_GAME_PLAY_DETAILS : 'campaign/game/play/',
    CAMPAIGN_DEFAULT : 'campaign/default',

    // MASTER
    COUNTRY: '/master/country/lookup',
    TIME_ZONE: '/master/timezone/lookup',
    CAMPAIGN_TYPE: 'master/camptype/lookup',

    // COMMON
    PLAN: 'plan/active',
    IMAGE_UPLOAD: 'common/uploadfile',
    USER_INFO: '/user',

    // COMMON USER API
    CHANGE_PASSWORD: '/changepassword',

    // USER
    UPDATE_USER_DETAILS: '/profile',
    GET_USER_DETAILS: 'user',
    GET_ADMIN_USER_DETAILS: 'admin/profile',

    // ORGANIZATION
    UPDATE_ORG: '/organization',
    GET_ORG: '/organization',

    // USER ADMIN
    GET_ADMIN_ALL_USER: 'admin/user?',
    UPDATE_USER_STATUS: 'admin/user/',

    // ADMIN PLAN
    GET_ALL_PLAN: 'admin/plan?',
    UPDATE_PLAN_STATUS: 'admin/plan/',
    ADD_PLAN: 'admin/plan',
    UPDATE_PLAN: 'admin/plan/',

    // PAYMENT
    UPDATE_USER_PAYMENT: '/payment/stripe',

    // ADMIN USER DETAIL
    GET_ADMIN_USER_DETAIL: 'admin/user/',
    GET_LOGIN: '/login?',
    GET_USER_TRANSACTION: 'admin/user/',

    // ADMIN DASHBOARD DETAILS
    ADMIN_DASHBOARD_DETAILS: 'admin/total/dashboard',

    // ADMIN DASHBOARD MONTHLY DETAILS
    ADMIN_DASHBOARD_MONTHLY_DETAILS: 'admin/monthly/dashboard?',

    // DASHBOARD
    DASHBOARD_CAMPAIGN_COUNT : 'dashboard/campaign/count',
    DASHBOARD_CAMPAIGN_STATUS_COUNT : 'dashboard/campaign/game/status/count',

    GET_ALL_TRANSACTION: 'transaction?',

};


