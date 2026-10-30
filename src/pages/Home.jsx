import {
  ArrowRight,
  BarChart3,
  Coins,
  Globe2
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import MarketTable
  from "../components/MarketTable";

import {
  useCoins
} from "../context/Coincontext";

const compact = (n) =>

  new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 2
    }
  ).format(n || 0);

export default function Home() {

  const {
    coins,
    currency
  } = useCoins();

  const bitcoin =
    coins.find(
      (c) => c.id === "bitcoin"
    );

  const ethereum =
    coins.find(
      (c) => c.id === "ethereum"
    );

  const totalMarketCap =
    coins.reduce(
      (sum, c) =>
        sum + (c.market_cap || 0),
      0
    );

  return (

    <div className="container">

      <section className="hero">

        <div className="hero-copy">

          <div className="live-badge">

            <span />

            LIVE MARKET DATA

          </div>

          <h1>

            Track the{" "}

            <em>
              crypto
            </em>{" "}

            market in real time.

          </h1>

          <p>

            Explore live prices,
            market caps and
            24-hour movements for
            the world's leading
            cryptocurrencies.

          </p>

          <Link
            to="/coin/bitcoin"
            className="primary-button"
          >

            View Bitcoin data

            <ArrowRight size={17} />

          </Link>

        </div>

        <div className="hero-visual">

          <div className="orb orb-one" />

          <div className="orb orb-two" />

          <div className="hero-card">

            <div className="mini-label">

              BTC /{" "}
              {currency.toUpperCase()}

            </div>

            <div className="big-price">

              {bitcoin

                ? bitcoin.current_price.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency:
                        currency.toUpperCase(),
                      maximumFractionDigits: 2
                    }
                  )

                : "--"}

            </div>

            <div
              className={`hero-change ${
                (bitcoin?.price_change_percentage_24h ?? 0) >= 0
                  ? "up"
                  : "down"
              }`}
            >

              {(bitcoin?.price_change_percentage_24h ?? 0) >= 0
                ? "+"
                : ""}

              {(bitcoin?.price_change_percentage_24h ?? 0).toFixed(
                2
              )}

              % today

            </div>

            <div className="fake-chart">

              <svg
                viewBox="0 0 400 120"
                preserveAspectRatio="none"
              >

                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  points="
                    0,95
                    35,88
                    65,100
                    100,62
                    135,72
                    165,48
                    200,60
                    235,28
                    270,45
                    305,20
                    345,32
                    400,8
                  "
                />

              </svg>

            </div>

          </div>

        </div>

      </section>

      <section className="stats-grid">

        <div className="stat-card">

          <span className="stat-icon">
            <Coins size={18} />
          </span>

          <div>

            <small>
              Coins tracked
            </small>

            <strong>
              {coins.length || "--"}
            </strong>

          </div>

        </div>

        <div className="stat-card">

          <span className="stat-icon">
            <Globe2 size={18} />
          </span>

          <div>

            <small>
              Market cap
            </small>

            <strong>
              {currency.toUpperCase()}{" "}
              {compact(totalMarketCap)}
            </strong>

          </div>

        </div>

        <div className="stat-card">

          <span className="stat-icon">
            <BarChart3 size={18} />
          </span>

          <div>

            <small>
              Ethereum price
            </small>

            <strong>

              {ethereum
                ? `${currency.toUpperCase()} ${compact(
                    ethereum.current_price
                  )}`
                : "--"}

            </strong>

          </div>

        </div>

      </section>

      <MarketTable />

    </div>
  );
}