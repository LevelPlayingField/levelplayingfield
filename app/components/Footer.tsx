import { Link } from "@remix-run/react";
import cx from "classnames";
import s from "./Footer.module.css";
import { FaEnvelope, FaFacebook, FaPatreon, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <span className={s.text}>© Level Playing Field</span>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">
          Home
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/about-us">
          About Us
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">
          Privacy
        </Link>
        <span className={s.spacer}>·</span>
        <a className={s.link} href="https://forum.levelplayingfield.io" target="_blank" rel="noopener noreferrer">
          Forum
        </a>
        <span className={s.spacer}>·</span>
        <a className={s.link} href="https://blog.levelplayingfield.io" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
        <span className={s.spacer}>·</span>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:team@lpf.io?subject=Hello, LPF!"
        >
          <FaEnvelope size="1em" />
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/lpf_dot_io"
        >
          <FaTwitter size="1em" />
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/levelplayingfieldio/"
        >
          <FaFacebook size="1em" />
        </a>
        <a
          className={cx(s.link, s.icon)}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.patreon.com/levelplayingfield"
        >
          <FaPatreon size="1em" />
        </a>
      </div>
    </div>
  );
}
