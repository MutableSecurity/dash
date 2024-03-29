// Boolean indicating if the dummy data is used
export const IS_DUMMY_DATA_USED =
    process.env.REACT_APP_IS_DUMMY_DATA_USED || true;

// Boolean indicating if the build corresponds to production
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Miliseconds until the user is logout if no response from Firebase
export const LOGIN_CHECK_GRACE_PERIOD =
    process.env.LOGIN_CHECK_GRACE_PERIOD_IN_SECONDS || 3000;

// Firebase configuration
export const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCuxxjfdyRRU0IkgmuN07bizMzq90KZeV4',
    authDomain: 'mutablesecurity.firebaseapp.com',
    databaseURL:
        'https://mutablesecurity-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'mutablesecurity',
    storageBucket: 'mutablesecurity.appspot.com',
    messagingSenderId: '256666998300',
    appId: '1:256666998300:web:91e485c2fd01da8ad871d9',
    measurementId: 'G-Q4EYX6MQST',
};

// Miliseconds before reponding to a mocked function with promises
export const PROMISE_DELAY_WHEN_TESTING =
    process.env.PROMISE_DELAY_WHEN_TESTING_IN_SECONDS || 1000;

// Auto-refresh interval in miliseconds
export const AUTO_REFRESH_INTERVAL = 5 * 1000;
