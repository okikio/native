// import { fetch } from 'whatwg-fetch';
import fetch from 'cross-fetch';
let request = async (url) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        throw "Request Timed Out!";
    }, 100000);

    try {
        let response = await fetch(url.toString(), {
            method: "GET",
            cache: "default",
            credentials: "cors",
        });

        clearTimeout(timeout);
        if (response.status >= 200 && response.status < 300) {
            return await response.text();
        }

        const err = new Error(response.statusText || "" + response.status);
        throw err;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
};

try {
    await request("http://josephojo.com");
} catch (err) {
    console.log(err)
}