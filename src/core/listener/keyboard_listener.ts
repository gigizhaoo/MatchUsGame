class KeyboardListener {
  static listenerName: string = 'KeyboardListener';
  static instance: KeyboardListener;
  handlers: any[] = [];
  handlerId: number = -1;
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new KeyboardListener();
    }
    return this.instance;
  }

  private getHandlerKey(id) {
    return `_${KeyboardListener.listenerName}_${id}_`;
  }

  on(keyCode: number, handler: EventListenerOrEventListenerObject): string {
    const selfHandler = (e: KeyboardEvent) => {
      if (e.keyCode === keyCode) {
        if (typeof handler === 'function') {
          handler(e);
        }
      }
    }
    this.handlers[this.getHandlerKey(++this.handlerId)] = selfHandler;
    document.addEventListener('keydown', this.handlers[this.getHandlerKey(this.handlerId)]);
    return this.getHandlerKey(this.handlerId);
  }

  remove(handlerKey: string) {
    if (this.handlers[handlerKey]) {
      document.removeEventListener('keydown', this.handlers[handlerKey]);
    }
  }
}

const Listener = KeyboardListener.getInstance();
export default Listener;
