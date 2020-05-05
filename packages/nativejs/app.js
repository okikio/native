const parser = new DOMParser();
let cache = {};
let history = [];
cache[window.location.href] = document.getElementsByTagName('html')[0].innerHTML;

let push = url => {
    history.push(url);
    window.history.pushState(null, null, url);
    window.scrollTo(0, 0);
};
let a = document.querySelectorAll("a");

let dom;
let render = text => {
    dom = parser.parseFromString(text, 'text/html');
    let main = dom.querySelector("main");
    document.title = dom.title;
    document.querySelector("main").replaceWith(main);
};

let load = href => {
    if (!(href in cache))
        fetch(href)
        .then(response => response.text())
        .then(text => {
            cache[href] = text;
            render(cache[href]);
        });
    else render(cache[href]);
};

window.addEventListener('popstate', () => {
    let lastHREF = history[history.length - 1] || window.location.href;
    if (window.location.href == lastHREF || history.length < 2) return false;

    let url = history[history.length - 2];
    history.push(url);
    load(url);
});

a.forEach(anchor => {
    anchor.addEventListener('click', e => {
        let {
            href
        } = e.target;
        e.preventDefault();
        push(href);
        load(href);
    });
});