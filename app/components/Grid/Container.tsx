import cx from "classnames";
import { PropsWithChildren, HTMLAttributes } from "react";
import s from "./Grid.module.css";

export default function Container({
  fluid,
  className,
  children,
  ...props
}: PropsWithChildren<{ fluid?: boolean; className?: cx.Argument } & HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cx(s.container, fluid && s.containerFluid, className)} {...props}>
      {children}
    </div>
  );
}
