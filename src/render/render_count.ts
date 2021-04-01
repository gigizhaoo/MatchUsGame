import Render, { Context } from  './render';
import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';

export default class RenderCount implements Render {
  constructor(public context: Context) {}

  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return; 
    const { x, y, w, h } = layouts.count;
    this.context.font = '20px Georgia';
    this.context.fillStyle = '#000';
    this.context.fillText(`步数：${info.count}`, x + 20, y - 20, w);
  }
}
