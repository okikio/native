const parser = new DOMParser();
let cache = {};
cache[window.location.href] = document.getElementsByTagName('html')[0].innerHTML;

let push = url => {
    window.history.pushState({
        url: url || window.location.href
    }, null, url);
    window.scrollTo(0, 0);
};
push(window.location.href);

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

window.addEventListener('popstate', (event) => {
    let { state } = event;
    if (!state) return;
    // let lastHREF = state ? state.url : window.location.href;
    // console.log(lastHREF, event);
    // if (window.location.href == lastHREF) return false;
    
    load(state ? state.url : window.location.href);
});

a.forEach(anchor => {
    anchor.addEventListener('click', e => {
        let {
            href
        } = e.target;
        e.preventDefault();
        if (window.location.href != href) push(href);
        load(href);
    });
});