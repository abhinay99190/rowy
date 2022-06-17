import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import ChipList from "@src/components/Table/formatters/ChipList";
import { get } from "lodash-es";
import { getLabel } from "./utils";

export const Connector = forwardRef(function Connector(
  { value, showPopoverCell, disabled, column }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;
  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
      className="cell-collapse-padding"
      sx={{
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
    >
      <ChipList>
        {Array.isArray(value) &&
          value.map((item) => (
            <Grid item key={get(item, config.id)}>
              <Chip label={getLabel(config, item)} size="small" />
            </Grid>
          ))}
      </ChipList>

      {!disabled && (
        <ChevronDown
          className="row-hover-iconButton"
          sx={{
            flexShrink: 0,
            mr: 0.5,
            borderRadius: 1,
            p: (32 - 20) / 2 / 8,
            boxSizing: "content-box !important",
          }}
        />
      )}
    </ButtonBase>
  );
});

export default Connector;
