import { NLP } from "@/modules/models/root-cause-analysis";

// types.ts
type Tooltip = {
  status_code: string;
  total: number;
}
export interface TreeNodeType {
    name: string;
    cluster?: string;
    namespace?: string;
    fungsi?: string;
    anomalyCount?: number;
    children?: TreeNodeType[];
    tooltips?: Tooltip[]
    nlps?: NLP[];
  }