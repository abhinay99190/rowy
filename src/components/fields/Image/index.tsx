import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "@src/components/fields/_withTableCell/withHeavyCell";

import { Image as ImageIcon } from "@src/assets/icons";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";
import ContextMenuActions from "./ContextMenuActions";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Image" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Image" */)
);

export const config: IFieldConfig = {
  type: FieldType.image,
  name: "Image",
  group: "File",
  dataType: "RowyFile[]",
  initialValue: [],
  icon: <ImageIcon />,
  description:
    "Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP, AVIF, JPEG XL.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  contextMenuActions: ContextMenuActions,
};
export default config;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/jxl",
];
