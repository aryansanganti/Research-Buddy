export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GraphNode {
  id: string;
  group: 'dataset' | 'preprocessing' | 'model' | 'training' | 'evaluation';
  label: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface MethodGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Variant {
  name: string;
  type: 'Hybrid Fusion' | 'Speed Demon' | 'Untested Territory' | 'Efficiency Mod';
  description: string;
  rationale: string;
  code_snippet?: string;
  expected_accuracy_impact: string; // e.g. "+2.5%"
  expected_compute_impact: string; // e.g. "-15% FLOPs"
}

export interface ReasoningItem {
  topic: string;
  explanation: string;
  is_assumption: boolean;
  confidence_score: number; // 0-100
}

export interface AnalysisResult {
  summary: {
    datasets: string[];
    preprocessing: string[];
    model_architecture: string[];
    training_procedure: string[];
    hyperparameters: Record<string, string | number>;
    evaluation: string[];
    missing_details: string[];
    overall_confidence: number;
  };
  graph: MethodGraphData;
  code: string;
  variants: Variant[];
  reasoning: ReasoningItem[];
}

export interface FileData {
  name: string;
  type: string;
  base64: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}