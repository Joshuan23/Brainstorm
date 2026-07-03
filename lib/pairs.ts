export interface PairDef {
  /** e.g. "EURUSD" */
  id: string;
  /** e.g. "EUR/USD" */
  label: string;
  base: string;
  quote: string;
  /** pip size (0.0001 for most, 0.01 for JPY quotes) */
  pip: number;
  /** decimal places to display */
  digits: number;
  /** anchor spot level used only for demo-mode data generation */
  demoAnchor: number;
  /** typical daily volatility (fraction) used only for demo-mode data */
  demoVol: number;
}

export const PAIRS: PairDef[] = [
  { id: "EURUSD", label: "EUR/USD", base: "EUR", quote: "USD", pip: 0.0001, digits: 5, demoAnchor: 1.092, demoVol: 0.0042 },
  { id: "GBPUSD", label: "GBP/USD", base: "GBP", quote: "USD", pip: 0.0001, digits: 5, demoAnchor: 1.271, demoVol: 0.0048 },
  { id: "USDJPY", label: "USD/JPY", base: "USD", quote: "JPY", pip: 0.01, digits: 3, demoAnchor: 152.4, demoVol: 0.0051 },
  { id: "USDCHF", label: "USD/CHF", base: "USD", quote: "CHF", pip: 0.0001, digits: 5, demoAnchor: 0.884, demoVol: 0.0040 },
  { id: "AUDUSD", label: "AUD/USD", base: "AUD", quote: "USD", pip: 0.0001, digits: 5, demoAnchor: 0.662, demoVol: 0.0055 },
  { id: "USDCAD", label: "USD/CAD", base: "USD", quote: "CAD", pip: 0.0001, digits: 5, demoAnchor: 1.372, demoVol: 0.0038 },
  { id: "NZDUSD", label: "NZD/USD", base: "NZD", quote: "USD", pip: 0.0001, digits: 5, demoAnchor: 0.607, demoVol: 0.0056 },
  { id: "EURGBP", label: "EUR/GBP", base: "EUR", quote: "GBP", pip: 0.0001, digits: 5, demoAnchor: 0.859, demoVol: 0.0031 },
  { id: "EURJPY", label: "EUR/JPY", base: "EUR", quote: "JPY", pip: 0.01, digits: 3, demoAnchor: 166.4, demoVol: 0.0049 },
  { id: "GBPJPY", label: "GBP/JPY", base: "GBP", quote: "JPY", pip: 0.01, digits: 3, demoAnchor: 193.7, demoVol: 0.0060 },
];

/** Pairs visible without a subscription. */
export const FREE_PAIR_IDS = ["EURUSD", "USDJPY"];

export function getPair(id: string): PairDef | undefined {
  return PAIRS.find((p) => p.id === id);
}
