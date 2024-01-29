import { Link } from "@remix-run/react";
import s from "./Header.module.css";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
export default function Header() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.sections}>
          <Link className={s.brand} to="/">
            <span className={s.brandTxt}>Level Playing Field</span>
          </Link>

          <SearchBar className={s.search} />
          <Navigation className={s.nav} />
        </div>
      </div>
      <div className={s.subContainer}>
        <Link to="/search-help" className={s.heading}>
          How to Search Level Playing Field
        </Link>
      </div>
    </div>
  );
}
