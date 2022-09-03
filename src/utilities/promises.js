export function createPromiseWitData(data, delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(data);
        }, delay);
    });
}
