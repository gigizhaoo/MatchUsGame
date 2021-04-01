import Renderer from '../../render/renderer';
import Box from '../units/box';
import PubSub, { Func } from '../pubsub/pubsub';

export default abstract class Game {

  protected isCustomize: boolean = false;
  protected renderer: Renderer | null = null;
  protected pubsub: PubSub;

  constructor(renderer: Renderer | null) {
    if (!renderer) {
      this.isCustomize = true;
    } else {
      this.renderer = renderer;
    }
    this.pubsub = new PubSub();
  }

  abstract start(): any
  abstract stop(): any

  protected getResult(boxesA: Box[], boxesB: Box[]) {
    return boxesA.every((box, i) => box.fit(boxesB[i]));
  }

  public addListener(type: string, fn: Func) {
    this.pubsub.subscribe(type, fn);
  }

  public removeListener(type: string, fn: Func) {
    this.pubsub.unscribe(type, fn);
  }
}
