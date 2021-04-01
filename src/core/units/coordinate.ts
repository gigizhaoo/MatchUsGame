export interface ICoordinate {
  x: number;
  y: number;
}

export default class Coordinate {
  constructor(private x: number, private y: number) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get(): ICoordinate {
    return { x: this.x, y: this.y };
  }

  static random(x0: number, y0: number, x1: number, y1: number): ICoordinate {
    if (x0 > x1 || y0 > y1) {
      throw new Error('x1 must be greater tnen x0 and y0 must be greater then y1 too!');
    }

    return { x: (Math.random() * (x1 - x0 - 1) + x0) | 0, y: (Math.random() * (y1 - y0 - 1) + y0) | 0 };
  }
}
