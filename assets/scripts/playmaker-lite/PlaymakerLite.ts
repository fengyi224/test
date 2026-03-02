import { _decorator, Component, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PmTransition")
export class PmTransition {
  @property
  event = "";

  @property
  toState = "";
}

@ccclass("PmState")
export class PmState {
  @property
  name = "NewState";

  @property([Component])
  actions: Component[] = [];

  @property([PmTransition])
  transitions: PmTransition[] = [];
}

export interface IPmAction {
  onEnter?(fsm: PlaymakerLite): void;
  onExit?(fsm: PlaymakerLite): void;
  onEvent?(fsm: PlaymakerLite, eventName: string): void;
  onUpdate?(fsm: PlaymakerLite, dt: number): void;
}

@ccclass("PlaymakerLite")
export default class PlaymakerLite extends Component {
  @property
  startState = "Idle";

  @property([PmState])
  states: PmState[] = [];

  @property(Node)
  owner: Node | null = null;

  private currentState: PmState | null = null;
  private stateMap = new Map<string, PmState>();
  private entered = false;

  onLoad(): void {
    this.owner = this.owner ?? this.node;
    this.buildStateMap();
  }

  start(): void {
    this.gotoState(this.startState);
  }

  update(dt: number): void {
    if (!this.currentState || !this.entered) return;
    for (const action of this.currentState.actions) {
      const pmAction = action as unknown as IPmAction;
      pmAction?.onUpdate?.(this, dt);
    }
  }

  sendEvent(eventName: string): void {
    if (!this.currentState) return;

    for (const action of this.currentState.actions) {
      const pmAction = action as unknown as IPmAction;
      pmAction?.onEvent?.(this, eventName);
    }

    const hit = this.currentState.transitions.find((t) => t.event === eventName);
    if (hit?.toState) {
      this.gotoState(hit.toState);
    }
  }

  gotoState(stateName: string): void {
    const next = this.stateMap.get(stateName);
    if (!next) {
      this.warn(`[PlaymakerLite] state not found: ${stateName}`);
      return;
    }

    if (this.currentState) {
      for (const action of this.currentState.actions) {
        const pmAction = action as unknown as IPmAction;
        pmAction?.onExit?.(this);
      }
    }

    this.currentState = next;
    this.entered = true;

    for (const action of this.currentState.actions) {
      const pmAction = action as unknown as IPmAction;
      pmAction?.onEnter?.(this);
    }

    this.warn(`[PlaymakerLite] Enter state: ${this.currentState.name}`);
  }

  getCurrentStateName(): string {
    return this.currentState?.name ?? "";
  }

  getOwner(): Node {
    return this.owner ?? this.node;
  }

  private buildStateMap(): void {
    this.stateMap.clear();
    for (const state of this.states) {
      if (!state?.name) continue;
      this.stateMap.set(state.name, state);
    }
  }

  private warn(text: string): void {
    // 保持输出统一，方便调试 FSM 流程
    console.log(text);
  }
}
