import { EDirection } from './direction';
import PubSub, { Func } from '../pubsub/pubsub';

export default class Controller {
  private pubsub: PubSub;
  constructor() {
    this.pubsub = new PubSub();
  }
  on(direction: EDirection, handler: Func) {
    this.pubsub.subscribe(direction, handler);
  }
  trigger(direction: EDirection) {
    this.pubsub.publish(direction, {});
  }
}
