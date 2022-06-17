import { useAtom, useSetAtom } from "jotai";
import type { FormatterProps } from "react-data-grid";

import { Stack, Tooltip, IconButton, alpha } from "@mui/material";
import { CopyCells as CopyCellsIcon } from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  globalScope,
  userRolesAtom,
  tableAddRowIdTypeAtom,
  altPressAtom,
  confirmDialogAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  addRowAtom,
  deleteRowAtom,
} from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";

export default function FinalColumn({ row }: FormatterProps<TableRow, any>) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [addRowIdType] = useAtom(tableAddRowIdTypeAtom, globalScope);
  const confirm = useSetAtom(confirmDialogAtom, globalScope);

  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);

  const [altPress] = useAtom(altPressAtom, globalScope);
  const handleDelete = () => deleteRow(row._rowy_ref.path);

  if (!userRoles.includes("ADMIN") && tableSettings.readOnly === true)
    return null;

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Duplicate row">
        <IconButton
          size="small"
          color="inherit"
          disabled={tableSettings.tableType === "collectionGroup"}
          onClick={() =>
            addRow({
              row,
              setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
            })
          }
          aria-label="Duplicate row"
          className="row-hover-iconButton"
        >
          <CopyCellsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={`Delete row${altPress ? "" : "…"}`}>
        <IconButton
          size="small"
          color="inherit"
          onClick={
            altPress
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
                }
          }
          aria-label={`Delete row${altPress ? "" : "…"}`}
          className="row-hover-iconButton"
          sx={{
            ".rdg-row:hover .row-hover-iconButton&&": {
              color: "error.main",
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.error.main,
                  theme.palette.action.hoverOpacity * 2
                ),
            },
          }}
          disabled={!row._rowy_ref.path}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
