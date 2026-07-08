export interface CoinDef {
  /** short id, e.g. "BTC" */
  id: string;
  /** full name, e.g. "Bitcoin" */
  name: string;
  /** display label, e.g. "BTC / USD" */
  label: string;
  /** CoinGecko API id used to fetch daily prices */
  coingeckoId: string;
  /** decimal places to display for the USD price */
  digits: number;
  /** anchor spot level used only for demo-mode data generation */
  demoAnchor: number;
  /** typical daily volatility (fraction) used only for demo-mode data */
  demoVol: number;
  /** the flagship asset shown first and featured on the landing page */
  featured?: boolean;
}

/**
 * The assets BudSignal scans. Bitcoin is the headline market; the rest are
 * major, liquid coins so the same daily-timeframe engine has enough history
 * and volume to be meaningful. Everything here is free — no gating.
 */
export const COINS: CoinDef[] = [
  { id: "BTC", name: "Bitcoin", label: "BTC / USD", coingeckoId: "bitcoin", digits: 0, demoAnchor: 68000, demoVol: 0.028, featured: true },
  { id: "ETH", name: "Ethereum", label: "ETH / USD", coingeckoId: "ethereum", digits: 0, demoAnchor: 3500, demoVol: 0.033 },
  { id: "SOL", name: "Solana", label: "SOL / USD", coingeckoId: "solana", digits: 2, demoAnchor: 150, demoVol: 0.048 },
  { id: "BNB", name: "BNB", label: "BNB / USD", coingeckoId: "binancecoin", digits: 1, demoAnchor: 600, demoVol: 0.030 },
  { id: "XRP", name: "XRP", label: "XRP / USD", coingeckoId: "ripple", digits: 4, demoAnchor: 0.55, demoVol: 0.040 },
  { id: "ADA", name: "Cardano", label: "ADA / USD", coingeckoId: "cardano", digits: 4, demoAnchor: 0.45, demoVol: 0.044 },
  { id: "DOGE", name: "Dogecoin", label: "DOGE / USD", coingeckoId: "dogecoin", digits: 5, demoAnchor: 0.13, demoVol: 0.052 },
  { id: "AVAX", name: "Avalanche", label: "AVAX / USD", coingeckoId: "avalanche-2", digits: 2, demoAnchor: 32, demoVol: 0.049 },
  { id: "LINK", name: "Chainlink", label: "LINK / USD", coingeckoId: "chainlink", digits: 2, demoAnchor: 15, demoVol: 0.045 },
  { id: "MATIC", name: "Polygon", label: "POL / USD", coingeckoId: "matic-network", digits: 4, demoAnchor: 0.60, demoVol: 0.047 },
];

export function getCoin(id: string): CoinDef | undefined {
  return COINS.find((c) => c.id === id);
}
