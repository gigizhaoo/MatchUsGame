export default class Listener {
  static handlers: any[] = [];
  static handlerId: number = -1;
  constructor(private ele: HTMLCanvasElement, private x0: number, private y0: number, private x1: number, private y1: number) {} 
  
  getEventPosition(e: MouseEvent) {
    const rect = this.ele.getBoundingClientRect();
    var x = e.clientX - rect.left * (this.ele.width / rect.width);
    var y = e.clientY - rect.top * (this.ele.height / rect.height);
    return { x, y };
  }

  on(type: string, handler: EventListenerOrEventListenerObject): number {
    const selfHandler = (e: MouseEvent) => {
      const p = this.getEventPosition(e);
      if (p.x >= this.x0 && p.x <= this.x1 && p.y >= this.y0 && p.y <= this.y1) {
        if (typeof handler === 'function') {
          handler(e);
        }
      }
    }
    Listener.handlers[++Listener.handlerId] = selfHandler;
    this.ele.addEventListener(type, Listener.handlers[Listener.handlerId]);
    return Listener.handlerId;
  }

  remove(type: string, handlerId: number) {
    if (Listener.handlers[handlerId]) {
      console.log('clear');
      this.ele.removeEventListener(type, Listener.handlers[handlerId]);
    } 
  }
}
