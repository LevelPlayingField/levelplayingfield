import cx from "classnames";
import { HTMLAttributes, PropsWithChildren } from "react";
import s from "./Grid.module.css";

export default function Row({
  centerSm = false,
  centerMd = false,
  centerLg = false,
  className,
  children,
  ...props
}: PropsWithChildren<
  {
    centerSm?: boolean;
    centerMd?: boolean;
    centerLg?: boolean;
    className?: cx.Argument;
  } & HTMLAttributes<HTMLDivElement>
>) {
  return (
    <div
      className={cx(
        s.row,
        {
          [s["center-sm"]]: centerSm,
          [s["center-md"]]: centerMd,
          [s["center-lg"]]: centerLg,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
