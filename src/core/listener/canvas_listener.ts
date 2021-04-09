export default class CanvasListener {
  static listenerName: string = 'CanvasListener';
  static handlers: any[] = [];
  static handlerId: number = -1;
  constructor(private ele: HTMLCanvasElement, private x0: number, private y0: number, private x1: number, private y1: number) {} 
  
  private getHandlerKey(id) {
    return `_${CanvasListener.listenerName}_${id}_`;
  }

  getEventPosition(e: MouseEvent) {
    const rect = this.ele.getBoundingClientRect();
    var x = e.clientX - rect.left * (this.ele.width / rect.width);
    var y = e.clientY - rect.top * (this.ele.height / rect.height);
    return { x, y };
  }

  on(type: string, handler: EventListenerOrEventListenerObject): string {
    const selfHandler = (e: MouseEvent) => {
      const p = this.getEventPosition(e);
      if (p.x >= this.x0 && p.x <= this.x1 && p.y >= this.y0 && p.y <= this.y1) {
        if (typeof handler === 'function') {
          handler(e);
        }
      }
    }
    CanvasListener.handlers[this.getHandlerKey(++CanvasListener.handlerId)] = selfHandler;
    this.ele.addEventListener(type, CanvasListener.handlers[this.getHandlerKey(CanvasListener.handlerId)]);
    return this.getHandlerKey(CanvasListener.handlerId);
  }

  remove(type: string, handlerKey: string) {
    if (CanvasListener.handlers[handlerKey]) {
      console.log('clear');
      this.ele.removeEventListener(type, CanvasListener.handlers[handlerKey]);
    } 
  }
}
