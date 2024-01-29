import cx from "classnames";
import { PropsWithChildren } from "react";
import s from "./Grid.module.css";

export default function Col({
  sm,
  md,
  lg,
  className,
  children,
}: PropsWithChildren<{
  sm?: string | number | false;
  md?: string | number | false;
  lg?: string | number | false;
  className?: cx.Argument;
}>) {
  return (
    <div
      className={cx(
        s.col,
        s[sm === false ? "hidden-sm" : sm ? `col-sm-${sm}` : `col-sm`],
        s[md === false ? "hidden-md" : md ? `col-md-${md}` : `col-md`],
        s[lg === false ? "hidden-lg" : lg ? `col-lg-${lg}` : `col-lg`],
        className
      )}
    >
      {children}
    </div>
  );
}
