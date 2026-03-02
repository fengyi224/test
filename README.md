# 纸嫁衣风格密室逃脱原型（Cocos Creator 3.8.8）

这是一个基于 **Cocos Creator 3.8.8 + TypeScript** 的密室逃脱原型，包含：

- 场景交互（点击可交互物）
- 道具栏（拾取 / 消耗）
- 线索弹窗
- 数字门锁谜题（输入密码开门）
- 基础状态管理（已拾取、已解谜、是否开门）

## 一、在 Cocos Creator 3.8.8 中使用

1. 新建 2D 项目（TypeScript）。
2. 把 `assets/scripts` 下脚本复制到你的项目同名目录。
3. 等待脚本编译后，在 Inspector 中按下面字段绑定组件。

## 二、推荐场景层级

```text
Canvas
├─ GameManager (挂 GameManager)
├─ InventoryBar (挂 InventoryManager)
│  └─ Slots...（若干按钮/节点）
├─ PuzzlePanel (挂 DoorLockPuzzle，默认隐藏)
│  ├─ InputLabel (Label)
│  ├─ HintLabel (Label)
│  └─ NumButtons (0-9、清空、确认)
├─ Door (挂 InteractableItem，类型=Door)
├─ LockBox (挂 InteractableItem，类型=PuzzleTrigger)
├─ RedCloth (挂 InteractableItem，类型=Pickup)
└─ WallNote (挂 InteractableItem，类型=Clue)
```

## 三、脚本（3.x API）

- `GameManager.ts`：全局状态与交互分发。
- `InventoryManager.ts`：道具栏管理。
- `InteractableItem.ts`：统一可交互组件。
- `PuzzlePanel.ts`：谜题 UI 基类。
- `DoorLockPuzzle.ts`：4位数字锁。

> 当前脚本已改为 Creator 3.x 写法（`import { _decorator, Component, Label, Node... } from 'cc'`）。

## 四、最小绑定步骤

1. **GameManager 节点**
   - 绑定 `inventory` -> `InventoryBar` 上的 `InventoryManager`
   - 绑定 `puzzlePanel` -> `PuzzlePanel` 上的 `DoorLockPuzzle`
   - 绑定 `messageLabel` -> 场景提示 `Label`

2. **InventoryBar 节点**
   - 在 `slotLabels` 里绑定若干 `Label`（建议 4~8 格）

3. **DoorLockPuzzle 节点**
   - `answer` 可改为任意 4 位密码
   - 数字按钮通过 `Button -> click events` 绑定 `onDigitClick(event, customEventData)`
   - 清空按钮绑定 `onClearClick`
   - 确认按钮绑定 `onConfirmClick`
   - 关闭按钮绑定 `onCloseClick`

4. **可交互节点**
   - `Door`: `kind=Door`，`requiredItemId=red_cloth`
   - `LockBox`: `kind=PuzzleTrigger`，`puzzleId=door_lock`
   - `RedCloth`: `kind=Pickup`，`itemId=red_cloth`，`displayName=红布`
   - `WallNote`: `kind=Clue`，`clueText=“丧钟四响，红烛照门（0427）”`

## 五、建议下一步

- 增加章节状态机（多房间切换、事件锁）
- 增加存档（localStorage / 文件）
- 增加演出（Tween、音效分轨、过场动画）
