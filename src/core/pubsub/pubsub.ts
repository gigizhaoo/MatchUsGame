export type Func = (payload?: {}) => void

export interface ISubscriber {
  [name: string]: Func[];
}

export default class PubSub {
  private subscribers: ISubscriber;
  constructor() {
    this.subscribers = {};
  }

  subscribe(type: string, fn: Func) {
    if (!Object.prototype.hasOwnProperty.call(this.subscribers, type)) {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(fn);
  }

  unscribe(type: string, fn: Func) {
    let listeners = this.subscribers[type];
    if (!listeners || !listeners.length) return;
    this.subscribers[type] = listeners.filter(v => v !== fn);
  }

  publish(type: string, payload: {}) {
    let listeners = this.subscribers[type];
    if (!listeners || !listeners.length) return;
    listeners.forEach(fn => fn(payload))
  }
}
