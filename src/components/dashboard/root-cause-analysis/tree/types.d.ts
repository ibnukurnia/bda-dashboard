// types.ts
export interface TreeNodeType {
    type: string;
    childrenType?: string;
    name: string;
    percentage: number;
    anomalyCount: number;
    children?: TreeNodeType[];
  
  }