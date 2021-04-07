import Obstacle, { EObstacleType } from './obstacle';
import Coordinate from './coordinate';
import Cell from './cell';

export default class Panel {
  static INIT_SIZE: number = 30;
  size: number = Panel.INIT_SIZE;
  cells: Cell[] = [];

  constructor(size?: number) {
    if (size) {
      this.size = size;
    }
    this.init();
  }

  private init() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells.push(new Cell(
          new Obstacle(Obstacle.randomType()),
          new Coordinate(i, j),
        ));
      }
    }
  }

  public reachable(from: number, to: number): boolean {
    return true;
  }

  get(x: number, y: number): Cell | undefined {
    return this.cells.find(item => {
      const { x: ox, y: oy } = item.coordinate.get();
      return ox === x && oy === y;
    });
  }
}
