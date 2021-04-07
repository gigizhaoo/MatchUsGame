import Render, { Context } from  './render';
import { IRendererInfo } from '../core/game/game_single_player';
import { EObstacleType } from '../core/units/obstacle';
import { ILayouts } from './renderer';

export default class RenderPanel implements Render{
  constructor(public context: Context) {}

  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return; 
    const { cells } = info;
    const { x, y, w, h } = layouts.panel;
    // 背景色
    this.context.fillStyle = '#eee';
    this.context.fillRect(x, y, w, h);
    // 田字格
    const edge = w;
    const gap = edge / Math.sqrt(cells.length);
    for (let i = 0; i < cells.length; i++) {
      const { obstacle, coordinate } = cells[i];
      const { x: ox, y: oy } = coordinate.get();
      let fillColor = '#fff';
      switch(obstacle.type) {
        case EObstacleType.Null: fillColor = '#fff'; break;
        case EObstacleType.Stake: fillColor = '#242e3510'; break;
        case EObstacleType.Freeze: fillColor = '#cceff1'; break;
        default: fillColor = '#fff'; break;
      }
      this.context.fillStyle = fillColor;
      this.context.fillRect(x + ox * gap + 1, y + oy * gap + 1, gap - 1, gap - 1);
    }
    return gap;
  }
}
