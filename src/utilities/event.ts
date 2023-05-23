export default class Event<T> {
    private callbacks: Array<(args: T) => void>;

    constructor() {
        this.callbacks = [];
    }

    addEventListener(...callback: Array<(args: T) => void>) {
        this.callbacks.push(...callback);
    }

    removeEventListener(callback: (args: T) => void) {
        this.callbacks = this.callbacks.filter((c) => c !== callback);
    }

    call(args: T) {
        this.callbacks.forEach((c) => c(args));
    }
}
