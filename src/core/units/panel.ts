import Obstacle, { EObstacleType } from './obstacle';
import Coordinate, { ICoordinate } from './coordinate';
import Cell from './cell';
import UnionFind from '../utils/union_find';

export default class Panel {
  static INIT_SIZE: number = 30;
  size: number = Panel.INIT_SIZE;
  cells: Cell[] = [];
  uf: UnionFind;

  constructor(size?: number) {
    if (size) {
      this.size = size;
    }
  
    this.uf = new UnionFind(this.size * this.size);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells.push(new Cell(new Obstacle(Obstacle.randomType()), new Coordinate(i, j)));
        const [top, cur, left] = [
          (i - 1) * this.size + j,
          i * this.size + j,
          i * this.size + j - 1,
        ];
        const [ttop, tcur, tleft] = [
          this.cells[top]?.obstacle.type,
          this.cells[cur]?.obstacle.type,
          this.cells[left]?.obstacle.type,
        ];
        if (i > 0 && tcur === EObstacleType.Null && ttop === tcur) {
          this.uf.unite(top, cur);
        }
        if (j > 0 && tcur === EObstacleType.Null && tleft === tcur) {
          this.uf.unite(left, cur);
        }
      }
    }
  }

  public reachable(from: ICoordinate, to: ICoordinate): boolean {
    return this.uf.isConnected(from.x * this.size + from.y, to.x * this.size + to.y);
  }

  get(x: number, y: number): Cell | undefined {
    return this.cells.find(item => {
      const { x: ox, y: oy } = item.coordinate.get();
      return ox === x && oy === y;
    });
  }
}
