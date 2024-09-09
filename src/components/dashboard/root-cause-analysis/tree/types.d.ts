// types.ts
export interface TreeNodeType {
    name: string;
    anomalyCount?: number;
    children?: TreeNodeType[];
  }