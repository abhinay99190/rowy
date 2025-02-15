import { IBasicCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";

export default function Percentage({ value }: IBasicCellProps) {
  const theme = useTheme();

  if (typeof value === "number")
    return (
      <>
        <div
          style={{
            backgroundColor: resultColorsScale(value).toHex(),

            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.5,

            zIndex: 0,
          }}
        />
        <div
          style={{
            textAlign: "right",
            color: theme.palette.text.primary,

            position: "relative",
            zIndex: 1,
          }}
        >
          {Math.round(value * 100)}%
        </div>
      </>
    );

  return null;
}
