import {
    child,
    get as getRefValue,
    orderByChild,
    push,
    query,
    set,
    startAfter,
} from 'firebase/database';

import { auth } from '../controllers/auth';
import { database } from '../controllers/common';
import { getCurrentUnixTimestamp } from '../utilities/date';
import { log_to_console } from '../utilities/logging';

async function getObjectWithCache(
    firebasePath,
    keyInLocalStorage,
    timestampKey
) {
    const oldObject = JSON.parse(localStorage.getItem(keyInLocalStorage));
    var firebaseQuery = query(child(database, firebasePath));

    return await getRefValue(firebaseQuery).then(snapshot => {
        const newTimestamp = snapshot.child(timestampKey).val();

        if (oldObject && oldObject[timestampKey] === newTimestamp) {
            log_to_console(
                `Local storage object "${keyInLocalStorage}" is the same as the Firebase one.`
            );

            return oldObject;
        } else {
            const newObject = snapshot.val();
            localStorage.setItem(keyInLocalStorage, JSON.stringify(newObject));

            log_to_console(
                `Local storage object "${keyInLocalStorage}" has a newer version in Firebase:`
            );
            log_to_console(newObject);

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

        log_to_console(
            `Local storage objects on key "${keyInLocalStorage}" were found. The newest is from ${lastTimestamp}.`
        );

        firebaseQuery = query(
            firebaseQuery,
            orderByChild(timestampKey),
            startAfter(lastTimestamp)
        );
    } else {
        // eslint-disable-next-line
        oldObjects = new Array();

        log_to_console(
            `No objects were stored yet on local storage's key "${keyInLocalStorage}"`
        );
    }

    return await getRefValue(firebaseQuery).then(snapshot => {
        if (snapshot.exists()) {
            var newObjects = snapshot.val();
            oldObjects = { ...oldObjects, ...newObjects };
            localStorage.setItem(keyInLocalStorage, JSON.stringify(oldObjects));

            log_to_console(
                `New objects were found in Firebase for key "${keyInLocalStorage}"):`
            );
            log_to_console(newObjects);
        } else {
            log_to_console(
                `No new object was found in Firebase for key "${keyInLocalStorage}".`
            );
        }

        return oldObjects;
    });
}

export async function get() {
    const firebasePath = 'dash/' + auth.currentUser.uid + '/';

    return {
        settings: await getObjectWithCache(
            firebasePath + 'settings',
            'settings',
            'timestamp'
        ),
        agents: await getObjectsWithCache(
            firebasePath + 'agents',
            'agents',
            'timestamp'
        ),
        solutions: await getObjectsWithCache(
            firebasePath + 'solutions',
            'solutions',
            'timestamp'
        ),
        information_reports: await getObjectsWithCache(
            firebasePath + 'information_reports',
            'information_reports',
            'timestamp'
        ),
        tests_reports: await getObjectsWithCache(
            firebasePath + 'tests_reports',
            'tests_reports',
            'timestamp'
        ),
    };
}

async function setNowTimestampForTest(reportId, testId) {
    const firebasePath =
        'dash/' +
        auth.currentUser.uid +
        '/tests_reports/' +
        reportId +
        '/timestamp';
    var firebaseQuery = child(database, firebasePath);

    const currentTimestamp = getCurrentUnixTimestamp();
    set(firebaseQuery, currentTimestamp);

    log_to_console(
        `The test "${testId}" from report "${reportId}" received the actual timestamp, ${currentTimestamp}.`
    );
}

export async function setTestAsChecked(reportId, testId) {
    const firebasePath =
        'dash/' +
        auth.currentUser.uid +
        '/tests_reports/' +
        reportId +
        '/checked';
    var firebaseQuery = child(database, firebasePath);

    const newPostRef = push(firebaseQuery);
    set(newPostRef, testId);

    setNowTimestampForTest(reportId, testId);

    log_to_console(
        `The test "${testId}" from report "${reportId}" was marked as checked.`
    );
}
