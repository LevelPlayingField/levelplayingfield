import { useCallback, useState } from "react";
import cx from "classnames";

import s from "./SearchBar.module.css";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "@remix-run/react";

export default function SearchBar({ className }: { className?: cx.Argument }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const navigateToSearch = useCallback(() => {
    navigate({
      pathname: "/search",
      search: `?q=${encodeURIComponent(query)}`,
    });
  }, [navigate, query]);

  const hideField = location.pathname === "/search";

  // TODO: Handle URL changes, updating `query`

  return (
    <div className={cx(s.root, className)} role="navigation">
      {hideField ? null : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className={s.search}>
          <input
            type="search"
            name="search"
            className={s.searchField}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (query) {
                navigateToSearch();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigateToSearch();
              }
            }}
          />
          <FaSearch />
        </label>
      )}
    </div>
  );
}
