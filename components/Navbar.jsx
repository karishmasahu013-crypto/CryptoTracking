import {
  Activity,
  Search
} from "lucide-react";

import {
  Link,
  useLocation
} from "react-router-dom";

import { useCoins } from "../context/Coincontext";

export default function Navbar() {

  const location =
    useLocation();

  const {
    currency,
    setCurrency
  } = useCoins();

  return (

    <header className="navbar">

      <Link
        className="brand"
        to="/"
      >

        <span className="brand-icon">
          <Activity size={20} />
        </span>

        <span>
          Crypto
          <span>Track</span>
        </span>

      </Link>

      <nav>

        <Link
          className={
            location.pathname === "/"
              ? "active"
              : ""
          }
          to="/"
        >
          Market
        </Link>

      </nav>

      <div className="nav-actions">

        <div className="search-pill">

          <Search size={17} />

          <span>
            Live market
          </span>

        </div>

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value)
          }
        >

          <option value="usd">
            USD
          </option>

          <option value="inr">
            INR
          </option>

          <option value="eur">
            EUR
          </option>

          <option value="gbp">
            GBP
          </option>

        </select>

      </div>

    </header>
  );
}