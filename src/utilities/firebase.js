import { initializeApp } from 'firebase/app';

const firebaseConfig = {
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

const app = initializeApp(firebaseConfig);

export default app;
