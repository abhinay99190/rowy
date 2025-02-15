import { Fragment } from "react";
import { useAtom, useSetAtom } from "jotai";
import { getFieldProp } from "@src/components/fields";
import { find } from "lodash-es";

import { Divider } from "@mui/material";
import {
  Copy as CopyIcon,
  CopyCells as DuplicateIcon,
  Clear as ClearIcon,
  Row as RowIcon,
} from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

import ContextMenuItem, { IContextMenuItem } from "./ContextMenuItem";

import {
  globalScope,
  projectIdAtom,
  userRolesAtom,
  altPressAtom,
  tableAddRowIdTypeAtom,
  confirmDialogAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableRowsAtom,
  selectedCellAtom,
  addRowAtom,
  deleteRowAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

interface IMenuContentsProps {
  onClose: () => void;
}

export default function MenuContents({ onClose }: IMenuContentsProps) {
  const [projectId] = useAtom(projectIdAtom, globalScope);
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [altPress] = useAtom(altPressAtom, globalScope);
  const [addRowIdType] = useAtom(tableAddRowIdTypeAtom, globalScope);
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  if (!tableSchema.columns || !selectedCell) return null;

  const selectedColumn = tableSchema.columns[selectedCell.columnKey];
  const menuActions = getFieldProp("contextMenuActions", selectedColumn.type);

  const actionGroups: IContextMenuItem[][] = [];
  const row = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  // Field type actions
  const fieldTypeActions = menuActions
    ? menuActions(selectedCell, onClose)
    : [];
  if (fieldTypeActions.length > 0) actionGroups.push(fieldTypeActions);

  if (selectedColumn.type === FieldType.derivative) {
    const renderedFieldMenuActions = getFieldProp(
      "contextMenuActions",
      selectedColumn.config?.renderFieldType
    );
    if (renderedFieldMenuActions) {
      actionGroups.push(renderedFieldMenuActions(selectedCell, onClose));
    }
  }

  // Cell actions
  // TODO: Add copy and paste here
  const handleClearValue = () =>
    updateField({
      path: selectedCell.path,
      fieldName: selectedColumn.fieldName,
      value: null,
      deleteField: true,
    });
  const cellActions = [
    {
      label: altPress ? "Clear value" : "Clear value…",
      color: "error",
      icon: <ClearIcon />,
      disabled:
        selectedColumn.editable === false ||
        !row ||
        row[selectedCell.columnKey] === undefined ||
        getFieldProp("group", selectedColumn.type) === "Auditing",
      onClick: altPress
        ? handleClearValue
        : () => {
            confirm({
              title: "Clear cell value?",
              body: "The cell’s value cannot be recovered after",
              confirm: "Delete",
              confirmColor: "error",
              handleConfirm: handleClearValue,
            });
            onClose();
          },
    },
  ];
  actionGroups.push(cellActions);

  // Row actions
  if (row) {
    const handleDelete = () => deleteRow(row._rowy_ref.path);
    const rowActions = [
      {
        label: "Row",
        icon: <RowIcon />,
        subItems: [
          {
            label: "Copy ID",
            icon: <CopyIcon />,
            onClick: () => {
              navigator.clipboard.writeText(row._rowy_ref.id);
              onClose();
            },
          },
          {
            label: "Copy path",
            icon: <CopyIcon />,
            onClick: () => {
              navigator.clipboard.writeText(row._rowy_ref.path);
              onClose();
            },
          },
          {
            label: "Open in Firebase Console",
            icon: <OpenIcon />,
            onClick: () => {
              window.open(
                `https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${row._rowy_ref.path.replace(
                  /\//g,
                  "~2F"
                )}`
              );
              onClose();
            },
          },
          { label: "Divider", divider: true },
          {
            label: "Duplicate",
            icon: <DuplicateIcon />,
            disabled:
              tableSettings.tableType === "collectionGroup" ||
              (!userRoles.includes("ADMIN") && tableSettings.readOnly),
            onClick: () => {
              addRow({
                row,
                setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
              });
              onClose();
            },
          },
          {
            label: altPress ? "Delete" : "Delete…",
            color: "error",
            icon: <DeleteIcon />,
            disabled: !userRoles.includes("ADMIN") && tableSettings.readOnly,
            onClick: altPress
              ? handleDelete
              : () => {
                  confirm({
                    title: "Delete row?",
                    body: (
                      <>
                        Row path:
                        <br />
                        <code
                          style={{ userSelect: "all", wordBreak: "break-all" }}
                        >
                          {row._rowy_ref.path}
                        </code>
                      </>
                    ),
                    confirm: "Delete",
                    confirmColor: "error",
                    handleConfirm: handleDelete,
                  });
                  onClose();
                },
          },
        ],
      },
    ];
    actionGroups.push(rowActions);
  }

  return (
    <>
      {actionGroups.map((items, groupIndex) => (
        <Fragment key={groupIndex}>
          {groupIndex > 0 && <Divider variant="middle" />}
          {items.map((item, index: number) => (
            <ContextMenuItem
              key={`contextMenu-${groupIndex}-${index}`}
              {...item}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
