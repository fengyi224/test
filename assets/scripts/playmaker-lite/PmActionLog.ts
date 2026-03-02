import { _decorator, Component } from "cc";
import PlaymakerLite, { IPmAction } from "./PlaymakerLite";

const { ccclass, property } = _decorator;

@ccclass("PmActionLog")
export default class PmActionLog extends Component implements IPmAction {
  @property
  text = "";

  @property
  includeState = true;

  onEnter(fsm: PlaymakerLite): void {
    const prefix = this.includeState ? `[${fsm.getCurrentStateName()}] ` : "";
    console.log(`${prefix}${this.text}`);
  }
}
