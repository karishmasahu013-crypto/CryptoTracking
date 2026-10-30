import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
  } from "react";
  
  import axios from "axios";
  
  const CoinContext = createContext(null);
  
  const API_BASE =
    "https://api.coingecko.com/api/v3";
  
  const API_KEY =
    import.meta.env.VITE_COINGECKO_API_KEY;
  
  const api = axios.create({
    baseURL: API_BASE,
  
    headers: API_KEY
      ? {
          "x-cg-demo-api-key": API_KEY
        }
      : {}
  });
  
  export function CoinProvider({ children }) {

    console.log(
        "API KEY:",
        import.meta.env.VITE_COINGECKO_API_KEY
      );
  
    const [coins, setCoins] = useState([]);
  
    const [currency, setCurrency] =
      useState("usd");
  
    const [loading, setLoading] =
      useState(true);
  
    const [error, setError] =
      useState("");
  
      const fetchCoins = useCallback(async () => {
        try {
          setLoading(true);
          setError("");
      
          const { data } = await api.get("/coins/markets", {
            params: {
              vs_currency: currency,
              order: "market_cap_desc",
              per_page: 20,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h"
            }
          });
      
          setCoins(data);
        } catch (err) {
          console.error("CoinGecko error:", err);
      
          setError(
            "Could not load live crypto data. Please check your CoinGecko API key."
          );
        } finally {
          setLoading(false);
        }
      }, [currency]);
  
    useEffect(() => {
  
      fetchCoins();
  
      const timer =
        setInterval(fetchCoins, 60000);
  
      return () =>
        clearInterval(timer);
  
    }, [fetchCoins]);
  
    return (
  
      <CoinContext.Provider
        value={{
          coins,
          currency,
          setCurrency,
          loading,
          error,
          refresh: fetchCoins
        }}
      >
  
        {children}
  
      </CoinContext.Provider>
  
    );
  }
  
  export function useCoins() {
  
    const context =
      useContext(CoinContext);
  
    if (!context) {
  
      throw new Error(
        "useCoins must be used inside CoinProvider"
      );
  
    }
  
    return context;
  }