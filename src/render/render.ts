import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';

export type Context = CanvasRenderingContext2D | null;

export default interface IRender {
  canvas?: HTMLCanvasElement;
  context: Context;
  render: (info: IRendererInfo, layouts: ILayouts) => any;
}
