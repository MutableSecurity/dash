import { plainToClass } from 'class-transformer';
import { child, get } from 'firebase/database';

import { IS_TESTING } from '../config';
import mock_data from '../data/offlineFirebase.json';
import { Settings } from '../models/account';
import { auth } from './auth';
import { createMockedFirebasePromise, database } from './common';

export function getUserSettingsProd() {
    const userID = auth.currentUser.uid;

    return get(child(database, 'UserData/' + userID + '/settings'))
        .then(snapshot => {
            if (snapshot.exists()) {
                var data = snapshot.val();
                var settings = plainToClass(Settings, data);

                return settings;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(error);

            return null;
        });
}

function getUserSettingsTest() {
    var data = plainToClass(
        Settings,
        mock_data.users.VLjFcXZ1aiddKubb1rBSHABCpvm1
    );

    return createMockedFirebasePromise(data);
}

export const getUserSettings = IS_TESTING
    ? getUserSettingsTest
    : getUserSettingsProd;
