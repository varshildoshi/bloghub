// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const devBaseURL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const version = 'v1';

export const environment = {
  production: false,
  devBaseURL,
  baseURL: `${devBaseURL}`,
  version,
  firebaseConfig: {
    apiKey: "AIzaSyCDi0yomqGZ6Z7jRyc7Pku1qtyI4FceXyo",
    authDomain: "bloghub-d7026.firebaseapp.com",
    projectId: "bloghub-d7026",
    storageBucket: "bloghub-d7026.appspot.com",
    messagingSenderId: "303120790329",
    appId: "1:303120790329:web:ef096ff9f8bb836386eee8"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
