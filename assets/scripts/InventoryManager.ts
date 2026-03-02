import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;

type ItemData = {
  id: string;
  name: string;
};

@ccclass("InventoryManager")
export default class InventoryManager extends Component {
  @property([Label])
  slotLabels: Label[] = [];

  private items: ItemData[] = [];
  private selectedItemId = "";

  addItem(id: string, name: string): boolean {
    if (this.items.find((it) => it.id === id)) return true;
    if (this.items.length >= this.slotLabels.length) return false;

    this.items.push({ id, name });
    this.refreshSlots();
    return true;
  }

  hasItem(id: string): boolean {
    return this.items.some((it) => it.id === id);
  }

  consumeItem(id: string): boolean {
    const index = this.items.findIndex((it) => it.id === id);
    if (index < 0) return false;

    this.items.splice(index, 1);
    if (this.selectedItemId === id) this.selectedItemId = "";
    this.refreshSlots();
    return true;
  }

  selectItemBySlot(slotIndex: number): void {
    if (slotIndex < 0 || slotIndex >= this.items.length) return;
    this.selectedItemId = this.items[slotIndex].id;
    this.refreshSlots();
  }

  getSelectedItemId(): string {
    return this.selectedItemId;
  }

  private refreshSlots(): void {
    for (let i = 0; i < this.slotLabels.length; i += 1) {
      const label = this.slotLabels[i];
      const item = this.items[i];
      if (!label) continue;

      if (!item) {
        label.string = "[空]";
      } else if (item.id === this.selectedItemId) {
        label.string = `> ${item.name}`;
      } else {
        label.string = item.name;
      }
    }
  }
}
