import { _decorator, Component, Enum, Node } from "cc";
import GameManager from "./GameManager";

const { ccclass, property } = _decorator;

export enum InteractKind {
  Pickup = 0,
  Clue = 1,
  Door = 2,
  PuzzleTrigger = 3,
}

@ccclass("InteractableItem")
export default class InteractableItem extends Component {
  @property({ type: Enum(InteractKind) })
  kind: InteractKind = InteractKind.Clue;

  @property
  itemId = "";

  @property
  displayName = "";

  @property
  clueId = "";

  @property
  clueText = "";

  @property
  requiredItemId = "";

  @property
  puzzleId = "";

  onLoad(): void {
    this.node.on(Node.EventType.TOUCH_END, this.onInteract, this);
  }

  onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.onInteract, this);
  }

  private onInteract(): void {
    const gm = GameManager.Instance;
    if (!gm) return;

    switch (this.kind) {
      case InteractKind.Pickup:
        gm.addItem(this.itemId, this.displayName || this.itemId);
        this.node.active = false;
        break;
      case InteractKind.Clue:
        gm.openClue(this.clueId || this.node.uuid, this.clueText);
        break;
      case InteractKind.Door:
        this.tryOpenDoor(gm);
        break;
      case InteractKind.PuzzleTrigger:
        gm.openPuzzle(this.puzzleId);
        break;
      default:
        gm.showMessage("似乎没有反应。");
    }
  }

  private tryOpenDoor(gm: GameManager): void {
    if (gm.isDoorUnlocked()) {
      gm.showMessage("门缓缓打开，你离真相更近了一步……");
      return;
    }

    if (this.requiredItemId && gm.hasItem(this.requiredItemId)) {
      gm.consumeItem(this.requiredItemId);
      gm.unlockDoor();
      gm.showMessage("你使用了关键道具，门锁松动了！");
      return;
    }

    gm.showMessage("门被某种力量封住了，也许需要特定道具。");
  }
}
