import { _decorator, Component } from "cc";
import PlaymakerLite, { IPmAction } from "./PlaymakerLite";

const { ccclass, property } = _decorator;

@ccclass("PmActionWaitEvent")
export default class PmActionWaitEvent extends Component implements IPmAction {
  @property
  expectedEvent = "";

  @property
  sendEventOnMatch = "";

  onEvent(fsm: PlaymakerLite, eventName: string): void {
    if (!this.expectedEvent || eventName !== this.expectedEvent) return;
    if (this.sendEventOnMatch) fsm.sendEvent(this.sendEventOnMatch);
  }
}
