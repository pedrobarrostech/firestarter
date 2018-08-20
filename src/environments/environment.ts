// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA-sZn5GZBW2SU17xB6-JpuYSgSP3IDh08',
    authDomain: 'almanaque-62204.firebaseapp.com',
    databaseURL: 'https://almanaque-62204.firebaseio.com',
    projectId: 'almanaque-62204',
    storageBucket: 'almanaque-62204.appspot.com',
    messagingSenderId: '581326886241'
  },
  API_URL: 'http://pedrobarros.info/api/',
  ASSETS_URL: 'http://pedrobarros.info/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
