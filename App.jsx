import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Coin from "./pages/Coin";

export default function App() {
  return (
    <div className="app-shell">

      <Navbar />

      <main>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/coin/:coinId"
            element={<Coin />}
          />

        </Routes>
      </main>

      <footer className="footer">

        <span>CryptoTrack</span>

        <span>
          Data powered by CoinGecko
        </span>

      </footer>

    </div>
  );
}