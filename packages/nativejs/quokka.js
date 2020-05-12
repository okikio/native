import fetch from 'cross-fetch';
let request = async (url) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        throw "Request Timed Out!";
    }, 100000);

    try {
        let response = await fetch(url, {
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

let counter = 0;
const cache = new Map();
let toStr = url => `//${url.host}${url.pathname}`.replace(/#.*/, "");
let load = async (_url) => {
    let url = _url instanceof URL ? _url : new URL(_url);
    let urlStr = toStr(url);

    if (cache.has(urlStr)) {
        let page = cache.get(urlStr);
        return Promise.resolve(page)
    }

    try {
        let response = await request(urlStr);
        let page = { url, page: response.substring(0, 10) };
        cache.set(urlStr, page);
        ++counter;
        return page;
    } catch (err) {
        console.error(err);
    }
};

try {
    let url = new URL("http://josephojo.com");
    let response = await load(url);
    response
    let another = await load(new URL("https://app-web.netlify.com/about"));
    another
    let again = await load(new URL("https://app-web.netlify.com/about"));
    again
    counter
} catch (err) {
    console.log(err);
}

// const newURL = new URL("https://josephojo.com");
// const URLString = toStr(newURL);
// cache.set(URLString, { url: newURL, page: "document.documentElement.innerHTML" });
// try {
//     let response = await request("//josephojo.com");
//     response //=
// } catch (err) {
//     console.log(err);
// }