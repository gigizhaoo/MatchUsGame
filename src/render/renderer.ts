import RenderPanel from './render_panel';
import RenderMover from './render_mover';
import RenderController from './render_controller';
import RenderTime from './render_time';
import RenderCount from './render_count';
import RenderSuccess from './render_success';
import { IRendererInfo } from '../core/game/game_single_player';

interface ILayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ILayouts {
  board: ILayout;
  panel: ILayout;
  time: ILayout;
  controller: ILayout;
  [name: string]: any;
}

export default class Renderer {
  private containerId: string;
  private container: HTMLElement | null;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private controller: RenderController | null = null;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Cannot find element by id ${this.containerId}.`);
    }
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.context = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.controller = new RenderController(this.context);
  }

  private calcLayout(): ILayouts | undefined {
    if (!this.canvas || !this.container || !this.context) return;
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    return this.context.canvas.width > this.context.canvas.height ? this.horizontalLayout() : this.verticalLayout();
  }

  // 横向布局
  horizontalLayout(): ILayouts {
    const panelEdge = this.canvas.height;
    const [boardW, boardH] = [((panelEdge / 2) * 3) | 0, panelEdge];
    const blankW = ((this.canvas.width - boardW) / 2) | 0;
    const board = { x: blankW, y: 0, w: boardW, h: boardH };
    const panel = { x: blankW,  y: 0, w: panelEdge, h: panelEdge };
    const time = { x: blankW + boardW, y: 0, w: blankW, h: boardH / 2 };
    const count = { x: blankW + boardW, y: 0, w: blankW, h: boardH / 2 };
    const controller = { x: blankW + boardH, y: boardH / 2, w: boardH / 2, h: boardH / 2 };
    return { board, panel, time, count, controller };
  }

  // 纵向布局
  verticalLayout(): ILayouts {
    const panelEdge = this.canvas.width;
    const [boardW, boardH] = [panelEdge, ((panelEdge / 2) * 3) | 0];
    const blankH = ((this.canvas.height - boardH) / 2) | 0;
    const board = { x: 0, y: blankH, w: boardW,  h: boardH };
    const panel = { x: 0, y: blankH, w: boardW, h: boardW };
    const time = { x: 0, y:  blankH * 2 + boardW, w: boardW / 2, h: blankH };
    const count = { x: 0, y:  blankH * 3 + boardW, w: boardW / 2, h: blankH };
    const controller = { x: boardW / 2, y: blankH + boardW, w: boardW / 2, h: boardW / 2 };
    return { board, panel, time, count, controller };
  }

  render(info: IRendererInfo) {
    if (!this.canvas || !this.container || !this.context) return;

    const layouts = this.calcLayout();
    if (!layouts) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 背景色
    this.context.fillStyle = '#ddd';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // 面板
    const board = layouts.board;
    this.context.fillStyle = '#eee';
    this.context.fillRect(board.x, board.y, board.w, board.h);
    // 单元格
    const cellSize = new RenderPanel(this.context).render(info, layouts);
    // 时间
    new RenderTime(this.context).render(info, layouts);
    // 步数
    new RenderCount(this.context).render(info, layouts);
    // 控制器
    this.controller?.render(info, layouts);
    // 移动元素
    const { movers, lockedMovers } = info;
    for (let i = 0; i < movers.length; i++) {
      new RenderMover(this.context).render(info, { ...layouts, cellSize, ...movers[i] });
    }
    for (let i = 0; i < lockedMovers.length; i++) {
      new RenderMover(this.context).render(info, { ...layouts, cellSize, ...lockedMovers[i] });
    }
    if (info.isSuccess) {
      new RenderSuccess(this.context).render(info, layouts);
    }
  }
}
