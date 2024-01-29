import cx from "classnames";
import s from "./Navigation.module.css";
import { Link } from "@remix-run/react";

export default function Navigation({ className }: { className: cx.Argument }) {
  return (
    <div className={cx(s.root, className)} role="navigation">
      <a className={s.link} href="https://www.patreon.com/levelplayingfield" target="_blank" rel="noopener noreferrer">
        Donate
      </a>

      <a className={s.link} href="https://forum.levelplayingfield.io" target="_blank" rel="noopener noreferrer">
        Forum
      </a>

      <a className={s.link} href="https://blog.levelplayingfield.io" target="_blank" rel="noopener noreferrer">
        Blog
      </a>

      <Link className={s.link} to="/search?q=is:case">
        Cases
      </Link>
      <Link className={s.link} to="/search?q=is:party">
        Parties
      </Link>
    </div>
  );
}
