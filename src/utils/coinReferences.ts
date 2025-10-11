export interface CoinReference {
  name: string;
  diameter: number; // in mm
  currency: string;
  country: string;
}

export interface CoinCategory {
  label: string;
  coins: CoinReference[];
}

// All coin sizes are diameters in millimeters
export const COIN_REFERENCES: CoinCategory[] = [
  {
    label: "US Coins",
    coins: [
      { name: "Penny", diameter: 19.05, currency: "USD", country: "USA" },
      { name: "Nickel", diameter: 21.21, currency: "USD", country: "USA" },
      { name: "Dime", diameter: 17.91, currency: "USD", country: "USA" },
      { name: "Quarter", diameter: 24.26, currency: "USD", country: "USA" },
      { name: "Half Dollar", diameter: 30.61, currency: "USD", country: "USA" },
      { name: "Dollar Coin", diameter: 26.49, currency: "USD", country: "USA" },
    ],
  },
  {
    label: "Canadian Coins",
    coins: [
      { name: "Penny (1¢)", diameter: 19.05, currency: "CAD", country: "Canada" },
      { name: "Nickel (5¢)", diameter: 21.2, currency: "CAD", country: "Canada" },
      { name: "Dime (10¢)", diameter: 18.03, currency: "CAD", country: "Canada" },
      { name: "Quarter (25¢)", diameter: 23.88, currency: "CAD", country: "Canada" },
      { name: "Loonie ($1)", diameter: 26.5, currency: "CAD", country: "Canada" },
      { name: "Toonie ($2)", diameter: 28.0, currency: "CAD", country: "Canada" },
    ],
  },
  {
    label: "Mexican Coins",
    coins: [
      { name: "10 Centavos", diameter: 14.0, currency: "MXN", country: "Mexico" },
      { name: "20 Centavos", diameter: 15.5, currency: "MXN", country: "Mexico" },
      { name: "50 Centavos", diameter: 17.0, currency: "MXN", country: "Mexico" },
      { name: "1 Peso", diameter: 21.0, currency: "MXN", country: "Mexico" },
      { name: "2 Pesos", diameter: 23.0, currency: "MXN", country: "Mexico" },
      { name: "5 Pesos", diameter: 25.5, currency: "MXN", country: "Mexico" },
      { name: "10 Pesos", diameter: 28.0, currency: "MXN", country: "Mexico" },
    ],
  },
  {
    label: "Euro Coins",
    coins: [
      { name: "1 Cent", diameter: 16.25, currency: "EUR", country: "Europe" },
      { name: "2 Cents", diameter: 18.75, currency: "EUR", country: "Europe" },
      { name: "5 Cents", diameter: 21.25, currency: "EUR", country: "Europe" },
      { name: "10 Cents", diameter: 19.75, currency: "EUR", country: "Europe" },
      { name: "20 Cents", diameter: 22.25, currency: "EUR", country: "Europe" },
      { name: "50 Cents", diameter: 24.25, currency: "EUR", country: "Europe" },
      { name: "1 Euro", diameter: 23.25, currency: "EUR", country: "Europe" },
      { name: "2 Euro", diameter: 25.75, currency: "EUR", country: "Europe" },
    ],
  },
];

// Helper function to get all coins flattened
export function getAllCoins(): CoinReference[] {
  return COIN_REFERENCES.flatMap((category) => category.coins);
}

// Helper function to find a coin by name
export function getCoinByName(name: string): CoinReference | undefined {
  return getAllCoins().find((coin) => coin.name === name);
}
