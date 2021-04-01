export default class Pedometer {
  private count: number = 0;
  constructor() {}
  record() {
    this.count++;
  }

  get() {
    return this.count;
  }
}
