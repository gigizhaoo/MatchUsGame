import Game from './game';
import Renderer from '../../render/renderer';
import Box from '../units/box';
import Controller from '../units/controller';
import Coordinate, { ICoordinate } from '../units/coordinate';
import Panel, { IMapItem } from '../units/panel';
import { EObstacleType } from '../units/obstacle';
import EDirection from '../units/direction';
import Pedometer from '../units/pedometer';
import Timer from '../units/timer';

interface IBoxInfo {
  coordinate: ICoordinate,
  alias: string | undefined;
  locked: boolean;
}

export interface IRendererInfo {
  controller: Controller;
  map: IMapItem[];
  boxGroup: IBoxInfo[];
  lockedBoxGroup: IBoxInfo[];
  isSuccess: boolean;
  count: number;
  time: number;
}

export default class GameSinglePlayer extends Game {

  static NUM_OF_BOX: number = 3;
  static ALIAS_OF_BOX: string[] = ['red', 'blue', 'yellow'];
  private panel: Panel;
  private controller: Controller;
  private boxGroup: Box[];
  private lockedBoxGroup: Box[];
  private isSuccess: boolean = false;
  private pedometer: Pedometer;
  private timer: Timer;

  constructor(renderer: Renderer | null) {
    super(renderer);
    this.panel = new Panel();
    this.controller = new Controller();
    this.boxGroup = this.generateBoxGroup(GameSinglePlayer.NUM_OF_BOX, false);
    this.lockedBoxGroup = this.generateBoxGroup(GameSinglePlayer.NUM_OF_BOX, true);
    this.pedometer = new Pedometer();
    this.timer = new Timer(this.onTimeChange.bind(this));
    this.render();
    this.start();
  }

  private render() {
    if (!this.isCustomize && this.renderer) {
      this.renderer.render({
        controller: this.controller,
        isSuccess: this.isSuccess,
        map: this.panel.map,
        count: this.pedometer.get(),
        time: this.timer.displayByS(),
        boxGroup: this.boxGroup.map(item => ({
          coordinate: item.coordinate.get(),
          alias: item.alias,
          locked: item.locked,
        })),
        lockedBoxGroup: this.lockedBoxGroup.map(item => ({
          coordinate: item.coordinate.get(),
          alias: item.alias,
          locked: item.locked,
        })),
      });
    }
  }

  start(): any {
    this.timer.start();
    const self = this;
    this.controller.on(EDirection.Up, () => self.onMove(0, -1, this.onMoveFinish.bind(this)));
    this.controller.on(EDirection.Down, () => self.onMove(0, 1, this.onMoveFinish.bind(this)));
    this.controller.on(EDirection.Left, () => self.onMove(-1, 0, this.onMoveFinish.bind(this)));
    this.controller.on(EDirection.Right, () => self.onMove(1, 0, this.onMoveFinish.bind(this)));
    window.onresize = () => this.render();
  }

  stop() {
    this.timer.close();
  }

  private onTimeChange() {
    this.render();
  }

  private onMove(offsetX: number, offsetY: number, onFinish?: () => any) {
    let moved = false;
    for (let i = 0; i < this.boxGroup.length; i++) {
      const { x, y } = this.boxGroup[i].coordinate.get();
      const newCoordinate = { x: x + offsetX, y: y + offsetY };
      const obstacle = this.panel.findObstacle(newCoordinate.x, newCoordinate.y);
      if (obstacle && this.boxGroup[i].move(newCoordinate, obstacle)) {
        moved = true;
      }
    }
    if (moved) {
      this.pedometer.record();
    }
    this.render();
    if (onFinish) {
      onFinish();
    }
  }

  private onMoveFinish() {
    if (this.getResult(this.boxGroup, this.lockedBoxGroup)) {
      // 游戏结束
      this.isSuccess = true;
      console.log(`Congratulations!!! Your score is ${this.timer.displayByS()}S`);
      this.render();
      this.stop();
    }
  }

  private generateBoxGroup(num: number, locked: boolean) {
    const marks: { [name: string]: boolean } = {};
    let boxGroup = [];
    for (let i = 0; i < num; i++) {
      let x: number = -1, y: number = -1;
      while(!marks[`${x}-${y}`] || this.panel.findObstacle(x, y)?.type !== EObstacleType.Null) {
        const coordinate = Coordinate.random(0, 0, this.panel.size, this.panel.size);
        x = coordinate.x;
        y = coordinate.y;
        marks[`${x}-${y}`] = true;
      }
      boxGroup[i] = new Box(new Coordinate(x, y), GameSinglePlayer.ALIAS_OF_BOX[i]);
      locked && boxGroup[i].lock();
    }
    return boxGroup;
  }
}
