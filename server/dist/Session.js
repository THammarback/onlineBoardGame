class Session {
    static instances = {};
    sockets = {};
    names = {};
    assets = [];
    messages = [];
    key;
    constructor(key, name, socket) {
        this.key = key;
        this.addUser(name, socket);
    }
    addUser = (name, socket) => {
        if (socket.id in this.sockets && this.names[socket.id] == name) {
            return true;
        }
        if (socket.id in this.sockets) {
            throw Error("You are already connected to this session with key: " + this.key + ".");
        }
        if (name in Object.values(this.names)) {
            throw Error("There are already someone named: " + name + " in this session with key: " + this.key + ".");
        }
        socket.join(this.key);
        this.sockets[socket.id] = socket;
        this.names[socket.id] = name;
    };
    removeUser = (socket) => {
        if (!(socket.id in this.sockets)) {
            throw Error("User not in session with key: " + this.key + ".");
        }
        delete this.sockets[socket.id];
        delete this.names[socket.id];
        if (!Object.keys(this.sockets).length) {
            Session.delete(this.key);
        }
    };
    static create = (key, name, socket) => {
        if (key in Session.instances) {
            throw Error("Session with key: " + key + " already exists.");
        }
        Session.instances[key] = new Session(key, name, socket);
        return Session.instances[key];
    };
    static delete = (key) => {
        if (!(key in Session.instances)) {
            throw Error("No session with key: " + key + " exists.");
        }
        const session = Session.instances[key];
        delete Session.instances[key];
        return session;
    };
    static join = (key, name, socket) => {
        if (!(key in Session.instances)) {
            throw Error("No session with key: " + key + " exists.");
        }
        Session.instances[key].addUser(name, socket);
        return Session.instances[key];
    };
}
export default Session;
