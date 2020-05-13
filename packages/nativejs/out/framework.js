import { App } from "./api.js";
const app = new App();
(async () => {
    let page = await app.loadPage("./other.html");
    console.log(page);
    try {
        page = await app.loadPage("./othr.html");
        console.log(page);
    }
    catch (err) {
        console.warn("Opps");
    }
})();
//# sourceMappingURL=framework.js.map