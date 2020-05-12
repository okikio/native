import { fetch } from 'whatwg-fetch';
let request = async (url) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        throw "Request Timed Out!";
    }, 100000);

    try {
        let response = await fetch(url.toString(), {
            method: "GET",
            cache: "default",
            credentials: "same-origin",
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
    await request("docs/index.html");
} catch (err) {
    console.log(err)
}