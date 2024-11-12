import { NLP, Tooltip } from "@/modules/models/root-cause-analysis";

export interface TreeNodeType {
    name: string;
    cluster?: string;
    namespace?: string;
    fungsi?: string;
    anomalyCount?: number;
    children_fieldname?: string;
    children?: TreeNodeType[];
    tooltips?: Tooltip[]
    nlps?: NLP[];
    detail_params: Param[];
  }