export interface CoinReference {
  name: string;
  nativeName?: string;
  diameter: number; // in mm
  currency: string;
  country: string;
  value: string;
}

export interface CoinCategory {
  label: string;
  nativeLabel?: string;
  coins: CoinReference[];
}

// Comprehensive world coin database with diameters in millimeters
export const COIN_REFERENCES: CoinCategory[] = [
  {
    label: "United States (USD)",
    coins: [
      { name: "Penny", diameter: 19.05, currency: "USD", country: "USA", value: "1¢" },
      { name: "Nickel", diameter: 21.21, currency: "USD", country: "USA", value: "5¢" },
      { name: "Dime", diameter: 17.91, currency: "USD", country: "USA", value: "10¢" },
      { name: "Quarter", diameter: 24.26, currency: "USD", country: "USA", value: "25¢" },
      { name: "Half Dollar", diameter: 30.61, currency: "USD", country: "USA", value: "50¢" },
      { name: "Dollar Coin", diameter: 26.49, currency: "USD", country: "USA", value: "$1" },
    ],
  },
  {
    label: "Canada (CAD)",
    nativeLabel: "Canada (CAD)",
    coins: [
      { name: "Penny", nativeName: "Cent", diameter: 19.05, currency: "CAD", country: "Canada", value: "1¢" },
      { name: "Nickel", nativeName: "Cinq cents", diameter: 21.2, currency: "CAD", country: "Canada", value: "5¢" },
      { name: "Dime", nativeName: "Dix cents", diameter: 18.03, currency: "CAD", country: "Canada", value: "10¢" },
      { name: "Quarter", nativeName: "Vingt-cinq cents", diameter: 23.88, currency: "CAD", country: "Canada", value: "25¢" },
      { name: "Loonie", nativeName: "Dollar", diameter: 26.5, currency: "CAD", country: "Canada", value: "$1" },
      { name: "Toonie", nativeName: "Deux dollars", diameter: 28.0, currency: "CAD", country: "Canada", value: "$2" },
    ],
  },
  {
    label: "Mexico (MXN)",
    nativeLabel: "México (MXN)",
    coins: [
      { name: "10 Centavos", diameter: 14.0, currency: "MXN", country: "Mexico", value: "$0.10" },
      { name: "20 Centavos", diameter: 15.5, currency: "MXN", country: "Mexico", value: "$0.20" },
      { name: "50 Centavos", diameter: 17.0, currency: "MXN", country: "Mexico", value: "$0.50" },
      { name: "1 Peso", diameter: 21.0, currency: "MXN", country: "Mexico", value: "$1" },
      { name: "2 Pesos", diameter: 23.0, currency: "MXN", country: "Mexico", value: "$2" },
      { name: "5 Pesos", diameter: 25.5, currency: "MXN", country: "Mexico", value: "$5" },
      { name: "10 Pesos", diameter: 28.0, currency: "MXN", country: "Mexico", value: "$10" },
      { name: "20 Pesos", diameter: 32.0, currency: "MXN", country: "Mexico", value: "$20" },
    ],
  },
  {
    label: "Eurozone (EUR)",
    coins: [
      { name: "1 Cent", diameter: 16.25, currency: "EUR", country: "Europe", value: "€0.01" },
      { name: "2 Cents", diameter: 18.75, currency: "EUR", country: "Europe", value: "€0.02" },
      { name: "5 Cents", diameter: 21.25, currency: "EUR", country: "Europe", value: "€0.05" },
      { name: "10 Cents", diameter: 19.75, currency: "EUR", country: "Europe", value: "€0.10" },
      { name: "20 Cents", diameter: 22.25, currency: "EUR", country: "Europe", value: "€0.20" },
      { name: "50 Cents", diameter: 24.25, currency: "EUR", country: "Europe", value: "€0.50" },
      { name: "1 Euro", diameter: 23.25, currency: "EUR", country: "Europe", value: "€1" },
      { name: "2 Euro", diameter: 25.75, currency: "EUR", country: "Europe", value: "€2" },
    ],
  },
  {
    label: "United Kingdom (GBP)",
    coins: [
      { name: "1 Penny", diameter: 20.3, currency: "GBP", country: "UK", value: "1p" },
      { name: "2 Pence", diameter: 25.9, currency: "GBP", country: "UK", value: "2p" },
      { name: "5 Pence", diameter: 18.0, currency: "GBP", country: "UK", value: "5p" },
      { name: "10 Pence", diameter: 24.5, currency: "GBP", country: "UK", value: "10p" },
      { name: "20 Pence", diameter: 21.4, currency: "GBP", country: "UK", value: "20p" },
      { name: "50 Pence", diameter: 27.3, currency: "GBP", country: "UK", value: "50p" },
      { name: "1 Pound", diameter: 23.43, currency: "GBP", country: "UK", value: "£1" },
      { name: "2 Pounds", diameter: 28.4, currency: "GBP", country: "UK", value: "£2" },
    ],
  },
  {
    label: "Japan (JPY)",
    nativeLabel: "日本 (JPY)",
    coins: [
      { name: "1 Yen", nativeName: "一円", diameter: 20.0, currency: "JPY", country: "Japan", value: "¥1" },
      { name: "5 Yen", nativeName: "五円", diameter: 22.0, currency: "JPY", country: "Japan", value: "¥5" },
      { name: "10 Yen", nativeName: "十円", diameter: 23.5, currency: "JPY", country: "Japan", value: "¥10" },
      { name: "50 Yen", nativeName: "五十円", diameter: 21.0, currency: "JPY", country: "Japan", value: "¥50" },
      { name: "100 Yen", nativeName: "百円", diameter: 22.6, currency: "JPY", country: "Japan", value: "¥100" },
      { name: "500 Yen", nativeName: "五百円", diameter: 26.5, currency: "JPY", country: "Japan", value: "¥500" },
    ],
  },
  {
    label: "China (CNY)",
    nativeLabel: "中国 (CNY)",
    coins: [
      { name: "1 Fen", nativeName: "一分", diameter: 18.0, currency: "CNY", country: "China", value: "¥0.01" },
      { name: "5 Fen", nativeName: "五分", diameter: 20.0, currency: "CNY", country: "China", value: "¥0.05" },
      { name: "1 Jiao", nativeName: "一角", diameter: 19.0, currency: "CNY", country: "China", value: "¥0.10" },
      { name: "5 Jiao", nativeName: "五角", diameter: 20.5, currency: "CNY", country: "China", value: "¥0.50" },
      { name: "1 Yuan", nativeName: "一元", diameter: 25.0, currency: "CNY", country: "China", value: "¥1" },
    ],
  },
  {
    label: "Australia (AUD)",
    coins: [
      { name: "5 Cents", diameter: 19.41, currency: "AUD", country: "Australia", value: "$0.05" },
      { name: "10 Cents", diameter: 23.60, currency: "AUD", country: "Australia", value: "$0.10" },
      { name: "20 Cents", diameter: 28.52, currency: "AUD", country: "Australia", value: "$0.20" },
      { name: "50 Cents", diameter: 31.51, currency: "AUD", country: "Australia", value: "$0.50" },
      { name: "1 Dollar", diameter: 25.00, currency: "AUD", country: "Australia", value: "$1" },
      { name: "2 Dollars", diameter: 20.50, currency: "AUD", country: "Australia", value: "$2" },
    ],
  },
  {
    label: "India (INR)",
    nativeLabel: "भारत (INR)",
    coins: [
      { name: "50 Paise", nativeName: "पचास पैसे", diameter: 19.0, currency: "INR", country: "India", value: "₹0.50" },
      { name: "1 Rupee", nativeName: "एक रुपया", diameter: 25.0, currency: "INR", country: "India", value: "₹1" },
      { name: "2 Rupees", nativeName: "दो रुपये", diameter: 27.0, currency: "INR", country: "India", value: "₹2" },
      { name: "5 Rupees", nativeName: "पाँच रुपये", diameter: 23.0, currency: "INR", country: "India", value: "₹5" },
      { name: "10 Rupees", nativeName: "दस रुपये", diameter: 27.0, currency: "INR", country: "India", value: "₹10" },
    ],
  },
  {
    label: "Brazil (BRL)",
    nativeLabel: "Brasil (BRL)",
    coins: [
      { name: "5 Centavos", diameter: 22.0, currency: "BRL", country: "Brazil", value: "R$0.05" },
      { name: "10 Centavos", diameter: 20.0, currency: "BRL", country: "Brazil", value: "R$0.10" },
      { name: "25 Centavos", diameter: 25.0, currency: "BRL", country: "Brazil", value: "R$0.25" },
      { name: "50 Centavos", diameter: 23.0, currency: "BRL", country: "Brazil", value: "R$0.50" },
      { name: "1 Real", diameter: 27.0, currency: "BRL", country: "Brazil", value: "R$1" },
    ],
  },
  {
    label: "South Korea (KRW)",
    nativeLabel: "대한민국 (KRW)",
    coins: [
      { name: "10 Won", nativeName: "십원", diameter: 22.86, currency: "KRW", country: "South Korea", value: "₩10" },
      { name: "50 Won", nativeName: "오십원", diameter: 21.6, currency: "KRW", country: "South Korea", value: "₩50" },
      { name: "100 Won", nativeName: "백원", diameter: 24.0, currency: "KRW", country: "South Korea", value: "₩100" },
      { name: "500 Won", nativeName: "오백원", diameter: 26.5, currency: "KRW", country: "South Korea", value: "₩500" },
    ],
  },
  {
    label: "Switzerland (CHF)",
    nativeLabel: "Schweiz (CHF)",
    coins: [
      { name: "5 Rappen", nativeName: "5 Centimes", diameter: 17.15, currency: "CHF", country: "Switzerland", value: "CHF 0.05" },
      { name: "10 Rappen", nativeName: "10 Centimes", diameter: 19.15, currency: "CHF", country: "Switzerland", value: "CHF 0.10" },
      { name: "20 Rappen", nativeName: "20 Centimes", diameter: 21.05, currency: "CHF", country: "Switzerland", value: "CHF 0.20" },
      { name: "1/2 Franc", nativeName: "1/2 Franken", diameter: 18.20, currency: "CHF", country: "Switzerland", value: "CHF 0.50" },
      { name: "1 Franc", nativeName: "1 Franken", diameter: 23.20, currency: "CHF", country: "Switzerland", value: "CHF 1" },
      { name: "2 Francs", nativeName: "2 Franken", diameter: 27.40, currency: "CHF", country: "Switzerland", value: "CHF 2" },
      { name: "5 Francs", nativeName: "5 Franken", diameter: 31.45, currency: "CHF", country: "Switzerland", value: "CHF 5" },
    ],
  },
  {
    label: "Russia (RUB)",
    nativeLabel: "Россия (RUB)",
    coins: [
      { name: "1 Kopek", nativeName: "1 копейка", diameter: 15.5, currency: "RUB", country: "Russia", value: "1₽" },
      { name: "5 Kopeks", nativeName: "5 копеек", diameter: 18.5, currency: "RUB", country: "Russia", value: "5₽" },
      { name: "10 Kopeks", nativeName: "10 копеек", diameter: 17.5, currency: "RUB", country: "Russia", value: "10₽" },
      { name: "50 Kopeks", nativeName: "50 копеек", diameter: 19.5, currency: "RUB", country: "Russia", value: "50₽" },
      { name: "1 Ruble", nativeName: "1 рубль", diameter: 20.5, currency: "RUB", country: "Russia", value: "1₽" },
      { name: "2 Rubles", nativeName: "2 рубля", diameter: 23.0, currency: "RUB", country: "Russia", value: "2₽" },
      { name: "5 Rubles", nativeName: "5 рублей", diameter: 25.0, currency: "RUB", country: "Russia", value: "5₽" },
      { name: "10 Rubles", nativeName: "10 рублей", diameter: 22.0, currency: "RUB", country: "Russia", value: "10₽" },
    ],
  },
  {
    label: "South Africa (ZAR)",
    coins: [
      { name: "10 Cents", diameter: 16.0, currency: "ZAR", country: "South Africa", value: "R0.10" },
      { name: "20 Cents", diameter: 19.0, currency: "ZAR", country: "South Africa", value: "R0.20" },
      { name: "50 Cents", diameter: 22.0, currency: "ZAR", country: "South Africa", value: "R0.50" },
      { name: "1 Rand", diameter: 20.0, currency: "ZAR", country: "South Africa", value: "R1" },
      { name: "2 Rand", diameter: 23.0, currency: "ZAR", country: "South Africa", value: "R2" },
      { name: "5 Rand", diameter: 26.0, currency: "ZAR", country: "South Africa", value: "R5" },
    ],
  },
  {
    label: "New Zealand (NZD)",
    coins: [
      { name: "10 Cents", diameter: 20.5, currency: "NZD", country: "New Zealand", value: "$0.10" },
      { name: "20 Cents", diameter: 21.75, currency: "NZD", country: "New Zealand", value: "$0.20" },
      { name: "50 Cents", diameter: 24.75, currency: "NZD", country: "New Zealand", value: "$0.50" },
      { name: "1 Dollar", diameter: 23.0, currency: "NZD", country: "New Zealand", value: "$1" },
      { name: "2 Dollars", diameter: 26.5, currency: "NZD", country: "New Zealand", value: "$2" },
    ],
  },
  {
    label: "Singapore (SGD)",
    coins: [
      { name: "5 Cents", diameter: 16.75, currency: "SGD", country: "Singapore", value: "$0.05" },
      { name: "10 Cents", diameter: 18.50, currency: "SGD", country: "Singapore", value: "$0.10" },
      { name: "20 Cents", diameter: 21.36, currency: "SGD", country: "Singapore", value: "$0.20" },
      { name: "50 Cents", diameter: 24.66, currency: "SGD", country: "Singapore", value: "$0.50" },
      { name: "1 Dollar", diameter: 24.26, currency: "SGD", country: "Singapore", value: "$1" },
    ],
  },
  {
    label: "Turkey (TRY)",
    nativeLabel: "Türkiye (TRY)",
    coins: [
      { name: "5 Kuruş", diameter: 16.5, currency: "TRY", country: "Turkey", value: "₺0.05" },
      { name: "10 Kuruş", diameter: 18.5, currency: "TRY", country: "Turkey", value: "₺0.10" },
      { name: "25 Kuruş", diameter: 20.5, currency: "TRY", country: "Turkey", value: "₺0.25" },
      { name: "50 Kuruş", diameter: 23.0, currency: "TRY", country: "Turkey", value: "₺0.50" },
      { name: "1 Lira", diameter: 26.0, currency: "TRY", country: "Turkey", value: "₺1" },
    ],
  },
  {
    label: "Poland (PLN)",
    nativeLabel: "Polska (PLN)",
    coins: [
      { name: "1 Grosz", diameter: 15.5, currency: "PLN", country: "Poland", value: "1gr" },
      { name: "2 Grosze", diameter: 17.5, currency: "PLN", country: "Poland", value: "2gr" },
      { name: "5 Groszy", diameter: 19.5, currency: "PLN", country: "Poland", value: "5gr" },
      { name: "10 Groszy", diameter: 16.5, currency: "PLN", country: "Poland", value: "10gr" },
      { name: "20 Groszy", diameter: 18.5, currency: "PLN", country: "Poland", value: "20gr" },
      { name: "50 Groszy", diameter: 20.5, currency: "PLN", country: "Poland", value: "50gr" },
      { name: "1 Złoty", diameter: 23.0, currency: "PLN", country: "Poland", value: "1zł" },
      { name: "2 Złote", diameter: 21.5, currency: "PLN", country: "Poland", value: "2zł" },
      { name: "5 Złotych", diameter: 24.0, currency: "PLN", country: "Poland", value: "5zł" },
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

// Search function for coins (searches both English and native names)
export function searchCoins(query: string): CoinReference[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return getAllCoins().filter(coin => {
    const matchesName = coin.name.toLowerCase().includes(lowerQuery);
    const matchesNative = coin.nativeName?.toLowerCase().includes(lowerQuery);
    const matchesCountry = coin.country.toLowerCase().includes(lowerQuery);
    const matchesCurrency = coin.currency.toLowerCase().includes(lowerQuery);
    const matchesValue = coin.value.toLowerCase().includes(lowerQuery);
    
    return matchesName || matchesNative || matchesCountry || matchesCurrency || matchesValue;
  });
}
