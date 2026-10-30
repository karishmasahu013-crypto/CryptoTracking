import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import axios from "axios";

import { useCoins } from "../context/Coincontext";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",

  headers: API_KEY
    ? {
        "x-cg-demo-api-key": API_KEY
      }
    : {}
});

const money = (value, currency) => {
  if (value === undefined || value === null) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value);
};

export default function Coin() {
  const { coinId } = useParams();

  const { currency } = useCoins();

  const [coin, setCoin] = useState(null);

  const [days, setDays] = useState(7);

  const [chart, setChart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCoin() {
      try {
        setLoading(true);
        setError("");

        console.log("Coin ID:", coinId);

        console.log(
          "CoinGecko API key exists:",
          Boolean(API_KEY)
        );

        if (!API_KEY) {
          throw new Error(
            "CoinGecko API key is missing. Check your .env file."
          );
        }

        const coinResponse = await api.get(
          `/coins/${coinId}`,
          {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false
            }
          }
        );

        const chartResponse = await api.get(
          `/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: currency,
              days: days
            }
          }
        );

        setCoin(coinResponse.data);

        const chartData =
          chartResponse.data.prices.map(
            ([time, price]) => ({
              time,
              price
            })
          );

        setChart(chartData);

      } catch (err) {
        console.error(
          "CoinGecko error:",
          err
        );

        if (err.response) {
          console.error(
            "Status:",
            err.response.status
          );

          console.error(
            "Response:",
            err.response.data
          );

          setError(
            `CoinGecko error ${err.response.status}: ${
              err.response.data?.status?.error_message ||
              "API request failed"
            }`
          );
        } else {
          setError(
            err.message ||
              "Unable to load coin data."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadCoin();

  }, [coinId, currency, days]);

  if (loading) {
    return (
      <div className="page-state">
        Loading coin data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-state error-text">
        <div>
          <h2>
            Unable to load this coin
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            <ArrowLeft size={17} />
            Back to market
          </Link>
        </div>
      </div>
    );
  }

  if (!coin) {
    return null;
  }

  const current =
    coin.market_data?.current_price?.[
      currency
    ] ?? 0;

  const change =
    coin.market_data
      ?.price_change_percentage_24h ?? 0;

  return (
    <div className="container coin-page">

      <Link
        className="back-link"
        to="/"
      >
        <ArrowLeft size={17} />

        Back to market
      </Link>

      <section className="coin-header">

        <div className="coin-title">

          <img
            src={coin.image.large}
            alt={coin.name}
          />

          <div>

            <div className="coin-symbol">
              {coin.symbol.toUpperCase()}
            </div>

            <h1>
              {coin.name}
            </h1>

          </div>

        </div>

        {coin.links?.homepage?.[0] && (
          <a
            className="website-button"
            href={coin.links.homepage[0]}
            target="_blank"
            rel="noreferrer"
          >
            Website

            <ExternalLink
              size={15}
            />
          </a>
        )}

      </section>

      <section className="coin-price-card">

        <div>

          <p className="eyebrow">
            CURRENT PRICE
          </p>

          <div className="coin-current-price">

            {money(
              current,
              currency
            )}

          </div>

          <div
            className={`change large ${
              change >= 0
                ? "up"
                : "down"
            }`}
          >

            {change >= 0
              ? "+"
              : ""}

            {change.toFixed(2)}%

            {" "}

            (24h)

          </div>

        </div>

        <div className="range-buttons">

          {[1, 7, 30, 90, 365].map(
            (number) => (

              <button
                key={number}
                className={
                  days === number
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setDays(number)
                }
              >

                {number === 1
                  ? "24H"
                  : number === 365
                  ? "1Y"
                  : `${number}D`}

              </button>

            )
          )}

        </div>

        <div className="chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chart}
            >

              <defs>

                <linearGradient
                  id="chartFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <XAxis
                dataKey="time"
                hide
              />

              <YAxis
                hide
                domain={[
                  "auto",
                  "auto"
                ]}
              />

              <Tooltip
              
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #cccccc",
                  borderRadius: "6px",
                  color: "#000000"
                }}
                labelStyle={{
                  color: "#000000"
                }}
                itemStyle={{
                  color: "#000000"
                }}
              
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="currentColor"
                fill="url(#chartFill)"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </section>

      <section className="details-grid">

        <Detail
          label="Market cap"
          value={money(
            coin.market_data
              ?.market_cap?.[currency],
            currency
          )}
        />

        <Detail
          label="24h high"
          value={money(
            coin.market_data
              ?.high_24h?.[currency],
            currency
          )}
        />

        <Detail
          label="24h low"
          value={money(
            coin.market_data
              ?.low_24h?.[currency],
            currency
          )}
        />

        <Detail
          label="Market rank"
          value={`#${
            coin.market_cap_rank ?? "--"
          }`}
        />

        <Detail
          label="Circulating supply"
          value={
            coin.market_data
              ?.circulating_supply
              ?.toLocaleString() ?? "--"
          }
        />

        <Detail
          label="All-time high"
          value={money(
            coin.market_data
              ?.ath?.[currency],
            currency
          )}
        />

      </section>

      <section className="about-card">

        <p className="eyebrow">
          ABOUT{" "}
          {coin.name.toUpperCase()}
        </p>

        <h2>
          {coin.name} overview
        </h2>

        <p
          dangerouslySetInnerHTML={{
            __html:
              coin.description?.en
                ?.split(". ")
                .slice(0, 3)
                .join(". ") + "."
          }}
        />

      </section>

    </div>
  );
}

function Detail({
  label,
  value
}) {
  return (
    <div className="detail-card">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}