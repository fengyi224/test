import { _decorator, Component, Node } from "cc";
import PlaymakerLite, { IPmAction } from "./PlaymakerLite";

const { ccclass, property } = _decorator;

@ccclass("PmActionSetNodeActive")
export default class PmActionSetNodeActive extends Component implements IPmAction {
  @property(Node)
  target: Node | null = null;

  @property
  active = true;

  onEnter(fsm: PlaymakerLite): void {
    const node = this.target ?? fsm.getOwner();
    node.active = this.active;
  }
}
