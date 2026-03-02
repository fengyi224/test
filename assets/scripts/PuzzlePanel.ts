import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PuzzlePanel")
export default class PuzzlePanel extends Component {
  @property(Label)
  inputLabel: Label | null = null;

  @property(Label)
  hintLabel: Label | null = null;

  protected currentPuzzleId = "";

  open(puzzleId: string): void {
    this.currentPuzzleId = puzzleId;
    this.node.active = true;
    this.resetPanel();
  }

  close(): void {
    this.node.active = false;
    this.currentPuzzleId = "";
  }

  protected resetPanel(): void {
    if (this.inputLabel) this.inputLabel.string = "";
    if (this.hintLabel) this.hintLabel.string = "请输入密码";
  }
}
