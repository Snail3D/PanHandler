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
  {
    label: "Nigeria (NGN)",
    coins: [
      { name: "50 Kobo", diameter: 21.8, currency: "NGN", country: "Nigeria", value: "₦0.50" },
      { name: "1 Naira", diameter: 25.0, currency: "NGN", country: "Nigeria", value: "₦1" },
      { name: "2 Naira", diameter: 27.0, currency: "NGN", country: "Nigeria", value: "₦2" },
    ],
  },
  {
    label: "Kenya (KES)",
    coins: [
      { name: "50 Cents", diameter: 18.5, currency: "KES", country: "Kenya", value: "50¢" },
      { name: "1 Shilling", diameter: 21.0, currency: "KES", country: "Kenya", value: "KSh 1" },
      { name: "5 Shillings", diameter: 23.5, currency: "KES", country: "Kenya", value: "KSh 5" },
      { name: "10 Shillings", diameter: 26.0, currency: "KES", country: "Kenya", value: "KSh 10" },
      { name: "20 Shillings", diameter: 28.5, currency: "KES", country: "Kenya", value: "KSh 20" },
    ],
  },
  {
    label: "Egypt (EGP)",
    nativeLabel: "مصر (EGP)",
    coins: [
      { name: "25 Piastres", nativeName: "٢٥ قرش", diameter: 20.0, currency: "EGP", country: "Egypt", value: "25pt" },
      { name: "50 Piastres", nativeName: "٥٠ قرش", diameter: 22.0, currency: "EGP", country: "Egypt", value: "50pt" },
      { name: "1 Pound", nativeName: "١ جنيه", diameter: 25.0, currency: "EGP", country: "Egypt", value: "£E1" },
    ],
  },
  {
    label: "Philippines (PHP)",
    nativeLabel: "Pilipinas (PHP)",
    coins: [
      { name: "1 Piso", diameter: 24.0, currency: "PHP", country: "Philippines", value: "₱1" },
      { name: "5 Piso", diameter: 27.0, currency: "PHP", country: "Philippines", value: "₱5" },
      { name: "10 Piso", diameter: 26.5, currency: "PHP", country: "Philippines", value: "₱10" },
      { name: "20 Piso", diameter: 23.5, currency: "PHP", country: "Philippines", value: "₱20" },
    ],
  },
  {
    label: "Indonesia (IDR)",
    coins: [
      { name: "100 Rupiah", diameter: 18.0, currency: "IDR", country: "Indonesia", value: "Rp100" },
      { name: "200 Rupiah", diameter: 20.0, currency: "IDR", country: "Indonesia", value: "Rp200" },
      { name: "500 Rupiah", diameter: 24.0, currency: "IDR", country: "Indonesia", value: "Rp500" },
      { name: "1000 Rupiah", diameter: 26.0, currency: "IDR", country: "Indonesia", value: "Rp1,000" },
    ],
  },
  {
    label: "Thailand (THB)",
    nativeLabel: "ไทย (THB)",
    coins: [
      { name: "25 Satang", nativeName: "๒๕ สตางค์", diameter: 16.0, currency: "THB", country: "Thailand", value: "฿0.25" },
      { name: "50 Satang", nativeName: "๕๐ สตางค์", diameter: 18.0, currency: "THB", country: "Thailand", value: "฿0.50" },
      { name: "1 Baht", nativeName: "๑ บาท", diameter: 20.0, currency: "THB", country: "Thailand", value: "฿1" },
      { name: "2 Baht", nativeName: "๒ บาท", diameter: 21.75, currency: "THB", country: "Thailand", value: "฿2" },
      { name: "5 Baht", nativeName: "๕ บาท", diameter: 24.0, currency: "THB", country: "Thailand", value: "฿5" },
      { name: "10 Baht", nativeName: "๑๐ บาท", diameter: 26.0, currency: "THB", country: "Thailand", value: "฿10" },
    ],
  },
  {
    label: "Vietnam (VND)",
    nativeLabel: "Việt Nam (VND)",
    coins: [
      { name: "200 Đồng", diameter: 17.0, currency: "VND", country: "Vietnam", value: "₫200" },
      { name: "500 Đồng", diameter: 19.0, currency: "VND", country: "Vietnam", value: "₫500" },
      { name: "1000 Đồng", diameter: 20.0, currency: "VND", country: "Vietnam", value: "₫1,000" },
      { name: "2000 Đồng", diameter: 21.5, currency: "VND", country: "Vietnam", value: "₫2,000" },
      { name: "5000 Đồng", diameter: 24.5, currency: "VND", country: "Vietnam", value: "₫5,000" },
    ],
  },
  {
    label: "Bangladesh (BDT)",
    nativeLabel: "বাংলাদেশ (BDT)",
    coins: [
      { name: "1 Taka", nativeName: "১ টাকা", diameter: 20.0, currency: "BDT", country: "Bangladesh", value: "৳1" },
      { name: "2 Taka", nativeName: "২ টাকা", diameter: 23.0, currency: "BDT", country: "Bangladesh", value: "৳2" },
      { name: "5 Taka", nativeName: "৫ টাকা", diameter: 26.0, currency: "BDT", country: "Bangladesh", value: "৳5" },
    ],
  },
  {
    label: "Pakistan (PKR)",
    nativeLabel: "پاکستان (PKR)",
    coins: [
      { name: "1 Rupee", nativeName: "١ روپیہ", diameter: 20.5, currency: "PKR", country: "Pakistan", value: "₨1" },
      { name: "2 Rupees", nativeName: "٢ روپیہ", diameter: 23.5, currency: "PKR", country: "Pakistan", value: "₨2" },
      { name: "5 Rupees", nativeName: "٥ روپیہ", diameter: 24.5, currency: "PKR", country: "Pakistan", value: "₨5" },
      { name: "10 Rupees", nativeName: "١٠ روپیہ", diameter: 27.0, currency: "PKR", country: "Pakistan", value: "₨10" },
    ],
  },
  {
    label: "Argentina (ARS)",
    coins: [
      { name: "1 Peso", diameter: 23.0, currency: "ARS", country: "Argentina", value: "$1" },
      { name: "2 Pesos", diameter: 25.0, currency: "ARS", country: "Argentina", value: "$2" },
      { name: "5 Pesos", diameter: 24.5, currency: "ARS", country: "Argentina", value: "$5" },
      { name: "10 Pesos", diameter: 27.0, currency: "ARS", country: "Argentina", value: "$10" },
    ],
  },
  {
    label: "Chile (CLP)",
    coins: [
      { name: "10 Pesos", diameter: 21.0, currency: "CLP", country: "Chile", value: "$10" },
      { name: "50 Pesos", diameter: 23.5, currency: "CLP", country: "Chile", value: "$50" },
      { name: "100 Pesos", diameter: 25.5, currency: "CLP", country: "Chile", value: "$100" },
      { name: "500 Pesos", diameter: 27.0, currency: "CLP", country: "Chile", value: "$500" },
    ],
  },
  {
    label: "Colombia (COP)",
    coins: [
      { name: "50 Pesos", diameter: 18.0, currency: "COP", country: "Colombia", value: "$50" },
      { name: "100 Pesos", diameter: 21.0, currency: "COP", country: "Colombia", value: "$100" },
      { name: "200 Pesos", diameter: 23.0, currency: "COP", country: "Colombia", value: "$200" },
      { name: "500 Pesos", diameter: 25.0, currency: "COP", country: "Colombia", value: "$500" },
      { name: "1000 Pesos", diameter: 27.0, currency: "COP", country: "Colombia", value: "$1,000" },
    ],
  },
  {
    label: "Peru (PEN)",
    nativeLabel: "Perú (PEN)",
    coins: [
      { name: "10 Céntimos", diameter: 17.5, currency: "PEN", country: "Peru", value: "S/0.10" },
      { name: "20 Céntimos", diameter: 20.0, currency: "PEN", country: "Peru", value: "S/0.20" },
      { name: "50 Céntimos", diameter: 22.0, currency: "PEN", country: "Peru", value: "S/0.50" },
      { name: "1 Sol", diameter: 24.5, currency: "PEN", country: "Peru", value: "S/1" },
      { name: "2 Soles", diameter: 26.0, currency: "PEN", country: "Peru", value: "S/2" },
      { name: "5 Soles", diameter: 28.0, currency: "PEN", country: "Peru", value: "S/5" },
    ],
  },
  {
    label: "Morocco (MAD)",
    nativeLabel: "المغرب (MAD)",
    coins: [
      { name: "10 Santimat", nativeName: "١٠ سنتيم", diameter: 17.0, currency: "MAD", country: "Morocco", value: "10¢" },
      { name: "20 Santimat", nativeName: "٢٠ سنتيم", diameter: 20.0, currency: "MAD", country: "Morocco", value: "20¢" },
      { name: "1/2 Dirham", nativeName: "½ درهم", diameter: 18.0, currency: "MAD", country: "Morocco", value: "½DH" },
      { name: "1 Dirham", nativeName: "١ درهم", diameter: 23.0, currency: "MAD", country: "Morocco", value: "1DH" },
      { name: "2 Dirhams", nativeName: "٢ درهم", diameter: 24.5, currency: "MAD", country: "Morocco", value: "2DH" },
      { name: "5 Dirhams", nativeName: "٥ درهم", diameter: 26.0, currency: "MAD", country: "Morocco", value: "5DH" },
      { name: "10 Dirhams", nativeName: "١٠ درهم", diameter: 28.0, currency: "MAD", country: "Morocco", value: "10DH" },
    ],
  },
  {
    label: "Ghana (GHS)",
    coins: [
      { name: "5 Pesewas", diameter: 18.0, currency: "GHS", country: "Ghana", value: "5p" },
      { name: "10 Pesewas", diameter: 20.0, currency: "GHS", country: "Ghana", value: "10p" },
      { name: "20 Pesewas", diameter: 22.0, currency: "GHS", country: "Ghana", value: "20p" },
      { name: "50 Pesewas", diameter: 24.0, currency: "GHS", country: "Ghana", value: "50p" },
      { name: "1 Cedi", diameter: 26.0, currency: "GHS", country: "Ghana", value: "GH₵1" },
      { name: "2 Cedis", diameter: 27.5, currency: "GHS", country: "Ghana", value: "GH₵2" },
    ],
  },
  {
    label: "Tanzania (TZS)",
    coins: [
      { name: "50 Shillings", diameter: 21.0, currency: "TZS", country: "Tanzania", value: "TSh 50" },
      { name: "100 Shillings", diameter: 23.5, currency: "TZS", country: "Tanzania", value: "TSh 100" },
      { name: "200 Shillings", diameter: 26.0, currency: "TZS", country: "Tanzania", value: "TSh 200" },
      { name: "500 Shillings", diameter: 27.5, currency: "TZS", country: "Tanzania", value: "TSh 500" },
    ],
  },
  {
    label: "Uganda (UGX)",
    coins: [
      { name: "50 Shillings", diameter: 19.0, currency: "UGX", country: "Uganda", value: "USh 50" },
      { name: "100 Shillings", diameter: 21.5, currency: "UGX", country: "Uganda", value: "USh 100" },
      { name: "200 Shillings", diameter: 23.5, currency: "UGX", country: "Uganda", value: "USh 200" },
      { name: "500 Shillings", diameter: 26.0, currency: "UGX", country: "Uganda", value: "USh 500" },
      { name: "1000 Shillings", diameter: 28.0, currency: "UGX", country: "Uganda", value: "USh 1,000" },
    ],
  },
  {
    label: "Ethiopia (ETB)",
    nativeLabel: "ኢትዮጵያ (ETB)",
    coins: [
      { name: "1 Santim", diameter: 17.0, currency: "ETB", country: "Ethiopia", value: "1¢" },
      { name: "5 Santim", diameter: 19.0, currency: "ETB", country: "Ethiopia", value: "5¢" },
      { name: "10 Santim", diameter: 21.0, currency: "ETB", country: "Ethiopia", value: "10¢" },
      { name: "25 Santim", diameter: 23.5, currency: "ETB", country: "Ethiopia", value: "25¢" },
      { name: "50 Santim", diameter: 25.5, currency: "ETB", country: "Ethiopia", value: "50¢" },
      { name: "1 Birr", diameter: 27.0, currency: "ETB", country: "Ethiopia", value: "Br1" },
    ],
  },
  {
    label: "Nepal (NPR)",
    nativeLabel: "नेपाल (NPR)",
    coins: [
      { name: "1 Rupee", nativeName: "१ रुपैयाँ", diameter: 21.0, currency: "NPR", country: "Nepal", value: "Rs1" },
      { name: "2 Rupees", nativeName: "२ रुपैयाँ", diameter: 23.0, currency: "NPR", country: "Nepal", value: "Rs2" },
      { name: "5 Rupees", nativeName: "५ रुपैयाँ", diameter: 24.5, currency: "NPR", country: "Nepal", value: "Rs5" },
      { name: "10 Rupees", nativeName: "१० रुपैयाँ", diameter: 26.5, currency: "NPR", country: "Nepal", value: "Rs10" },
    ],
  },
  {
    label: "Sri Lanka (LKR)",
    nativeLabel: "ශ්‍රී ලංකා (LKR)",
    coins: [
      { name: "1 Rupee", diameter: 22.0, currency: "LKR", country: "Sri Lanka", value: "Rs1" },
      { name: "2 Rupees", diameter: 24.0, currency: "LKR", country: "Sri Lanka", value: "Rs2" },
      { name: "5 Rupees", diameter: 25.5, currency: "LKR", country: "Sri Lanka", value: "Rs5" },
      { name: "10 Rupees", diameter: 27.0, currency: "LKR", country: "Sri Lanka", value: "Rs10" },
    ],
  },
  {
    label: "Malaysia (MYR)",
    coins: [
      { name: "5 Sen", diameter: 16.26, currency: "MYR", country: "Malaysia", value: "RM0.05" },
      { name: "10 Sen", diameter: 18.80, currency: "MYR", country: "Malaysia", value: "RM0.10" },
      { name: "20 Sen", diameter: 20.60, currency: "MYR", country: "Malaysia", value: "RM0.20" },
      { name: "50 Sen", diameter: 24.20, currency: "MYR", country: "Malaysia", value: "RM0.50" },
    ],
  },
  {
    label: "UAE (AED)",
    nativeLabel: "الإمارات (AED)",
    coins: [
      { name: "25 Fils", nativeName: "٢٥ فلس", diameter: 18.0, currency: "AED", country: "UAE", value: "25f" },
      { name: "50 Fils", nativeName: "٥٠ فلس", diameter: 20.0, currency: "AED", country: "UAE", value: "50f" },
      { name: "1 Dirham", nativeName: "١ درهم", diameter: 24.0, currency: "AED", country: "UAE", value: "AED1" },
    ],
  },
  {
    label: "Saudi Arabia (SAR)",
    nativeLabel: "السعودية (SAR)",
    coins: [
      { name: "5 Halala", nativeName: "٥ هللة", diameter: 17.0, currency: "SAR", country: "Saudi Arabia", value: "5h" },
      { name: "10 Halala", nativeName: "١٠ هللة", diameter: 20.0, currency: "SAR", country: "Saudi Arabia", value: "10h" },
      { name: "25 Halala", nativeName: "٢٥ هللة", diameter: 20.0, currency: "SAR", country: "Saudi Arabia", value: "25h" },
      { name: "50 Halala", nativeName: "٥٠ هللة", diameter: 24.0, currency: "SAR", country: "Saudi Arabia", value: "50h" },
      { name: "1 Riyal", nativeName: "١ ريال", diameter: 26.0, currency: "SAR", country: "Saudi Arabia", value: "SR1" },
      { name: "2 Riyals", nativeName: "٢ ريال", diameter: 27.5, currency: "SAR", country: "Saudi Arabia", value: "SR2" },
    ],
  },
  {
    label: "Israel (ILS)",
    nativeLabel: "ישראל (ILS)",
    coins: [
      { name: "10 Agorot", nativeName: "10 אגורות", diameter: 18.0, currency: "ILS", country: "Israel", value: "10a" },
      { name: "1/2 Shekel", nativeName: "½ שקל", diameter: 20.5, currency: "ILS", country: "Israel", value: "½₪" },
      { name: "1 Shekel", nativeName: "1 שקל", diameter: 22.0, currency: "ILS", country: "Israel", value: "₪1" },
      { name: "2 Shekels", nativeName: "2 שקלים", diameter: 24.0, currency: "ILS", country: "Israel", value: "₪2" },
      { name: "5 Shekels", nativeName: "5 שקלים", diameter: 26.0, currency: "ILS", country: "Israel", value: "₪5" },
      { name: "10 Shekels", nativeName: "10 שקלים", diameter: 28.0, currency: "ILS", country: "Israel", value: "₪10" },
    ],
  },
  {
    label: "Jordan (JOD)",
    nativeLabel: "الأردن (JOD)",
    coins: [
      { name: "5 Piastres", nativeName: "٥ قرش", diameter: 16.5, currency: "JOD", country: "Jordan", value: "5p" },
      { name: "10 Piastres", nativeName: "١٠ قرش", diameter: 19.0, currency: "JOD", country: "Jordan", value: "10p" },
      { name: "1/4 Dinar", nativeName: "¼ دينار", diameter: 24.0, currency: "JOD", country: "Jordan", value: "¼JD" },
      { name: "1/2 Dinar", nativeName: "½ دينار", diameter: 28.0, currency: "JOD", country: "Jordan", value: "½JD" },
    ],
  },
  {
    label: "Myanmar (MMK)",
    nativeLabel: "မြန်မာ (MMK)",
    coins: [
      { name: "50 Pyas", diameter: 19.0, currency: "MMK", country: "Myanmar", value: "50p" },
      { name: "100 Kyats", diameter: 23.0, currency: "MMK", country: "Myanmar", value: "K100" },
    ],
  },
  {
    label: "Cambodia (KHR)",
    nativeLabel: "កម្ពុជា (KHR)",
    coins: [
      { name: "50 Riels", diameter: 17.0, currency: "KHR", country: "Cambodia", value: "៛50" },
      { name: "100 Riels", diameter: 19.0, currency: "KHR", country: "Cambodia", value: "៛100" },
      { name: "200 Riels", diameter: 21.0, currency: "KHR", country: "Cambodia", value: "៛200" },
      { name: "500 Riels", diameter: 24.0, currency: "KHR", country: "Cambodia", value: "៛500" },
    ],
  },
  {
    label: "Zambia (ZMW)",
    coins: [
      { name: "5 Ngwee", diameter: 18.0, currency: "ZMW", country: "Zambia", value: "5n" },
      { name: "10 Ngwee", diameter: 20.0, currency: "ZMW", country: "Zambia", value: "10n" },
      { name: "50 Ngwee", diameter: 22.0, currency: "ZMW", country: "Zambia", value: "50n" },
      { name: "1 Kwacha", diameter: 24.0, currency: "ZMW", country: "Zambia", value: "K1" },
    ],
  },
  {
    label: "Zimbabwe (ZWL)",
    coins: [
      { name: "1 Dollar", diameter: 22.0, currency: "ZWL", country: "Zimbabwe", value: "$1" },
      { name: "5 Dollars", diameter: 25.0, currency: "ZWL", country: "Zimbabwe", value: "$5" },
    ],
  },
  {
    label: "Botswana (BWP)",
    coins: [
      { name: "5 Thebe", diameter: 17.0, currency: "BWP", country: "Botswana", value: "5t" },
      { name: "10 Thebe", diameter: 19.0, currency: "BWP", country: "Botswana", value: "10t" },
      { name: "25 Thebe", diameter: 21.0, currency: "BWP", country: "Botswana", value: "25t" },
      { name: "50 Thebe", diameter: 23.0, currency: "BWP", country: "Botswana", value: "50t" },
      { name: "1 Pula", diameter: 25.0, currency: "BWP", country: "Botswana", value: "P1" },
      { name: "2 Pula", diameter: 27.0, currency: "BWP", country: "Botswana", value: "P2" },
      { name: "5 Pula", diameter: 28.5, currency: "BWP", country: "Botswana", value: "P5" },
    ],
  },
  {
    label: "Jamaica (JMD)",
    coins: [
      { name: "1 Dollar", diameter: 20.5, currency: "JMD", country: "Jamaica", value: "$1" },
      { name: "5 Dollars", diameter: 23.0, currency: "JMD", country: "Jamaica", value: "$5" },
      { name: "10 Dollars", diameter: 24.5, currency: "JMD", country: "Jamaica", value: "$10" },
      { name: "20 Dollars", diameter: 27.0, currency: "JMD", country: "Jamaica", value: "$20" },
    ],
  },
  {
    label: "Haiti (HTG)",
    nativeLabel: "Haïti (HTG)",
    coins: [
      { name: "50 Centimes", diameter: 19.0, currency: "HTG", country: "Haiti", value: "50c" },
      { name: "1 Gourde", diameter: 24.0, currency: "HTG", country: "Haiti", value: "G1" },
      { name: "5 Gourdes", diameter: 27.0, currency: "HTG", country: "Haiti", value: "G5" },
    ],
  },
  {
    label: "Bolivia (BOB)",
    coins: [
      { name: "10 Centavos", diameter: 17.0, currency: "BOB", country: "Bolivia", value: "Bs0.10" },
      { name: "20 Centavos", diameter: 19.0, currency: "BOB", country: "Bolivia", value: "Bs0.20" },
      { name: "50 Centavos", diameter: 21.0, currency: "BOB", country: "Bolivia", value: "Bs0.50" },
      { name: "1 Boliviano", diameter: 23.0, currency: "BOB", country: "Bolivia", value: "Bs1" },
      { name: "2 Bolivianos", diameter: 25.5, currency: "BOB", country: "Bolivia", value: "Bs2" },
      { name: "5 Bolivianos", diameter: 27.5, currency: "BOB", country: "Bolivia", value: "Bs5" },
    ],
  },
  {
    label: "Nicaragua (NIO)",
    coins: [
      { name: "10 Centavos", diameter: 17.5, currency: "NIO", country: "Nicaragua", value: "C$0.10" },
      { name: "25 Centavos", diameter: 19.5, currency: "NIO", country: "Nicaragua", value: "C$0.25" },
      { name: "50 Centavos", diameter: 21.5, currency: "NIO", country: "Nicaragua", value: "C$0.50" },
      { name: "1 Córdoba", diameter: 24.0, currency: "NIO", country: "Nicaragua", value: "C$1" },
      { name: "5 Córdobas", diameter: 26.5, currency: "NIO", country: "Nicaragua", value: "C$5" },
    ],
  },
  {
    label: "Honduras (HNL)",
    coins: [
      { name: "5 Centavos", diameter: 17.0, currency: "HNL", country: "Honduras", value: "L0.05" },
      { name: "10 Centavos", diameter: 19.0, currency: "HNL", country: "Honduras", value: "L0.10" },
      { name: "20 Centavos", diameter: 21.0, currency: "HNL", country: "Honduras", value: "L0.20" },
      { name: "50 Centavos", diameter: 23.0, currency: "HNL", country: "Honduras", value: "L0.50" },
    ],
  },
  {
    label: "Algeria (DZD)",
    nativeLabel: "الجزائر (DZD)",
    coins: [
      { name: "5 Dinars", nativeName: "٥ دينار", diameter: 24.0, currency: "DZD", country: "Algeria", value: "DA5" },
      { name: "10 Dinars", nativeName: "١٠ دينار", diameter: 26.0, currency: "DZD", country: "Algeria", value: "DA10" },
      { name: "20 Dinars", nativeName: "٢٠ دينار", diameter: 27.0, currency: "DZD", country: "Algeria", value: "DA20" },
      { name: "50 Dinars", nativeName: "٥٠ دينار", diameter: 28.5, currency: "DZD", country: "Algeria", value: "DA50" },
      { name: "100 Dinars", nativeName: "١٠٠ دينار", diameter: 30.0, currency: "DZD", country: "Algeria", value: "DA100" },
    ],
  },
  {
    label: "Tunisia (TND)",
    nativeLabel: "تونس (TND)",
    coins: [
      { name: "5 Millimes", nativeName: "٥ مليم", diameter: 16.0, currency: "TND", country: "Tunisia", value: "5m" },
      { name: "10 Millimes", nativeName: "١٠ مليم", diameter: 18.0, currency: "TND", country: "Tunisia", value: "10m" },
      { name: "20 Millimes", nativeName: "٢٠ مليم", diameter: 20.0, currency: "TND", country: "Tunisia", value: "20m" },
      { name: "50 Millimes", nativeName: "٥٠ مليم", diameter: 22.0, currency: "TND", country: "Tunisia", value: "50m" },
      { name: "1/2 Dinar", nativeName: "½ دينار", diameter: 24.0, currency: "TND", country: "Tunisia", value: "½D" },
      { name: "1 Dinar", nativeName: "١ دينار", diameter: 26.0, currency: "TND", country: "Tunisia", value: "1D" },
    ],
  },
  {
    label: "Senegal (XOF)",
    nativeLabel: "Sénégal (XOF)",
    coins: [
      { name: "1 Franc", diameter: 16.0, currency: "XOF", country: "Senegal", value: "1F" },
      { name: "5 Francs", diameter: 18.0, currency: "XOF", country: "Senegal", value: "5F" },
      { name: "10 Francs", diameter: 20.0, currency: "XOF", country: "Senegal", value: "10F" },
      { name: "25 Francs", diameter: 22.0, currency: "XOF", country: "Senegal", value: "25F" },
      { name: "50 Francs", diameter: 24.0, currency: "XOF", country: "Senegal", value: "50F" },
      { name: "100 Francs", diameter: 26.0, currency: "XOF", country: "Senegal", value: "100F" },
      { name: "250 Francs", diameter: 28.0, currency: "XOF", country: "Senegal", value: "250F" },
      { name: "500 Francs", diameter: 29.5, currency: "XOF", country: "Senegal", value: "500F" },
    ],
  },
  {
    label: "Ivory Coast (XOF)",
    nativeLabel: "Côte d'Ivoire (XOF)",
    coins: [
      { name: "10 Francs", diameter: 20.0, currency: "XOF", country: "Ivory Coast", value: "10F" },
      { name: "25 Francs", diameter: 22.0, currency: "XOF", country: "Ivory Coast", value: "25F" },
      { name: "50 Francs", diameter: 24.0, currency: "XOF", country: "Ivory Coast", value: "50F" },
      { name: "100 Francs", diameter: 26.0, currency: "XOF", country: "Ivory Coast", value: "100F" },
      { name: "250 Francs", diameter: 28.0, currency: "XOF", country: "Ivory Coast", value: "250F" },
    ],
  },
  {
    label: "Cameroon (XAF)",
    nativeLabel: "Cameroun (XAF)",
    coins: [
      { name: "1 Franc", diameter: 16.0, currency: "XAF", country: "Cameroon", value: "1F" },
      { name: "2 Francs", diameter: 17.0, currency: "XAF", country: "Cameroon", value: "2F" },
      { name: "5 Francs", diameter: 18.0, currency: "XAF", country: "Cameroon", value: "5F" },
      { name: "10 Francs", diameter: 20.0, currency: "XAF", country: "Cameroon", value: "10F" },
      { name: "25 Francs", diameter: 22.0, currency: "XAF", country: "Cameroon", value: "25F" },
      { name: "50 Francs", diameter: 24.0, currency: "XAF", country: "Cameroon", value: "50F" },
      { name: "100 Francs", diameter: 26.0, currency: "XAF", country: "Cameroon", value: "100F" },
    ],
  },
  {
    label: "Mozambique (MZN)",
    nativeLabel: "Moçambique (MZN)",
    coins: [
      { name: "50 Centavos", diameter: 18.0, currency: "MZN", country: "Mozambique", value: "50c" },
      { name: "1 Metical", diameter: 20.0, currency: "MZN", country: "Mozambique", value: "1MT" },
      { name: "2 Meticais", diameter: 22.0, currency: "MZN", country: "Mozambique", value: "2MT" },
      { name: "5 Meticais", diameter: 24.0, currency: "MZN", country: "Mozambique", value: "5MT" },
      { name: "10 Meticais", diameter: 26.0, currency: "MZN", country: "Mozambique", value: "10MT" },
    ],
  },
  {
    label: "Rwanda (RWF)",
    coins: [
      { name: "1 Franc", diameter: 19.0, currency: "RWF", country: "Rwanda", value: "1F" },
      { name: "5 Francs", diameter: 21.0, currency: "RWF", country: "Rwanda", value: "5F" },
      { name: "10 Francs", diameter: 23.0, currency: "RWF", country: "Rwanda", value: "10F" },
      { name: "20 Francs", diameter: 25.0, currency: "RWF", country: "Rwanda", value: "20F" },
      { name: "50 Francs", diameter: 27.0, currency: "RWF", country: "Rwanda", value: "50F" },
      { name: "100 Francs", diameter: 28.5, currency: "RWF", country: "Rwanda", value: "100F" },
    ],
  },
  {
    label: "Malawi (MWK)",
    coins: [
      { name: "1 Tambala", diameter: 17.0, currency: "MWK", country: "Malawi", value: "1t" },
      { name: "2 Tambala", diameter: 19.0, currency: "MWK", country: "Malawi", value: "2t" },
      { name: "5 Tambala", diameter: 21.0, currency: "MWK", country: "Malawi", value: "5t" },
      { name: "10 Tambala", diameter: 23.0, currency: "MWK", country: "Malawi", value: "10t" },
    ],
  },
  {
    label: "Mauritius (MUR)",
    coins: [
      { name: "20 Cents", diameter: 18.5, currency: "MUR", country: "Mauritius", value: "20c" },
      { name: "1 Rupee", diameter: 23.0, currency: "MUR", country: "Mauritius", value: "Rs1" },
      { name: "5 Rupees", diameter: 26.5, currency: "MUR", country: "Mauritius", value: "Rs5" },
      { name: "10 Rupees", diameter: 28.0, currency: "MUR", country: "Mauritius", value: "Rs10" },
      { name: "20 Rupees", diameter: 29.5, currency: "MUR", country: "Mauritius", value: "Rs20" },
    ],
  },
  {
    label: "Laos (LAK)",
    nativeLabel: "ລາວ (LAK)",
    coins: [
      { name: "10 Att", diameter: 16.0, currency: "LAK", country: "Laos", value: "10a" },
      { name: "20 Att", diameter: 18.0, currency: "LAK", country: "Laos", value: "20a" },
      { name: "50 Att", diameter: 20.0, currency: "LAK", country: "Laos", value: "50a" },
    ],
  },
  {
    label: "Mongolia (MNT)",
    nativeLabel: "Монгол (MNT)",
    coins: [
      { name: "20 Möngö", nativeName: "20 мөнгө", diameter: 18.0, currency: "MNT", country: "Mongolia", value: "₮0.20" },
      { name: "50 Möngö", nativeName: "50 мөнгө", diameter: 20.0, currency: "MNT", country: "Mongolia", value: "₮0.50" },
      { name: "100 Tögrög", nativeName: "100 төгрөг", diameter: 23.0, currency: "MNT", country: "Mongolia", value: "₮100" },
      { name: "200 Tögrög", nativeName: "200 төгрөг", diameter: 25.0, currency: "MNT", country: "Mongolia", value: "₮200" },
      { name: "500 Tögrög", nativeName: "500 төгрөг", diameter: 27.0, currency: "MNT", country: "Mongolia", value: "₮500" },
    ],
  },
  {
    label: "Kazakhstan (KZT)",
    nativeLabel: "Қазақстан (KZT)",
    coins: [
      { name: "1 Tenge", nativeName: "1 теңге", diameter: 15.5, currency: "KZT", country: "Kazakhstan", value: "₸1" },
      { name: "2 Tenge", nativeName: "2 теңге", diameter: 17.5, currency: "KZT", country: "Kazakhstan", value: "₸2" },
      { name: "5 Tenge", nativeName: "5 теңге", diameter: 19.5, currency: "KZT", country: "Kazakhstan", value: "₸5" },
      { name: "10 Tenge", nativeName: "10 теңге", diameter: 21.5, currency: "KZT", country: "Kazakhstan", value: "₸10" },
      { name: "20 Tenge", nativeName: "20 теңге", diameter: 23.5, currency: "KZT", country: "Kazakhstan", value: "₸20" },
      { name: "50 Tenge", nativeName: "50 теңге", diameter: 24.5, currency: "KZT", country: "Kazakhstan", value: "₸50" },
      { name: "100 Tenge", nativeName: "100 теңге", diameter: 26.5, currency: "KZT", country: "Kazakhstan", value: "₸100" },
    ],
  },
  {
    label: "Uzbekistan (UZS)",
    nativeLabel: "Ўзбекистон (UZS)",
    coins: [
      { name: "25 Som", nativeName: "25 сўм", diameter: 18.0, currency: "UZS", country: "Uzbekistan", value: "25s" },
      { name: "50 Som", nativeName: "50 сўм", diameter: 20.0, currency: "UZS", country: "Uzbekistan", value: "50s" },
      { name: "100 Som", nativeName: "100 сўм", diameter: 22.0, currency: "UZS", country: "Uzbekistan", value: "100s" },
    ],
  },
  {
    label: "Kyrgyzstan (KGS)",
    nativeLabel: "Кыргызстан (KGS)",
    coins: [
      { name: "1 Som", nativeName: "1 сом", diameter: 18.5, currency: "KGS", country: "Kyrgyzstan", value: "1с" },
      { name: "3 Som", nativeName: "3 сом", diameter: 20.5, currency: "KGS", country: "Kyrgyzstan", value: "3с" },
      { name: "5 Som", nativeName: "5 сом", diameter: 22.5, currency: "KGS", country: "Kyrgyzstan", value: "5с" },
      { name: "10 Som", nativeName: "10 сом", diameter: 24.5, currency: "KGS", country: "Kyrgyzstan", value: "10с" },
    ],
  },
  {
    label: "Armenia (AMD)",
    nativeLabel: "Հայաստան (AMD)",
    coins: [
      { name: "10 Dram", nativeName: "10 դրամ", diameter: 18.0, currency: "AMD", country: "Armenia", value: "10֏" },
      { name: "20 Dram", nativeName: "20 դրամ", diameter: 20.0, currency: "AMD", country: "Armenia", value: "20֏" },
      { name: "50 Dram", nativeName: "50 դրամ", diameter: 22.0, currency: "AMD", country: "Armenia", value: "50֏" },
      { name: "100 Dram", nativeName: "100 դրամ", diameter: 24.0, currency: "AMD", country: "Armenia", value: "100֏" },
      { name: "200 Dram", nativeName: "200 դրամ", diameter: 26.0, currency: "AMD", country: "Armenia", value: "200֏" },
      { name: "500 Dram", nativeName: "500 դրամ", diameter: 28.0, currency: "AMD", country: "Armenia", value: "500֏" },
    ],
  },
  {
    label: "Georgia (GEL)",
    nativeLabel: "საქართველო (GEL)",
    coins: [
      { name: "1 Tetri", nativeName: "1 თეთრი", diameter: 16.0, currency: "GEL", country: "Georgia", value: "1t" },
      { name: "2 Tetri", nativeName: "2 თეთრი", diameter: 17.5, currency: "GEL", country: "Georgia", value: "2t" },
      { name: "5 Tetri", nativeName: "5 თეთრი", diameter: 19.0, currency: "GEL", country: "Georgia", value: "5t" },
      { name: "10 Tetri", nativeName: "10 თეთრი", diameter: 20.5, currency: "GEL", country: "Georgia", value: "10t" },
      { name: "20 Tetri", nativeName: "20 თეთრი", diameter: 22.0, currency: "GEL", country: "Georgia", value: "20t" },
      { name: "50 Tetri", nativeName: "50 თეთრი", diameter: 23.5, currency: "GEL", country: "Georgia", value: "50t" },
      { name: "1 Lari", nativeName: "1 ლარი", diameter: 25.0, currency: "GEL", country: "Georgia", value: "₾1" },
      { name: "2 Lari", nativeName: "2 ლარი", diameter: 27.0, currency: "GEL", country: "Georgia", value: "₾2" },
    ],
  },
  {
    label: "Ukraine (UAH)",
    nativeLabel: "Україна (UAH)",
    coins: [
      { name: "1 Hryvnia", nativeName: "1 гривня", diameter: 20.0, currency: "UAH", country: "Ukraine", value: "₴1" },
      { name: "2 Hryvni", nativeName: "2 гривні", diameter: 22.0, currency: "UAH", country: "Ukraine", value: "₴2" },
      { name: "5 Hryvyen", nativeName: "5 гривень", diameter: 24.0, currency: "UAH", country: "Ukraine", value: "₴5" },
      { name: "10 Hryvyen", nativeName: "10 гривень", diameter: 26.0, currency: "UAH", country: "Ukraine", value: "₴10" },
    ],
  },
  {
    label: "Romania (RON)",
    nativeLabel: "România (RON)",
    coins: [
      { name: "1 Ban", diameter: 16.0, currency: "RON", country: "Romania", value: "1b" },
      { name: "5 Bani", diameter: 18.0, currency: "RON", country: "Romania", value: "5b" },
      { name: "10 Bani", diameter: 18.75, currency: "RON", country: "Romania", value: "10b" },
      { name: "50 Bani", diameter: 23.75, currency: "RON", country: "Romania", value: "50b" },
    ],
  },
  {
    label: "Czech Republic (CZK)",
    nativeLabel: "Česko (CZK)",
    coins: [
      { name: "1 Koruna", diameter: 20.0, currency: "CZK", country: "Czech Republic", value: "1Kč" },
      { name: "2 Koruny", diameter: 21.5, currency: "CZK", country: "Czech Republic", value: "2Kč" },
      { name: "5 Korun", diameter: 23.0, currency: "CZK", country: "Czech Republic", value: "5Kč" },
      { name: "10 Korun", diameter: 24.5, currency: "CZK", country: "Czech Republic", value: "10Kč" },
      { name: "20 Korun", diameter: 26.0, currency: "CZK", country: "Czech Republic", value: "20Kč" },
      { name: "50 Korun", diameter: 27.5, currency: "CZK", country: "Czech Republic", value: "50Kč" },
    ],
  },
  {
    label: "Hungary (HUF)",
    nativeLabel: "Magyarország (HUF)",
    coins: [
      { name: "5 Forint", diameter: 21.2, currency: "HUF", country: "Hungary", value: "5Ft" },
      { name: "10 Forint", diameter: 24.8, currency: "HUF", country: "Hungary", value: "10Ft" },
      { name: "20 Forint", diameter: 26.3, currency: "HUF", country: "Hungary", value: "20Ft" },
      { name: "50 Forint", diameter: 27.4, currency: "HUF", country: "Hungary", value: "50Ft" },
      { name: "100 Forint", diameter: 23.8, currency: "HUF", country: "Hungary", value: "100Ft" },
      { name: "200 Forint", diameter: 28.4, currency: "HUF", country: "Hungary", value: "200Ft" },
    ],
  },
  {
    label: "Croatia (HRK)",
    nativeLabel: "Hrvatska (HRK)",
    coins: [
      { name: "1 Lipa", diameter: 16.25, currency: "HRK", country: "Croatia", value: "1lp" },
      { name: "2 Lipe", diameter: 18.5, currency: "HRK", country: "Croatia", value: "2lp" },
      { name: "5 Lipa", diameter: 20.5, currency: "HRK", country: "Croatia", value: "5lp" },
      { name: "10 Lipa", diameter: 18.0, currency: "HRK", country: "Croatia", value: "10lp" },
      { name: "20 Lipa", diameter: 20.0, currency: "HRK", country: "Croatia", value: "20lp" },
      { name: "50 Lipa", diameter: 22.0, currency: "HRK", country: "Croatia", value: "50lp" },
      { name: "1 Kuna", diameter: 22.5, currency: "HRK", country: "Croatia", value: "1kn" },
      { name: "2 Kune", diameter: 24.0, currency: "HRK", country: "Croatia", value: "2kn" },
      { name: "5 Kuna", diameter: 26.5, currency: "HRK", country: "Croatia", value: "5kn" },
    ],
  },
  {
    label: "Costa Rica (CRC)",
    coins: [
      { name: "5 Colones", diameter: 19.0, currency: "CRC", country: "Costa Rica", value: "₡5" },
      { name: "10 Colones", diameter: 20.5, currency: "CRC", country: "Costa Rica", value: "₡10" },
      { name: "25 Colones", diameter: 22.0, currency: "CRC", country: "Costa Rica", value: "₡25" },
      { name: "50 Colones", diameter: 24.0, currency: "CRC", country: "Costa Rica", value: "₡50" },
      { name: "100 Colones", diameter: 26.0, currency: "CRC", country: "Costa Rica", value: "₡100" },
      { name: "500 Colones", diameter: 28.0, currency: "CRC", country: "Costa Rica", value: "₡500" },
    ],
  },
  {
    label: "Panama (PAB)",
    nativeLabel: "Panamá (PAB)",
    coins: [
      { name: "1 Centésimo", diameter: 17.0, currency: "PAB", country: "Panama", value: "¢1" },
      { name: "5 Centésimos", diameter: 19.0, currency: "PAB", country: "Panama", value: "¢5" },
      { name: "10 Centésimos", diameter: 21.0, currency: "PAB", country: "Panama", value: "¢10" },
      { name: "25 Centésimos", diameter: 24.26, currency: "PAB", country: "Panama", value: "¢25" },
      { name: "50 Centésimos", diameter: 30.61, currency: "PAB", country: "Panama", value: "¢50" },
    ],
  },
  {
    label: "Guatemala (GTQ)",
    coins: [
      { name: "1 Centavo", diameter: 16.5, currency: "GTQ", country: "Guatemala", value: "1¢" },
      { name: "5 Centavos", diameter: 19.0, currency: "GTQ", country: "Guatemala", value: "5¢" },
      { name: "10 Centavos", diameter: 21.0, currency: "GTQ", country: "Guatemala", value: "10¢" },
      { name: "25 Centavos", diameter: 23.5, currency: "GTQ", country: "Guatemala", value: "25¢" },
      { name: "50 Centavos", diameter: 25.5, currency: "GTQ", country: "Guatemala", value: "50¢" },
      { name: "1 Quetzal", diameter: 27.5, currency: "GTQ", country: "Guatemala", value: "Q1" },
    ],
  },
  {
    label: "El Salvador (USD)",
    coins: [
      { name: "1 Centavo", diameter: 17.0, currency: "USD", country: "El Salvador", value: "1¢" },
      { name: "5 Centavos", diameter: 19.0, currency: "USD", country: "El Salvador", value: "5¢" },
      { name: "10 Centavos", diameter: 21.0, currency: "USD", country: "El Salvador", value: "10¢" },
      { name: "25 Centavos", diameter: 24.26, currency: "USD", country: "El Salvador", value: "25¢" },
    ],
  },
  {
    label: "Paraguay (PYG)",
    coins: [
      { name: "50 Guaraníes", diameter: 20.0, currency: "PYG", country: "Paraguay", value: "₲50" },
      { name: "100 Guaraníes", diameter: 22.0, currency: "PYG", country: "Paraguay", value: "₲100" },
      { name: "500 Guaraníes", diameter: 25.0, currency: "PYG", country: "Paraguay", value: "₲500" },
      { name: "1000 Guaraníes", diameter: 27.0, currency: "PYG", country: "Paraguay", value: "₲1,000" },
    ],
  },
  {
    label: "Uruguay (UYU)",
    coins: [
      { name: "1 Peso", diameter: 20.0, currency: "UYU", country: "Uruguay", value: "$1" },
      { name: "2 Pesos", diameter: 22.0, currency: "UYU", country: "Uruguay", value: "$2" },
      { name: "5 Pesos", diameter: 24.0, currency: "UYU", country: "Uruguay", value: "$5" },
      { name: "10 Pesos", diameter: 26.0, currency: "UYU", country: "Uruguay", value: "$10" },
    ],
  },
  {
    label: "Ecuador (USD)",
    coins: [
      { name: "1 Centavo", diameter: 16.0, currency: "USD", country: "Ecuador", value: "1¢" },
      { name: "5 Centavos", diameter: 18.0, currency: "USD", country: "Ecuador", value: "5¢" },
      { name: "10 Centavos", diameter: 19.0, currency: "USD", country: "Ecuador", value: "10¢" },
      { name: "25 Centavos", diameter: 24.26, currency: "USD", country: "Ecuador", value: "25¢" },
      { name: "50 Centavos", diameter: 27.0, currency: "USD", country: "Ecuador", value: "50¢" },
    ],
  },
  {
    label: "Venezuela (VES)",
    coins: [
      { name: "5 Céntimos", diameter: 17.0, currency: "VES", country: "Venezuela", value: "Bs.S 0.05" },
      { name: "10 Céntimos", diameter: 19.0, currency: "VES", country: "Venezuela", value: "Bs.S 0.10" },
      { name: "25 Céntimos", diameter: 20.5, currency: "VES", country: "Venezuela", value: "Bs.S 0.25" },
      { name: "50 Céntimos", diameter: 22.0, currency: "VES", country: "Venezuela", value: "Bs.S 0.50" },
      { name: "1 Bolívar", diameter: 26.0, currency: "VES", country: "Venezuela", value: "Bs.S 1" },
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
