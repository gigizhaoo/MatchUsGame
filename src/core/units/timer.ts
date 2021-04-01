type Func = () => any;

export default class Timer {
  
  static DELTA_TIME: number = 1000;  // 1s
  private timer: any;
  private pending: boolean = false;
  private time: number = 0;
  public onChange: Func = () => 0;

  constructor(onChange?: Func) {
    if (onChange) {
      this.onChange = onChange;
    }
  }

  start() {
    this.create();
  }
  pause() {
    this.pending = true;
  }
  continue() {
    this.pending = false;
    this.start();
  }
  close() {
    this.pending = false;
    this.clear();
    this.time = 0;
  }

  reset() {
    this.clear();
    this.time = 0;
    this.pending = false;
    this.start();
  }

  private create() {
    this.timer = setTimeout(() => {
      this.clear();
      if (this.pending) return;
      this.time++;
      this.onChange();
      this.create();
    }, Timer.DELTA_TIME);
  }

  private clear() {
    if (!this.timer) return;
    clearTimeout(this.timer);
  }

  // 以时分秒展示
  display() {
    const seconds = this.time;
    const h = (seconds / 3600) | 0;
    const m = ((seconds % 3600) / 60) | 0;
    const s = seconds % 60;
    return { h, s, m };
  }

  // 以毫秒展示
  dispalyByMS() {
    return this.time * 1000;
  }

  // 以秒展示
  displayByS() {
    return this.time;
  }
}
