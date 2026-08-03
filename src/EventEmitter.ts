type Listener = (...args: any[]) => void // just a function type

export class EventEmitter {
    private listeners = new Map<string, Listener[]>(); // all listeners to certain events

    // EventEmitter.on() get "event" name and binds to it a "listener"
    on(event: string, listener: Listener) {
        const list = this.listeners.get(event) ?? [];
        
        list.push(listener);
        
        this.listeners.set(event, list);
    }

    // deletes all listeners and event
    off(event: string) {
        if (!this.listeners.get(event)) return;
        this.listeners.delete(event);
    }

    // emits event listeners with arguments
    emit(event: string, ...args: any[]) {
        const list = this.listeners.get(event);
        
        if (!list) return;

        for (const listener of list)
            listener(...args);
    }
}
