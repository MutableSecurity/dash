import { IS_PRODUCTION } from '../config';

export function log_to_console(data) {
    if (IS_PRODUCTION) return;

    console.log(data);
}
