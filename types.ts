
export interface AnalysisResult {
  summary: string;
  risks: string[];
  negotiations: string[];
}

export enum DemoState {
  IDLE = 'IDLE',
  MOVING_TO_TEXTAREA = 'MOVING_TO_TEXTAREA',
  TYPING = 'TYPING',
  MOVING_TO_BUTTON = 'MOVING_TO_BUTTON',
  ANALYZING = 'ANALYZING',
  DISPLAYING = 'DISPLAYING'
}
