import Renderer from '../../render/renderer';
import Mover from '../units/mover';
import PubSub, { Func } from '../pubsub/pubsub';

export enum EGameResult {
  Victory = 'victory',
  Reset = 'reset',
  Continue = 'continue',
}

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

  protected getResult(moversA: Mover[], moversB: Mover[]) {
    let sets = new Set(moversA.map(mover => {
      const {x, y} = mover.coordinate.get();
      return `${x},${y}`;
    }));
    if (sets.size < moversA.length) {
      return EGameResult.Reset;
    }
    sets = new Set(moversB.map(mover => {
      const {x, y} = mover.coordinate.get();
      return `${x},${y}`;
    }));
    if (sets.size < moversA.length) {
      return EGameResult.Reset;
    }
    if (moversA.every((mover, i) => mover.fit(moversB[i]))) {
      return EGameResult.Victory;
    } else {
      return EGameResult.Continue;
    }
  }

  public addListener(type: string, fn: Func) {
    this.pubsub.subscribe(type, fn);
  }

  public removeListener(type: string, fn: Func) {
    this.pubsub.unscribe(type, fn);
  }
}
