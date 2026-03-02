import { _decorator, Component, Label } from "cc";
import InventoryManager from "./InventoryManager";
import PuzzlePanel from "./PuzzlePanel";

const { ccclass, property } = _decorator;

export type GameFlags = {
  doorUnlocked: boolean;
  puzzleSolved: Record<string, boolean>;
  clueRead: Record<string, boolean>;
};

@ccclass("GameManager")
export default class GameManager extends Component {
  public static Instance: GameManager | null = null;

  @property(InventoryManager)
  inventory: InventoryManager | null = null;

  @property(PuzzlePanel)
  puzzlePanel: PuzzlePanel | null = null;

  @property(Label)
  messageLabel: Label | null = null;

  private flags: GameFlags = {
    doorUnlocked: false,
    puzzleSolved: {},
    clueRead: {},
  };

  onLoad(): void {
    GameManager.Instance = this;
    this.showMessage("阴冷的屋子里，似乎藏着某种仪式的痕迹……");
  }

  showMessage(text: string): void {
    if (!this.messageLabel) return;
    this.messageLabel.string = text;
  }

  addItem(itemId: string, displayName: string): void {
    const ok = this.inventory?.addItem(itemId, displayName);
    this.showMessage(ok ? `获得道具：${displayName}` : "道具栏已满。");
  }

  consumeItem(itemId: string): boolean {
    return this.inventory?.consumeItem(itemId) ?? false;
  }

  hasItem(itemId: string): boolean {
    return this.inventory?.hasItem(itemId) ?? false;
  }

  openClue(clueId: string, clueText: string): void {
    this.flags.clueRead[clueId] = true;
    this.showMessage(`线索：${clueText}`);
  }

  openPuzzle(puzzleId: string): void {
    this.puzzlePanel?.open(puzzleId);
  }

  markPuzzleSolved(puzzleId: string): void {
    this.flags.puzzleSolved[puzzleId] = true;
    this.showMessage("机关传来一声轻响，似乎有什么被解开了。");
  }

  isPuzzleSolved(puzzleId: string): boolean {
    return !!this.flags.puzzleSolved[puzzleId];
  }

  unlockDoor(): void {
    this.flags.doorUnlocked = true;
  }

  isDoorUnlocked(): boolean {
    return this.flags.doorUnlocked;
  }
}
