import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function CoinItem({ coin, index }) {
  const change = coin.price_change_percentage_24h || 0;

  return (
    <div className="coin-row">

      {/* Rank */}
      <div className="rank">
        {index + 1}
      </div>

      {/* Asset */}
      <Link
        to={`/coin/${coin.id}`}
        className="coin-name"
      >
        <img
          src={coin.image}
          alt={coin.name}
          width="38"
          height="38"
          loading="lazy"
          decoding="async"
        />

        <div>
          <strong>{coin.name}</strong>

          <small>
            {coin.symbol?.toUpperCase()}
          </small>
        </div>
      </Link>

      {/* Price */}
      <div className="coin-price">
        {coin.current_price?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })}
      </div>

      {/* 24H */}
      <div
        className={`change ${
          change >= 0 ? "up" : "down"
        }`}
      >
        {change >= 0 ? (
          <ArrowUp size={13} />
        ) : (
          <ArrowDown size={13} />
        )}

        {Math.abs(change).toFixed(2)}%
      </div>

      {/* Market Cap */}
      <div className="market-cap">
        {coin.market_cap?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0
        })}
      </div>

      {/* External link */}
      <a
        className="row-arrow"
        href={`https://www.coingecko.com/en/coins/${coin.id}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${coin.name} on CoinGecko`}
      >
        <ExternalLink size={16} />
      </a>

    </div>
  );
}