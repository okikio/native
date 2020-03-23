/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 */
export class Manager {
    constructor () {
        this.list = new Map();
    }
}

/**
 * Controls lists that follow a chronological order, meant for the History class. Storage use Sets to store data.
 *
 * @export
 * @class Storage
 */
class Storage {
    constructor () {

    }
}

class State {
    constructor ({ url = null, transition = null, data: {} }) {
        this.state = { url, transition, data };
    }

    toJSON () {
        return this.state;
    }
}