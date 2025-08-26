import type { IMaterial } from "./Imaterial";

export type TreeNode = {
  id: string | number;
  name: string;
  material?: IMaterial;
  children?: TreeNode[];
  type: "category" | "material";
};