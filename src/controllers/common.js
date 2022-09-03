import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';

import { FIREBASE_CONFIG, PROMISE_DELAY_WHEN_TESTING } from '../config';
import { createPromiseWitData } from '../utilities/promises';

export const app = initializeApp(FIREBASE_CONFIG);

export const database = ref(getDatabase(app));

export function createMockedFirebasePromise(data) {
    return createPromiseWitData(data, PROMISE_DELAY_WHEN_TESTING);
}
