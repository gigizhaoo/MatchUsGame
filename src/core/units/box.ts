import Coordinate, { ICoordinate } from './coordinate';
import Obstacle, { EObstacleType } from './obstacle';

export interface IBox {
  readonly coordinate: Coordinate;
  alias?: string;
  locked: boolean;
}

export default class Box implements IBox {
  readonly coordinate: Coordinate;
  alias?: string;
  locked: boolean = false;

  constructor(coordinate: Coordinate, alias?: string) {
    this.coordinate = coordinate;
    this.alias = alias;
  }

  private isSameAlias(box: Box) {
    return this.alias && box.alias && this.alias === box.alias;
  }

  private isSameCoordinate(box: Box) {
    const { x, y } = this.coordinate.get();
    const { x: tx, y: ty } = box.coordinate.get();
    return x === tx && y === ty;
  }

  fit(box: Box) {
    return this.isSameCoordinate(box) && this.isSameAlias(box);
  }

  move(to: ICoordinate, obstacle: Obstacle) {
    if (this.locked || !obstacle) return false;
    if (obstacle.type === EObstacleType.Stake) return false;
    if (obstacle.type === EObstacleType.Freeze) {
      // this.lock(10000);
      return false;
    }
    this.coordinate.set(to.x, to.y);
    return true;
  }

  lock(waitToUnlockTime?: number) {
    this.locked = true;
    if (waitToUnlockTime === undefined) return;
    setTimeout(() => {
      this.unlock();
    }, waitToUnlockTime);
  }

  unlock() {
    this.locked = false;
  }
}
