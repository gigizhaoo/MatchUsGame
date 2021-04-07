import Obstacle from './obstacle';
import Coordinate from './coordinate';

export default class Cell {
  obstacle: Obstacle;
  coordinate: Coordinate;

  constructor(obstacle: Obstacle, coordinate: Coordinate) {
    this.obstacle = obstacle;
    this.coordinate = coordinate;
  }
}