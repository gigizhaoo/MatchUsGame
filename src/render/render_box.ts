import Render, { Context } from  './render';
import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';

export default class RenderBox implements Render {
  constructor(public context: Context) {}

  static colorPalette: string[] = ['#d60380', '#2a5ac7', '#f3e100'];
  static colorId: number = 0;
  static colorMap: { [name: string]: string } = {};

  static getColor(alias: string) {
    if (!RenderBox.colorMap[alias]) {
      RenderBox.colorMap[alias] = RenderBox.colorPalette[RenderBox.colorId++];
    }
    return RenderBox.colorMap[alias];
  }
  
  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return; 
    const { panel: { x, y }, boxSize, coordinate, alias, locked } = layouts;
    
    this.context.fillStyle = RenderBox.getColor(alias);
    this.context.strokeStyle = RenderBox.getColor(alias);
    this.context.beginPath();
    this.context.arc(
      x + coordinate.x * boxSize + boxSize / 2,
      y + coordinate.y * boxSize + boxSize / 2,
      boxSize / 3,
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

