import Obstacle from './obstacle';
import Coordinate from './coordinate';

export interface IMapItem {
  obstacle: Obstacle,
  coordinate: Coordinate,
}

export default class Panel {
  static INIT_SIZE: number = 30;
  size: number = Panel.INIT_SIZE;
  map: IMapItem[] = [];
  constructor(size?: number) {
    if (size) {
      this.size = size;
    }
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.map.push({
          obstacle: new Obstacle(Obstacle.randomType()),
          coordinate: new Coordinate(i, j),
        });
      }
    }
  }

  findObstacle(x: number, y: number): Obstacle | undefined {
    const target =  this.map.find(item => {
      const { x: ox, y: oy } = item.coordinate.get();
      return ox === x && oy === y;
    });
    return target && target.obstacle;
  }
}
