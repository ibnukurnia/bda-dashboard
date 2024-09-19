// types.ts
export interface TreeNodeType {
    name: string;
    namespace?: string;
    anomalyCount?: number;
    children?: TreeNodeType[];
  }