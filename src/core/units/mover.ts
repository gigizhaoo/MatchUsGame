import Coordinate, { ICoordinate } from './coordinate';
import Obstacle, { EObstacleType } from './obstacle';

export interface IMover {
  readonly coordinate: Coordinate;
  alias?: string;
  locked: boolean;
}

export default class Mover implements IMover {
  readonly coordinate: Coordinate;
  private readonly initialCoordinate: ICoordinate;
  alias?: string;
  locked: boolean = false;

  constructor(coordinate: Coordinate, alias?: string) {
    this.coordinate = coordinate;
    this.initialCoordinate = coordinate.get();
    this.alias = alias;
  }

  private isSameAlias(mover: Mover) {
    return this.alias && mover.alias && this.alias === mover.alias;
  }

  private isSameCoordinate(mover: Mover) {
    const { x, y } = this.coordinate.get();
    const { x: tx, y: ty } = mover.coordinate.get();
    return x === tx && y === ty;
  }

  reset() {
    this.coordinate.set(this.initialCoordinate.x, this.initialCoordinate.y);
  }

  fit(mover: Mover) {
    return this.isSameCoordinate(mover) && this.isSameAlias(mover);
  }

  move(to: ICoordinate, obstacle?: Obstacle) {
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
