import { useAtom } from "jotai";
import { colord } from "colord";

import { Tooltip, IconButton } from "@mui/material";
import SortDescIcon from "@mui/icons-material/ArrowDownward";
import IconSlash, {
  ICON_SLASH_STROKE_DASHOFFSET,
} from "@src/components/IconSlash";

import { tableScope, tableSortsAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

import { ColumnConfig } from "@src/types/table";

const SORT_STATES = ["none", "desc", "asc"] as const;

export interface IColumnHeaderSortProps {
  column: ColumnConfig;
}

export default function ColumnHeaderSort({ column }: IColumnHeaderSortProps) {
  const [tableSorts, setTableSorts] = useAtom(tableSortsAtom, tableScope);

  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;

  const currentSort: typeof SORT_STATES[number] =
    tableSorts[0]?.key !== sortKey
      ? "none"
      : tableSorts[0]?.direction || "none";
  const nextSort =
    SORT_STATES[SORT_STATES.indexOf(currentSort) + 1] ?? SORT_STATES[0];

  const handleSortClick = () => {
    if (nextSort === "none") setTableSorts([]);
    else setTableSorts([{ key: sortKey, direction: nextSort }]);
  };

  if (column.type === FieldType.id) return null;

  return (
    <Tooltip
      title={nextSort === "none" ? "Unsort" : `Sort by ${nextSort}ending`}
    >
      <IconButton
        disableFocusRipple={true}
        size="small"
        onClick={handleSortClick}
        color="inherit"
        sx={{
          bgcolor: "background.default",
          "&:hover": {
            backgroundColor: (theme) =>
              colord(theme.palette.background.default)
                .mix(
                  theme.palette.action.hover,
                  theme.palette.action.hoverOpacity
                )
                .alpha(1)
                .toHslString(),

            "& .icon-slash-mask": {
              stroke: (theme) =>
                colord(theme.palette.background.default)
                  .mix(
                    theme.palette.action.hover,
                    theme.palette.action.hoverOpacity
                  )
                  .alpha(1)
                  .toHslString(),
            },
          },

          position: "relative",
          opacity: currentSort !== "none" ? 1 : 0,
          ".column-header:hover &": { opacity: 1 },

          transition: (theme) =>
            theme.transitions.create(["background-color", "opacity"], {
              duration: theme.transitions.duration.short,
            }),

          "& .arrow": {
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.short,
              }),

            transform: currentSort === "asc" ? "rotate(180deg)" : "none",
          },
          "&:hover .arrow": {
            transform:
              currentSort === "asc" || nextSort === "asc"
                ? "rotate(180deg)"
                : "none",
          },

          "& .icon-slash": {
            strokeDashoffset:
              currentSort === "none" ? 0 : ICON_SLASH_STROKE_DASHOFFSET,
          },
          "&:hover .icon-slash": {
            strokeDashoffset:
              nextSort === "none" ? 0 : ICON_SLASH_STROKE_DASHOFFSET,
          },
        }}
      >
        <div style={{ position: "relative" }}>
          <SortDescIcon className="arrow" />
          <IconSlash />
        </div>
      </IconButton>
    </Tooltip>
  );
}
