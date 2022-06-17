import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import { sanitiseValue } from "./utils";
import ChipList from "@src/components/Table/formatters/ChipList";
import FormattedChip from "@src/components/FormattedChip";
import { ConvertStringToArray } from "./ConvertStringToArray";

export const MultiSelect = forwardRef(function MultiSelect(
  { value, showPopoverCell, disabled, onSubmit }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  if (typeof value === "string" && value !== "")
    return <ConvertStringToArray value={value} onSubmit={onSubmit} />;

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
        {sanitiseValue(value).map(
          (item) =>
            typeof item === "string" && (
              <Grid item key={item}>
                <FormattedChip label={item} />
              </Grid>
            )
        )}
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

export default MultiSelect;
