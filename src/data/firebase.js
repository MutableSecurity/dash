import {
    child,
    get as getRefValue,
    orderByChild,
    query,
    startAfter,
} from 'firebase/database';

import { auth } from '../controllers/auth';
import { database } from '../controllers/common';

async function getObjectWithCache(
    firebasePath,
    keyInLocalStorage,
    timestampKey
) {
    const oldObject = JSON.parse(localStorage.getItem(keyInLocalStorage));
    var firebaseQuery = query(child(database, firebasePath));

    return await getRefValue(firebaseQuery).then(snapshot => {
        const newTimestamp = snapshot.child(timestampKey).val();

        if (oldObject[timestampKey] === newTimestamp) {
            return oldObject;
        } else {
            const newObject = snapshot.val();
            localStorage.setItem(keyInLocalStorage, JSON.stringify(newObject));

            return newObject;
        }
    });
}

async function getObjectsWithCache(
    firebasePath,
    keyInLocalStorage,
    timestampKey
) {
    var oldObjects = JSON.parse(localStorage.getItem(keyInLocalStorage));
    var firebaseQuery = child(database, firebasePath);

    if (oldObjects) {
        var lastTimestamp = -1;
        Object.keys(oldObjects).forEach(key => {
            if (oldObjects[key][timestampKey] > lastTimestamp)
                lastTimestamp = oldObjects[key][timestampKey];
        });

        firebaseQuery = query(
            firebaseQuery,
            orderByChild(timestampKey),
            startAfter(lastTimestamp)
        );
    } else {
        // eslint-disable-next-line
        oldObjects = new Array();
    }

    return await getRefValue(firebaseQuery).then(snapshot => {
        if (snapshot.exists()) {
            var newObjects = snapshot.val();
            oldObjects = { ...oldObjects, ...newObjects };
            localStorage.setItem(keyInLocalStorage, JSON.stringify(oldObjects));

            return oldObjects;
        } else {
            return oldObjects;
        }
    });
}

export async function get() {
    const firebasePath = 'dash/' + auth.currentUser.uid + '/';

    var result = {
        settings: await getObjectWithCache(
            firebasePath + 'settings',
            'settings',
            'timestamp'
        ),
    };

    const keys = [
        'agents',
        'solutions',
        'information_reports',
        'tests_reports',
    ];
    keys.forEach(key => async () => {
        result[key] = await getObjectsWithCache(
            firebasePath + key,
            key,
            'timestamp'
        );
    });

    return result;
}
