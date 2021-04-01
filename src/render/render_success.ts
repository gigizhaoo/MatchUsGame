import Render, { Context } from  './render';
import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';

export default class RenderTime implements Render{
  constructor(public context: Context) {}

  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return;
    const count = info.count;
    const { x, y, w, h } = layouts.board;
    this.context.fillStyle = '#00000080';
    this.context.fillRect(x, y, w, h);
    this.context.fillStyle = '#000';
    this.context.font = '24px Georgia';
    this.context.fillStyle = '#000';
    this.context.textAlign = 'center';
    this.context.fillText(`Congratulations!!!`, w / 2, h / 2 - 20, w);
    this.context.fillText(`Your score is`, w / 2, h / 2 + 20, w);
    this.context.font = '64px Georgia';
    this.context.fillStyle = '#f00';
    this.context.fillText(`${count}`, w / 2, h / 2 + 80, w);
  }
}
