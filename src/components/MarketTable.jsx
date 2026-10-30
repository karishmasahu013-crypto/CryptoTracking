import {
    Search,
    RefreshCw
  } from "lucide-react";
  
  import {
    useMemo,
    useState
  } from "react";
  
  import CoinItem from "./CoinItem";
  
  import {
    useCoins
  } from "../context/Coincontext";
  
  export default function MarketTable() {
  
    const {
      coins,
      currency,
      loading,
      error,
      refresh
    } = useCoins();
  
    const [query, setQuery] =
      useState("");
  
    const filtered =
      useMemo(() => {
  
        const q =
          query.trim().toLowerCase();
  
        if (!q) return coins;
  
        return coins.filter(
          (coin) =>
  
            coin.name
              .toLowerCase()
              .includes(q)
  
            ||
  
            coin.symbol
              .toLowerCase()
              .includes(q)
        );
  
      }, [coins, query]);
  
    return (
  
      <section className="market-section">
  
        <div className="section-heading">
  
          <div>
  
            <p className="eyebrow">
              MARKET
            </p>
  
            <h2>
              Top cryptocurrencies
            </h2>
  
          </div>
  
          <div className="table-actions">
  
            <div className="table-search">
  
              <Search size={17} />
  
              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search coin..."
              />
  
            </div>
  
            <button
              className="icon-button"
              onClick={refresh}
              title="Refresh"
            >
  
              <RefreshCw size={17} />
  
            </button>
  
          </div>
  
        </div>
  
        {error && (
  
          <div className="error-box">
            {error}
          </div>
  
        )}
  
        <div className="market-card">
  
          <div className="table-head">
  
            <span>#</span>
  
            <span>Asset</span>
  
            <span>Price</span>
  
            <span>24h</span>
  
            <span>Market cap</span>
  
            <span></span>
  
          </div>
  
          {loading ? (
  
            <div className="loading-list">
  
              {Array.from({
                length: 8
              }).map((_, i) => (
  
                <div
                  className="skeleton-row"
                  key={i}
                />
  
              ))}
  
            </div>
  
          ) : filtered.length ? (
  
            filtered
              .slice(0, 50)
              .map(
                (coin, index) => (
  
                  <CoinItem
                    key={coin.id}
                    coin={coin}
                    index={index}
                    currency={currency}
                  />
  
                )
              )
  
          ) : (
  
            <div className="empty">
              No coins found.
            </div>
  
          )}
  
        </div>
  
      </section>
    );
  }