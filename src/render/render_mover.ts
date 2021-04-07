import Render, { Context } from  './render';
import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';

export default class RenderMover implements Render {
  constructor(public context: Context) {}

  static colorPalette: string[] = ['#d60380', '#2a5ac7', '#f3e100'];
  static colorId: number = 0;
  static colorMap: { [name: string]: string } = {};

  static getColor(alias: string) {
    if (!RenderMover.colorMap[alias]) {
      RenderMover.colorMap[alias] = RenderMover.colorPalette[RenderMover.colorId++];
    }
    return RenderMover.colorMap[alias];
  }
  
  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return; 
    const { panel: { x, y }, cellSize, coordinate, alias, locked } = layouts;
    
    this.context.fillStyle = RenderMover.getColor(alias);
    this.context.strokeStyle = RenderMover.getColor(alias);
    this.context.beginPath();
    this.context.arc(
      x + coordinate.x * cellSize + cellSize / 2,
      y + coordinate.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      2 * Math.PI,
    );
    if (locked) {
      this.context.stroke();
    } else {
      this.context.fill();
    }
  }
}

