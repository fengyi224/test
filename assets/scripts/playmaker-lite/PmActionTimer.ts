import { _decorator, Component } from "cc";
import PlaymakerLite, { IPmAction } from "./PlaymakerLite";

const { ccclass, property } = _decorator;

@ccclass("PmActionTimer")
export default class PmActionTimer extends Component implements IPmAction {
  @property
  duration = 1;

  @property
  doneEvent = "TIMEOUT";

  private elapsed = 0;
  private fired = false;

  onEnter(): void {
    this.elapsed = 0;
    this.fired = false;
  }

  onUpdate(fsm: PlaymakerLite, dt: number): void {
    if (this.fired) return;
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      this.fired = true;
      fsm.sendEvent(this.doneEvent);
    }
  }
}
