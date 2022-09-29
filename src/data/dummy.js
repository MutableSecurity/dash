import dummy_data from './offline/dummy.json';

export function get(reason) {
    var accountsId = Object.keys(dummy_data.dash)[0];

    return dummy_data.dash[accountsId];
}
