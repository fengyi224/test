# 纸嫁衣风格密室逃脱原型（Cocos Creator 3.8.8）

这是一个基于 **Cocos Creator 3.8.8 + TypeScript** 的密室逃脱原型，包含：

- 场景交互（点击可交互物）
- 道具栏（拾取 / 消耗）
- 线索弹窗
- 数字门锁谜题（输入密码开门）
- 基础状态管理（已拾取、已解谜、是否开门）
- 类似 PlayMaker 的轻量 FSM 组件（PlaymakerLite）

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
├─ WallNote (挂 InteractableItem，类型=Clue)
└─ FSMRoot (挂 PlaymakerLite + 若干 PmAction*)
```

## 三、脚本（3.x API）

- `GameManager.ts`：全局状态与交互分发。
- `InventoryManager.ts`：道具栏管理。
- `InteractableItem.ts`：统一可交互组件。
- `PuzzlePanel.ts`：谜题 UI 基类。
- `DoorLockPuzzle.ts`：4位数字锁。
- `playmaker-lite/*`：轻量状态机系统（仿 PlayMaker 工作流）。

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

## 五、PlaymakerLite（类似 Unity PlayMaker）

### 1) 核心概念

- `PlaymakerLite`: 状态机组件，维护状态切换。
- `PmState`: 状态定义，包含 `actions` 与 `transitions`。
- `PmTransition`: 事件到状态的映射（event -> toState）。
- `PmAction*`: 可复用动作组件，挂在同一个节点，通过状态机在 Enter/Update/Event 阶段驱动。
- `PmEventProxy`: 提供 `sendByButton`，可直接给按钮发 FSM 事件。

### 2) 当前内置动作

- `PmActionLog`: 进入状态时打印日志。
- `PmActionSetNodeActive`: 进入状态时设置节点显隐。
- `PmActionTimer`: 定时后发送事件（如 `TIMEOUT`）。
- `PmActionWaitEvent`: 监听某事件，匹配后再发送另一个事件。

### 3) 一个最小示例

状态：
- `Idle` -> 接收事件 `START` 转到 `Waiting`
- `Waiting` -> `PmActionTimer(duration=2, doneEvent="DONE")`，再由 transition `DONE -> Finished`
- `Finished` -> `PmActionLog("流程完成")`

按钮：
- 挂 `PmEventProxy`，点击时调用 `sendByButton`，`customEventData=START`。

## 六、建议下一步

- 做一个可视化编辑器（状态节点拖拽 + 连线）
- 增加变量系统（Int/Float/Bool/String）与条件判断 Action
- 增加 `GameManager` 事件桥接（剧情、过场、音频统一调度）
