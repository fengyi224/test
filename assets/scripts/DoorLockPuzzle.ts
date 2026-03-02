import { _decorator, Event } from "cc";
import GameManager from "./GameManager";
import PuzzlePanel from "./PuzzlePanel";

const { ccclass, property } = _decorator;

@ccclass("DoorLockPuzzle")
export default class DoorLockPuzzle extends PuzzlePanel {
  @property
  answer = "0427";

  @property
  solvePuzzleId = "door_lock";

  private buffer = "";

  protected resetPanel(): void {
    this.buffer = "";
    if (this.inputLabel) this.inputLabel.string = "____";
    if (this.hintLabel) this.hintLabel.string = "输入4位数字密码";
  }

  onDigitClick(_event: Event, digit: string): void {
    if (this.buffer.length >= this.answer.length) return;
    this.buffer += digit;
    this.renderBuffer();
  }

  onClearClick(): void {
    this.buffer = "";
    this.renderBuffer();
  }

  onConfirmClick(): void {
    const gm = GameManager.Instance;
    if (!gm) return;

    if (this.buffer === this.answer) {
      gm.markPuzzleSolved(this.solvePuzzleId);
      gm.unlockDoor();
      gm.showMessage("锁芯回正，门锁已解除。");
      this.close();
      return;
    }

    if (this.hintLabel) this.hintLabel.string = "密码错误，似乎和墙上的祭文有关。";
    this.buffer = "";
    this.renderBuffer();
  }

  onCloseClick(): void {
    this.close();
  }

  private renderBuffer(): void {
    if (!this.inputLabel) return;
    this.inputLabel.string = this.buffer.padEnd(this.answer.length, "_");
  }
}
