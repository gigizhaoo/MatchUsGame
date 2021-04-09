import Game, { EGameResult } from './game';
import Renderer from '../../render/renderer';
import Mover from '../units/mover';
import Controller from '../units/controller';
import Coordinate, { ICoordinate } from '../units/coordinate';
import Panel from '../units/panel';
import Cell from '../units/cell';
import { EObstacleType } from '../units/obstacle';
import { EDirection } from '../units/direction';
import Pedometer from '../units/pedometer';
import Timer from '../units/timer';

interface IMoverInfo {
  coordinate: ICoordinate,
  alias: string | undefined;
  locked: boolean;
}

export interface IRendererInfo {
  controller: Controller;
  cells: Cell[];
  movers: IMoverInfo[];
  lockedMovers: IMoverInfo[];
  isSuccess: boolean;
  count: number;
  time: number;
}

export default class GameSinglePlayer extends Game {

  static NUM_OF_MOVER: number = 3;
  static ALIAS_OF_MOVER: string[] = ['red', 'blue', 'yellow'];
  private panel: Panel;
  private controller: Controller;
  private movers: Mover[] = [];
  private lockedMovers: Mover[] = [];
  private isSuccess: boolean = false;
  private pedometer: Pedometer;
  private timer: Timer;

  constructor(renderer: Renderer | null) {
    super(renderer);
    this.panel = new Panel();
    this.controller = new Controller();
    this.pedometer = new Pedometer();
    this.timer = new Timer(this.onTimeChange.bind(this));
    this.generateMovers();
    this.render();
    this.start();
  }

  private render() {
    if (!this.isCustomize && this.renderer) {
      this.renderer.render({
        controller: this.controller,
        isSuccess: this.isSuccess,
        cells: this.panel.cells,
        count: this.pedometer.get(),
        time: this.timer.displayByS(),
        movers: this.movers.map(item => ({
          coordinate: item.coordinate.get(),
          alias: item.alias,
          locked: item.locked,
        })),
        lockedMovers: this.lockedMovers.map(item => ({
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
    this.controller.on(EDirection.Up, () => self.onMove(0, -1, this.onMoveEnd.bind(this)));
    this.controller.on(EDirection.Down, () => self.onMove(0, 1, this.onMoveEnd.bind(this)));
    this.controller.on(EDirection.Left, () => self.onMove(-1, 0, this.onMoveEnd.bind(this)));
    this.controller.on(EDirection.Right, () => self.onMove(1, 0, this.onMoveEnd.bind(this)));
    window.onresize = () => this.render();
  }

  stop() {
    this.timer.close();
  }

  private onTimeChange() {
    this.render();
  }

  private onMove(offsetX: number, offsetY: number, onEnd?: () => any) {
    let moved = false;
    for (let i = 0; i < this.movers.length; i++) {
      const { x, y } = this.movers[i].coordinate.get();
      const newCoordinate = { x: x + offsetX, y: y + offsetY };
      const obstacle = this.panel.get(newCoordinate.x, newCoordinate.y)?.obstacle;
      if (obstacle && this.movers[i].move(newCoordinate, obstacle)) {
        moved = true;
      }
    }
    if (moved) {
      this.pedometer.record();
    }
    this.render();
    if (onEnd) {
      onEnd();
    }
  }

  private onMoveEnd() {
    switch(this.getResult(this.movers, this.lockedMovers)) {
      case EGameResult.Victory: this.onGameOver(); break;
      case EGameResult.Reset: this.onGameReset(); break;
      case EGameResult.Continue: break;
      default: break;
    }
  }

  private onGameReset() {
    console.log('移动物体重置');
    this.movers.forEach((m, i) => {
      this.movers[i].reset();
    })
  }

  private onGameOver() {
    console.log(`Congratulations!!! Your score is ${this.pedometer.get()}`);
    this.isSuccess = true;
    this.render();
    this.stop();
  }

  private initPairedMovers(alias: string) {
    const cells = this.panel.cells.filter(cell => cell.obstacle.type === EObstacleType.Null);
    const clen = cells.length;

    let mover: Mover, lockedMover: Mover;
    let [i1, i2] = [-1, -1];
    let [x, y] = [cells[i1]?.coordinate.get(), cells[i2]?.coordinate.get()];

    while(i1 === i2 || !this.panel.reachable(x, y)) {
      [i1, i2] = [Math.random() * clen | 0, Math.random() * clen | 0];
      [x, y] = [cells[i1]?.coordinate.get(), cells[i2]?.coordinate.get()];
    }
    
    if (cells[i1]) {
      mover = new Mover(cells[i1].coordinate.copy(), alias);
    }
    if (cells[i2]) {
      lockedMover = new Mover(cells[i2].coordinate.copy(), alias);
      lockedMover.lock();
    }
    return [mover, lockedMover];
  }

  private generateMovers() {
    let sets = new Set();
    for (let i = 0; i < GameSinglePlayer.NUM_OF_MOVER; i++) {
      let [mover, lockedMover] = [undefined, undefined];
      let [c1, c2] = [undefined, undefined];

      while(!c1 || !c2 || sets.has(c1) || sets.has(c2)) {
        [mover, lockedMover] = this.initPairedMovers(GameSinglePlayer.ALIAS_OF_MOVER[i]);
        [c1, c2] = [mover.coordinate.get(), lockedMover.coordinate.get()];
      }

      this.movers[i] = mover;
      this.lockedMovers[i] = lockedMover;

      sets.add(c1);
      sets.add(c2);
    }
  }
}
