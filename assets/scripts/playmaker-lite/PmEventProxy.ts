import { _decorator, Component, Event } from "cc";
import PlaymakerLite from "./PlaymakerLite";

const { ccclass, property } = _decorator;

@ccclass("PmEventProxy")
export default class PmEventProxy extends Component {
  @property(PlaymakerLite)
  fsm: PlaymakerLite | null = null;

  send(eventName: string): void {
    this.fsm?.sendEvent(eventName);
  }

  // 方便直接在 Button ClickEvent 中绑定
  sendByButton(_event: Event, customEventData: string): void {
    if (!customEventData) return;
    this.send(customEventData);
  }
}
