import Render, { Context } from  './render';
import CanvasListener from '../core/listener/canvas_listener';
import KeyboardListener from '../core/listener/keyboard_listener';
import { IRendererInfo } from '../core/game/game_single_player';
import { ILayouts } from './renderer';
import { EDirection, mapDirection2KeyCode } from '../core/units/direction';

export interface IListeners {
  [direction: string]: CanvasListener
}

export interface IHandlerKeys {
  [direction: string]: string[],
}

export default class RenderController implements Render{
  canvasListeners: IListeners = {};
  handlerKeys: IHandlerKeys = {};
  constructor(public context: Context) {}

  render(info: IRendererInfo, layouts: ILayouts) {
    if (!this.context) return; 
    const { x, y, w, h } = layouts.controller;
    const { controller } = info;
    const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12] = [
      {x: x + w / 3, y },
      {x: x + w * 2 / 3, y},
      {x: x + w * 2 / 3, y: y + h / 3},
      {x: x + w, y: y + h / 3},
      {x: x + w, y: y + h * 2 / 3},
      {x: x + w * 2 / 3, y: y + h * 2 / 3},
      {x: x + w * 2 / 3, y: y + h},
      {x: x + w / 3, y: y + h},
      {x: x + w / 3, y: y + h * 2 / 3},
      {x: x, y: y + h * 2 / 3},
      {x: x, y: y + h / 3},
      {x: x + w / 3, y:y + h / 3}
    ];

    this.context.strokeStyle = '#898';
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.lineTo(p4.x, p4.y);
    this.context.lineTo(p5.x, p5.y);
    this.context.lineTo(p6.x, p6.y);
    this.context.lineTo(p7.x, p7.y);
    this.context.lineTo(p8.x, p8.y);
    this.context.lineTo(p9.x, p9.y);
    this.context.lineTo(p10.x, p10.y);
    this.context.lineTo(p11.x, p11.y);
    this.context.lineTo(p12.x, p12.y);
    this.context.lineTo(p1.x, p1.y);
    this.context.closePath();
    this.context.stroke();

    this.context.fillStyle = '#898';
    this.context.fillRect(p1.x, p1.y, w / 3, h / 3);
    this.context.fillRect(p3.x, p3.y, w / 3, h / 3);
    this.context.fillRect(p9.x, p9.y, w / 3, h / 3);
    this.context.fillRect(p11.x, p11.y, w / 3, h / 3);

    this.context.font = '20px Georgia';
    this.context.fillStyle = '#fff';
    this.context.fillText('上', p12.x + 15, p12.y - 20);
    this.context.fillText('右', p6.x + 15, p6.y - 20);
    this.context.fillText('下', p8.x + 15, p8.y - 20);
    this.context.fillText('左', p10.x + 15, p10.y - 20);

    if (Object.keys(this.canvasListeners).length === 0 && !info.isSuccess) {
      this.canvasListeners[EDirection.Up] = new CanvasListener(this.context.canvas, p1.x, p1.y, p3.x, p3.y);
      this.canvasListeners[EDirection.Right] = new CanvasListener(this.context.canvas, p3.x, p3.y, p5.x, p5.y);
      this.canvasListeners[EDirection.Down] = new CanvasListener(this.context.canvas, p9.x, p9.y, p7.x, p7.y);
      this.canvasListeners[EDirection.Left] = new CanvasListener(this.context.canvas, p11.x, p11.y, p9.x, p9.y);
      
      Object.keys(this.canvasListeners).forEach(direction => {
        const handler = () => {
          controller.trigger(<EDirection>direction);
        }
        KeyboardListener.on(mapDirection2KeyCode[direction], handler);
        this.handlerKeys[direction] = (this.handlerKeys[direction] || []).concat(this.canvasListeners[direction].on('click', handler));
      });
    }
    if (info.isSuccess) {
      this.clear();
    }
  }

  clear() {
    Object.keys(this.handlerKeys).forEach(direction => {
      this.handlerKeys[direction].forEach(key => {
        this.canvasListeners[direction].remove('click', key);
        KeyboardListener.remove(key);
      });
      this.handlerKeys[direction] = [];
    });
  }
}
