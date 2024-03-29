export function convertUTCSecondsToFormattedDate(seconds) {
    var date = convertUTCSecondsToJSTimestamp(seconds);

    return (
        ('0' + date.getDate()).slice(-2) +
        '.' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' +
        date.getFullYear() +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2) +
        ':' +
        ('0' + date.getSeconds()).slice(-2)
    );
}

export function convertUTCSecondsToJSTimestamp(seconds) {
    return new Date(seconds * 1000);
}

export function getCurrentUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}
