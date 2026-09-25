export type MatchState = 'title' | 'css' | 'sss' | 'brawl' | 'podium';

export type StateChangeCallback = (newState: MatchState, oldState: MatchState) => void;

export class MatchStateMachine {
  private currentState: MatchState = 'title';
  private listeners: StateChangeCallback[] = [];

  constructor(initialState: MatchState = 'title') {
    this.currentState = initialState;
  }

  public get state(): MatchState {
    return this.currentState;
  }

  public onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public transitionTo(nextState: MatchState): void {
    if (this.currentState === nextState) return;

    const oldState = this.currentState;
    this.currentState = nextState;

    for (const listener of this.listeners) {
      try {
        listener(nextState, oldState);
      } catch (err) {
        console.error('Error in MatchStateMachine listener:', err);
      }
    }
  }
}
