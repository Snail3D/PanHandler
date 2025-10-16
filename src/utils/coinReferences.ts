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
  {
    label: "Norway (NOK)",
    nativeLabel: "Norge (NOK)",
    coins: [
      { name: "1 Krone", diameter: 21.0, currency: "NOK", country: "Norway", value: "1kr" },
      { name: "5 Kroner", diameter: 23.5, currency: "NOK", country: "Norway", value: "5kr" },
      { name: "10 Kroner", diameter: 24.5, currency: "NOK", country: "Norway", value: "10kr" },
      { name: "20 Kroner", diameter: 27.5, currency: "NOK", country: "Norway", value: "20kr" },
    ],
  },
  {
    label: "Sweden (SEK)",
    nativeLabel: "Sverige (SEK)",
    coins: [
      { name: "1 Krona", diameter: 19.5, currency: "SEK", country: "Sweden", value: "1kr" },
      { name: "2 Kronor", diameter: 22.5, currency: "SEK", country: "Sweden", value: "2kr" },
      { name: "5 Kronor", diameter: 23.75, currency: "SEK", country: "Sweden", value: "5kr" },
      { name: "10 Kronor", diameter: 20.5, currency: "SEK", country: "Sweden", value: "10kr" },
    ],
  },
  {
    label: "Denmark (DKK)",
    nativeLabel: "Danmark (DKK)",
    coins: [
      { name: "50 Øre", diameter: 18.0, currency: "DKK", country: "Denmark", value: "50ø" },
      { name: "1 Krone", diameter: 20.25, currency: "DKK", country: "Denmark", value: "1kr" },
      { name: "2 Kroner", diameter: 24.5, currency: "DKK", country: "Denmark", value: "2kr" },
      { name: "5 Kroner", diameter: 23.35, currency: "DKK", country: "Denmark", value: "5kr" },
      { name: "10 Kroner", diameter: 27.0, currency: "DKK", country: "Denmark", value: "10kr" },
      { name: "20 Kroner", diameter: 27.0, currency: "DKK", country: "Denmark", value: "20kr" },
    ],
  },
  {
    label: "Iceland (ISK)",
    nativeLabel: "Ísland (ISK)",
    coins: [
      { name: "1 Króna", diameter: 18.0, currency: "ISK", country: "Iceland", value: "1kr" },
      { name: "5 Krónur", diameter: 20.5, currency: "ISK", country: "Iceland", value: "5kr" },
      { name: "10 Krónur", diameter: 22.5, currency: "ISK", country: "Iceland", value: "10kr" },
      { name: "50 Krónur", diameter: 25.0, currency: "ISK", country: "Iceland", value: "50kr" },
      { name: "100 Krónur", diameter: 27.5, currency: "ISK", country: "Iceland", value: "100kr" },
    ],
  },
  {
    label: "Iran (IRR)",
    nativeLabel: "ایران (IRR)",
    coins: [
      { name: "50 Rials", nativeName: "٥٠ ریال", diameter: 18.0, currency: "IRR", country: "Iran", value: "50﷼" },
      { name: "100 Rials", nativeName: "١٠٠ ریال", diameter: 20.0, currency: "IRR", country: "Iran", value: "100﷼" },
      { name: "250 Rials", nativeName: "٢٥٠ ریال", diameter: 22.5, currency: "IRR", country: "Iran", value: "250﷼" },
      { name: "500 Rials", nativeName: "٥٠٠ ریال", diameter: 24.5, currency: "IRR", country: "Iran", value: "500﷼" },
      { name: "1000 Rials", nativeName: "١٠٠٠ ریال", diameter: 26.0, currency: "IRR", country: "Iran", value: "1000﷼" },
    ],
  },
  {
    label: "Iraq (IQD)",
    nativeLabel: "العراق (IQD)",
    coins: [
      { name: "25 Dinars", nativeName: "٢٥ دينار", diameter: 18.0, currency: "IQD", country: "Iraq", value: "25ID" },
      { name: "50 Dinars", nativeName: "٥٠ دينار", diameter: 20.0, currency: "IQD", country: "Iraq", value: "50ID" },
      { name: "100 Dinars", nativeName: "١٠٠ دينار", diameter: 23.0, currency: "IQD", country: "Iraq", value: "100ID" },
      { name: "250 Dinars", nativeName: "٢٥٠ دينار", diameter: 26.0, currency: "IQD", country: "Iraq", value: "250ID" },
    ],
  },
  {
    label: "Afghanistan (AFN)",
    nativeLabel: "افغانستان (AFN)",
    coins: [
      { name: "1 Afghani", nativeName: "١ افغانی", diameter: 20.0, currency: "AFN", country: "Afghanistan", value: "؋1" },
      { name: "2 Afghanis", nativeName: "٢ افغانی", diameter: 22.0, currency: "AFN", country: "Afghanistan", value: "؋2" },
      { name: "5 Afghanis", nativeName: "٥ افغانی", diameter: 24.0, currency: "AFN", country: "Afghanistan", value: "؋5" },
    ],
  },
  {
    label: "Yemen (YER)",
    nativeLabel: "اليمن (YER)",
    coins: [
      { name: "1 Rial", nativeName: "١ ريال", diameter: 19.0, currency: "YER", country: "Yemen", value: "1﷼" },
      { name: "5 Rials", nativeName: "٥ ريال", diameter: 21.0, currency: "YER", country: "Yemen", value: "5﷼" },
      { name: "10 Rials", nativeName: "١٠ ريال", diameter: 23.5, currency: "YER", country: "Yemen", value: "10﷼" },
      { name: "20 Rials", nativeName: "٢٠ ريال", diameter: 26.0, currency: "YER", country: "Yemen", value: "20﷼" },
    ],
  },
  {
    label: "Oman (OMR)",
    nativeLabel: "عمان (OMR)",
    coins: [
      { name: "5 Baisa", nativeName: "٥ بيسة", diameter: 17.0, currency: "OMR", country: "Oman", value: "5b" },
      { name: "10 Baisa", nativeName: "١٠ بيسة", diameter: 19.5, currency: "OMR", country: "Oman", value: "10b" },
      { name: "25 Baisa", nativeName: "٢٥ بيسة", diameter: 21.0, currency: "OMR", country: "Oman", value: "25b" },
      { name: "50 Baisa", nativeName: "٥٠ بيسة", diameter: 24.0, currency: "OMR", country: "Oman", value: "50b" },
    ],
  },
  {
    label: "Kuwait (KWD)",
    nativeLabel: "الكويت (KWD)",
    coins: [
      { name: "5 Fils", nativeName: "٥ فلس", diameter: 17.5, currency: "KWD", country: "Kuwait", value: "5f" },
      { name: "10 Fils", nativeName: "١٠ فلس", diameter: 19.5, currency: "KWD", country: "Kuwait", value: "10f" },
      { name: "20 Fils", nativeName: "٢٠ فلس", diameter: 21.0, currency: "KWD", country: "Kuwait", value: "20f" },
      { name: "50 Fils", nativeName: "٥٠ فلس", diameter: 23.5, currency: "KWD", country: "Kuwait", value: "50f" },
      { name: "100 Fils", nativeName: "١٠٠ فلس", diameter: 26.0, currency: "KWD", country: "Kuwait", value: "100f" },
    ],
  },
  {
    label: "Qatar (QAR)",
    nativeLabel: "قطر (QAR)",
    coins: [
      { name: "1 Dirham", nativeName: "١ درهم", diameter: 18.0, currency: "QAR", country: "Qatar", value: "1DH" },
      { name: "5 Dirhams", nativeName: "٥ درهم", diameter: 20.0, currency: "QAR", country: "Qatar", value: "5DH" },
      { name: "10 Dirhams", nativeName: "١٠ درهم", diameter: 22.0, currency: "QAR", country: "Qatar", value: "10DH" },
      { name: "25 Dirhams", nativeName: "٢٥ درهم", diameter: 24.0, currency: "QAR", country: "Qatar", value: "25DH" },
      { name: "50 Dirhams", nativeName: "٥٠ درهم", diameter: 26.0, currency: "QAR", country: "Qatar", value: "50DH" },
    ],
  },
  {
    label: "Bahrain (BHD)",
    nativeLabel: "البحرين (BHD)",
    coins: [
      { name: "5 Fils", nativeName: "٥ فلس", diameter: 17.0, currency: "BHD", country: "Bahrain", value: "5f" },
      { name: "10 Fils", nativeName: "١٠ فلس", diameter: 19.0, currency: "BHD", country: "Bahrain", value: "10f" },
      { name: "25 Fils", nativeName: "٢٥ فلس", diameter: 20.0, currency: "BHD", country: "Bahrain", value: "25f" },
      { name: "50 Fils", nativeName: "٥٠ فلس", diameter: 22.0, currency: "BHD", country: "Bahrain", value: "50f" },
      { name: "100 Fils", nativeName: "١٠٠ فلس", diameter: 24.0, currency: "BHD", country: "Bahrain", value: "100f" },
    ],
  },
  {
    label: "Lebanon (LBP)",
    nativeLabel: "لبنان (LBP)",
    coins: [
      { name: "25 Pounds", nativeName: "٢٥ ليرة", diameter: 18.0, currency: "LBP", country: "Lebanon", value: "L£25" },
      { name: "50 Pounds", nativeName: "٥٠ ليرة", diameter: 20.0, currency: "LBP", country: "Lebanon", value: "L£50" },
      { name: "100 Pounds", nativeName: "١٠٠ ليرة", diameter: 22.0, currency: "LBP", country: "Lebanon", value: "L£100" },
      { name: "250 Pounds", nativeName: "٢٥٠ ليرة", diameter: 24.0, currency: "LBP", country: "Lebanon", value: "L£250" },
      { name: "500 Pounds", nativeName: "٥٠٠ ليرة", diameter: 26.0, currency: "LBP", country: "Lebanon", value: "L£500" },
    ],
  },
  {
    label: "Syria (SYP)",
    nativeLabel: "سوريا (SYP)",
    coins: [
      { name: "1 Pound", nativeName: "١ ليرة", diameter: 19.0, currency: "SYP", country: "Syria", value: "£S1" },
      { name: "2 Pounds", nativeName: "٢ ليرة", diameter: 21.0, currency: "SYP", country: "Syria", value: "£S2" },
      { name: "5 Pounds", nativeName: "٥ ليرة", diameter: 23.0, currency: "SYP", country: "Syria", value: "£S5" },
      { name: "10 Pounds", nativeName: "١٠ ليرة", diameter: 25.0, currency: "SYP", country: "Syria", value: "£S10" },
      { name: "25 Pounds", nativeName: "٢٥ ليرة", diameter: 27.0, currency: "SYP", country: "Syria", value: "£S25" },
    ],
  },
  {
    label: "Taiwan (TWD)",
    nativeLabel: "台灣 (TWD)",
    coins: [
      { name: "1 Dollar", nativeName: "壹圓", diameter: 20.0, currency: "TWD", country: "Taiwan", value: "NT$1" },
      { name: "5 Dollars", nativeName: "伍圓", diameter: 22.0, currency: "TWD", country: "Taiwan", value: "NT$5" },
      { name: "10 Dollars", nativeName: "拾圓", diameter: 26.0, currency: "TWD", country: "Taiwan", value: "NT$10" },
      { name: "20 Dollars", nativeName: "貳拾圓", diameter: 27.0, currency: "TWD", country: "Taiwan", value: "NT$20" },
      { name: "50 Dollars", nativeName: "伍拾圓", diameter: 28.0, currency: "TWD", country: "Taiwan", value: "NT$50" },
    ],
  },
  {
    label: "Hong Kong (HKD)",
    nativeLabel: "香港 (HKD)",
    coins: [
      { name: "10 Cents", nativeName: "一毫", diameter: 17.5, currency: "HKD", country: "Hong Kong", value: "HK$0.10" },
      { name: "20 Cents", nativeName: "貳毫", diameter: 19.4, currency: "HKD", country: "Hong Kong", value: "HK$0.20" },
      { name: "50 Cents", nativeName: "五毫", diameter: 20.5, currency: "HKD", country: "Hong Kong", value: "HK$0.50" },
      { name: "1 Dollar", nativeName: "壹圓", diameter: 25.5, currency: "HKD", country: "Hong Kong", value: "HK$1" },
      { name: "2 Dollars", nativeName: "貳圓", diameter: 23.3, currency: "HKD", country: "Hong Kong", value: "HK$2" },
      { name: "5 Dollars", nativeName: "伍圓", diameter: 24.5, currency: "HKD", country: "Hong Kong", value: "HK$5" },
      { name: "10 Dollars", nativeName: "拾圓", diameter: 26.5, currency: "HKD", country: "Hong Kong", value: "HK$10" },
    ],
  },
  {
    label: "Macau (MOP)",
    nativeLabel: "澳門 (MOP)",
    coins: [
      { name: "10 Avos", diameter: 18.0, currency: "MOP", country: "Macau", value: "10A" },
      { name: "50 Avos", diameter: 20.5, currency: "MOP", country: "Macau", value: "50A" },
      { name: "1 Pataca", diameter: 24.5, currency: "MOP", country: "Macau", value: "1P" },
      { name: "5 Patacas", diameter: 27.0, currency: "MOP", country: "Macau", value: "5P" },
    ],
  },
  {
    label: "Brunei (BND)",
    coins: [
      { name: "1 Sen", diameter: 17.78, currency: "BND", country: "Brunei", value: "1¢" },
      { name: "5 Sen", diameter: 19.41, currency: "BND", country: "Brunei", value: "5¢" },
      { name: "10 Sen", diameter: 23.60, currency: "BND", country: "Brunei", value: "10¢" },
      { name: "20 Sen", diameter: 28.52, currency: "BND", country: "Brunei", value: "20¢" },
      { name: "50 Sen", diameter: 31.51, currency: "BND", country: "Brunei", value: "50¢" },
    ],
  },
  {
    label: "Maldives (MVR)",
    nativeLabel: "ދިވެހިރާއްޖެ (MVR)",
    coins: [
      { name: "1 Laari", diameter: 16.0, currency: "MVR", country: "Maldives", value: "1L" },
      { name: "5 Laari", diameter: 17.5, currency: "MVR", country: "Maldives", value: "5L" },
      { name: "10 Laari", diameter: 19.0, currency: "MVR", country: "Maldives", value: "10L" },
      { name: "25 Laari", diameter: 21.0, currency: "MVR", country: "Maldives", value: "25L" },
      { name: "50 Laari", diameter: 23.0, currency: "MVR", country: "Maldives", value: "50L" },
      { name: "1 Rufiyaa", diameter: 25.0, currency: "MVR", country: "Maldives", value: "Rf1" },
      { name: "2 Rufiyaa", diameter: 27.0, currency: "MVR", country: "Maldives", value: "Rf2" },
    ],
  },
  {
    label: "Bhutan (BTN)",
    nativeLabel: "འབྲུག (BTN)",
    coins: [
      { name: "20 Chhertum", diameter: 19.0, currency: "BTN", country: "Bhutan", value: "Ch20" },
      { name: "25 Chhertum", diameter: 20.0, currency: "BTN", country: "Bhutan", value: "Ch25" },
      { name: "50 Chhertum", diameter: 22.0, currency: "BTN", country: "Bhutan", value: "Ch50" },
      { name: "1 Ngultrum", diameter: 25.0, currency: "BTN", country: "Bhutan", value: "Nu1" },
    ],
  },
  {
    label: "Timor-Leste (USD)",
    nativeLabel: "Timor-Leste (USD)",
    coins: [
      { name: "1 Cent", diameter: 17.0, currency: "USD", country: "Timor-Leste", value: "1¢" },
      { name: "5 Cents", diameter: 19.0, currency: "USD", country: "Timor-Leste", value: "5¢" },
      { name: "10 Cents", diameter: 21.0, currency: "USD", country: "Timor-Leste", value: "10¢" },
      { name: "25 Cents", diameter: 24.26, currency: "USD", country: "Timor-Leste", value: "25¢" },
      { name: "50 Cents", diameter: 27.0, currency: "USD", country: "Timor-Leste", value: "50¢" },
    ],
  },
  {
    label: "Serbia (RSD)",
    nativeLabel: "Србија (RSD)",
    coins: [
      { name: "1 Dinar", nativeName: "1 динар", diameter: 18.0, currency: "RSD", country: "Serbia", value: "1дин" },
      { name: "2 Dinara", nativeName: "2 динара", diameter: 20.0, currency: "RSD", country: "Serbia", value: "2дин" },
      { name: "5 Dinara", nativeName: "5 динара", diameter: 22.0, currency: "RSD", country: "Serbia", value: "5дин" },
      { name: "10 Dinara", nativeName: "10 динара", diameter: 23.5, currency: "RSD", country: "Serbia", value: "10дин" },
      { name: "20 Dinara", nativeName: "20 динара", diameter: 25.5, currency: "RSD", country: "Serbia", value: "20дин" },
    ],
  },
  {
    label: "Bosnia (BAM)",
    nativeLabel: "Bosna (BAM)",
    coins: [
      { name: "5 Feninga", diameter: 17.5, currency: "BAM", country: "Bosnia", value: "5f" },
      { name: "10 Feninga", diameter: 19.25, currency: "BAM", country: "Bosnia", value: "10f" },
      { name: "20 Feninga", diameter: 20.5, currency: "BAM", country: "Bosnia", value: "20f" },
      { name: "50 Feninga", diameter: 22.0, currency: "BAM", country: "Bosnia", value: "50f" },
      { name: "1 Marka", diameter: 24.0, currency: "BAM", country: "Bosnia", value: "1KM" },
      { name: "2 Marke", diameter: 26.0, currency: "BAM", country: "Bosnia", value: "2KM" },
    ],
  },
  {
    label: "Albania (ALL)",
    nativeLabel: "Shqipëria (ALL)",
    coins: [
      { name: "1 Lek", diameter: 16.0, currency: "ALL", country: "Albania", value: "1L" },
      { name: "5 Lekë", diameter: 18.5, currency: "ALL", country: "Albania", value: "5L" },
      { name: "10 Lekë", diameter: 20.5, currency: "ALL", country: "Albania", value: "10L" },
      { name: "20 Lekë", diameter: 23.25, currency: "ALL", country: "Albania", value: "20L" },
      { name: "50 Lekë", diameter: 24.5, currency: "ALL", country: "Albania", value: "50L" },
      { name: "100 Lekë", diameter: 26.5, currency: "ALL", country: "Albania", value: "100L" },
    ],
  },
  {
    label: "North Macedonia (MKD)",
    nativeLabel: "Северна Македонија (MKD)",
    coins: [
      { name: "1 Denar", nativeName: "1 денар", diameter: 16.0, currency: "MKD", country: "North Macedonia", value: "1ден" },
      { name: "2 Denari", nativeName: "2 денари", diameter: 18.5, currency: "MKD", country: "North Macedonia", value: "2ден" },
      { name: "5 Denari", nativeName: "5 денари", diameter: 20.5, currency: "MKD", country: "North Macedonia", value: "5ден" },
      { name: "10 Denari", nativeName: "10 денари", diameter: 22.0, currency: "MKD", country: "North Macedonia", value: "10ден" },
    ],
  },
  {
    label: "Bulgaria (BGN)",
    nativeLabel: "България (BGN)",
    coins: [
      { name: "1 Stotinka", nativeName: "1 стотинка", diameter: 16.0, currency: "BGN", country: "Bulgaria", value: "1ст" },
      { name: "2 Stotinki", nativeName: "2 стотинки", diameter: 18.0, currency: "BGN", country: "Bulgaria", value: "2ст" },
      { name: "5 Stotinki", nativeName: "5 стотинки", diameter: 19.5, currency: "BGN", country: "Bulgaria", value: "5ст" },
      { name: "10 Stotinki", nativeName: "10 стотинки", diameter: 21.0, currency: "BGN", country: "Bulgaria", value: "10ст" },
      { name: "20 Stotinki", nativeName: "20 стотинки", diameter: 22.5, currency: "BGN", country: "Bulgaria", value: "20ст" },
      { name: "50 Stotinki", nativeName: "50 стотинки", diameter: 24.0, currency: "BGN", country: "Bulgaria", value: "50ст" },
      { name: "1 Lev", nativeName: "1 лев", diameter: 23.0, currency: "BGN", country: "Bulgaria", value: "1лв" },
    ],
  },
  {
    label: "Moldova (MDL)",
    nativeLabel: "Moldova (MDL)",
    coins: [
      { name: "1 Ban", diameter: 15.0, currency: "MDL", country: "Moldova", value: "1b" },
      { name: "5 Bani", diameter: 16.5, currency: "MDL", country: "Moldova", value: "5b" },
      { name: "10 Bani", diameter: 17.5, currency: "MDL", country: "Moldova", value: "10b" },
      { name: "25 Bani", diameter: 18.5, currency: "MDL", country: "Moldova", value: "25b" },
      { name: "50 Bani", diameter: 19.5, currency: "MDL", country: "Moldova", value: "50b" },
    ],
  },
  {
    label: "Belarus (BYN)",
    nativeLabel: "Беларусь (BYN)",
    coins: [
      { name: "1 Kapyeyka", nativeName: "1 капейка", diameter: 15.0, currency: "BYN", country: "Belarus", value: "1к" },
      { name: "2 Kapyeyki", nativeName: "2 капейкі", diameter: 17.5, currency: "BYN", country: "Belarus", value: "2к" },
      { name: "5 Kapyeyek", nativeName: "5 капеек", diameter: 19.5, currency: "BYN", country: "Belarus", value: "5к" },
      { name: "10 Kapyeyek", nativeName: "10 капеек", diameter: 21.5, currency: "BYN", country: "Belarus", value: "10к" },
      { name: "20 Kapyeyek", nativeName: "20 капеек", diameter: 23.0, currency: "BYN", country: "Belarus", value: "20к" },
      { name: "50 Kapyeyek", nativeName: "50 капеек", diameter: 24.5, currency: "BYN", country: "Belarus", value: "50к" },
    ],
  },
  {
    label: "Trinidad & Tobago (TTD)",
    coins: [
      { name: "1 Cent", diameter: 16.0, currency: "TTD", country: "Trinidad & Tobago", value: "1¢" },
      { name: "5 Cents", diameter: 18.0, currency: "TTD", country: "Trinidad & Tobago", value: "5¢" },
      { name: "10 Cents", diameter: 20.0, currency: "TTD", country: "Trinidad & Tobago", value: "10¢" },
      { name: "25 Cents", diameter: 21.0, currency: "TTD", country: "Trinidad & Tobago", value: "25¢" },
      { name: "50 Cents", diameter: 23.0, currency: "TTD", country: "Trinidad & Tobago", value: "50¢" },
      { name: "1 Dollar", diameter: 26.5, currency: "TTD", country: "Trinidad & Tobago", value: "$1" },
    ],
  },
  {
    label: "Barbados (BBD)",
    coins: [
      { name: "1 Cent", diameter: 17.0, currency: "BBD", country: "Barbados", value: "1¢" },
      { name: "5 Cents", diameter: 19.0, currency: "BBD", country: "Barbados", value: "5¢" },
      { name: "10 Cents", diameter: 21.0, currency: "BBD", country: "Barbados", value: "10¢" },
      { name: "25 Cents", diameter: 24.0, currency: "BBD", country: "Barbados", value: "25¢" },
      { name: "1 Dollar", diameter: 26.5, currency: "BBD", country: "Barbados", value: "$1" },
    ],
  },
  {
    label: "Bahamas (BSD)",
    coins: [
      { name: "1 Cent", diameter: 19.05, currency: "BSD", country: "Bahamas", value: "1¢" },
      { name: "5 Cents", diameter: 21.21, currency: "BSD", country: "Bahamas", value: "5¢" },
      { name: "10 Cents", diameter: 17.91, currency: "BSD", country: "Bahamas", value: "10¢" },
      { name: "15 Cents", diameter: 24.26, currency: "BSD", country: "Bahamas", value: "15¢" },
      { name: "25 Cents", diameter: 24.26, currency: "BSD", country: "Bahamas", value: "25¢" },
    ],
  },
  {
    label: "East Caribbean (XCD)",
    coins: [
      { name: "1 Cent", diameter: 16.0, currency: "XCD", country: "East Caribbean", value: "1¢" },
      { name: "2 Cents", diameter: 17.5, currency: "XCD", country: "East Caribbean", value: "2¢" },
      { name: "5 Cents", diameter: 19.0, currency: "XCD", country: "East Caribbean", value: "5¢" },
      { name: "10 Cents", diameter: 23.6, currency: "XCD", country: "East Caribbean", value: "10¢" },
      { name: "25 Cents", diameter: 24.0, currency: "XCD", country: "East Caribbean", value: "25¢" },
      { name: "1 Dollar", diameter: 26.5, currency: "XCD", country: "East Caribbean", value: "$1" },
    ],
  },
  {
    label: "Cuba (CUP)",
    coins: [
      { name: "1 Centavo", diameter: 17.5, currency: "CUP", country: "Cuba", value: "1¢" },
      { name: "5 Centavos", diameter: 20.0, currency: "CUP", country: "Cuba", value: "5¢" },
      { name: "20 Centavos", diameter: 22.0, currency: "CUP", country: "Cuba", value: "20¢" },
      { name: "1 Peso", diameter: 24.5, currency: "CUP", country: "Cuba", value: "$1" },
      { name: "3 Pesos", diameter: 26.5, currency: "CUP", country: "Cuba", value: "$3" },
    ],
  },
  {
    label: "Dominican Republic (DOP)",
    nativeLabel: "República Dominicana (DOP)",
    coins: [
      { name: "1 Peso", diameter: 20.5, currency: "DOP", country: "Dominican Republic", value: "$1" },
      { name: "5 Pesos", diameter: 24.5, currency: "DOP", country: "Dominican Republic", value: "$5" },
      { name: "10 Pesos", diameter: 27.0, currency: "DOP", country: "Dominican Republic", value: "$10" },
      { name: "25 Pesos", diameter: 28.5, currency: "DOP", country: "Dominican Republic", value: "$25" },
    ],
  },
  {
    label: "Fiji (FJD)",
    coins: [
      { name: "5 Cents", diameter: 19.0, currency: "FJD", country: "Fiji", value: "5¢" },
      { name: "10 Cents", diameter: 23.6, currency: "FJD", country: "Fiji", value: "10¢" },
      { name: "20 Cents", diameter: 28.5, currency: "FJD", country: "Fiji", value: "20¢" },
      { name: "50 Cents", diameter: 31.5, currency: "FJD", country: "Fiji", value: "50¢" },
      { name: "1 Dollar", diameter: 25.0, currency: "FJD", country: "Fiji", value: "$1" },
      { name: "2 Dollars", diameter: 30.0, currency: "FJD", country: "Fiji", value: "$2" },
    ],
  },
  {
    label: "Papua New Guinea (PGK)",
    coins: [
      { name: "5 Toea", diameter: 19.5, currency: "PGK", country: "Papua New Guinea", value: "5t" },
      { name: "10 Toea", diameter: 23.6, currency: "PGK", country: "Papua New Guinea", value: "10t" },
      { name: "20 Toea", diameter: 28.5, currency: "PGK", country: "Papua New Guinea", value: "20t" },
      { name: "50 Toea", diameter: 31.5, currency: "PGK", country: "Papua New Guinea", value: "50t" },
      { name: "1 Kina", diameter: 25.0, currency: "PGK", country: "Papua New Guinea", value: "K1" },
    ],
  },
  {
    label: "Samoa (WST)",
    coins: [
      { name: "10 Sene", diameter: 18.0, currency: "WST", country: "Samoa", value: "10s" },
      { name: "20 Sene", diameter: 21.0, currency: "WST", country: "Samoa", value: "20s" },
      { name: "50 Sene", diameter: 24.0, currency: "WST", country: "Samoa", value: "50s" },
      { name: "1 Tala", diameter: 28.0, currency: "WST", country: "Samoa", value: "T1" },
    ],
  },
  {
    label: "Tonga (TOP)",
    coins: [
      { name: "5 Seniti", diameter: 17.65, currency: "TOP", country: "Tonga", value: "5s" },
      { name: "10 Seniti", diameter: 20.5, currency: "TOP", country: "Tonga", value: "10s" },
      { name: "20 Seniti", diameter: 23.6, currency: "TOP", country: "Tonga", value: "20s" },
      { name: "50 Seniti", diameter: 28.5, currency: "TOP", country: "Tonga", value: "50s" },
      { name: "1 Paʻanga", diameter: 32.0, currency: "TOP", country: "Tonga", value: "T$1" },
      { name: "2 Paʻanga", diameter: 35.0, currency: "TOP", country: "Tonga", value: "T$2" },
    ],
  },
  {
    label: "Vanuatu (VUV)",
    coins: [
      { name: "1 Vatu", diameter: 18.0, currency: "VUV", country: "Vanuatu", value: "1Vt" },
      { name: "2 Vatu", diameter: 20.5, currency: "VUV", country: "Vanuatu", value: "2Vt" },
      { name: "5 Vatu", diameter: 23.5, currency: "VUV", country: "Vanuatu", value: "5Vt" },
      { name: "10 Vatu", diameter: 23.6, currency: "VUV", country: "Vanuatu", value: "10Vt" },
      { name: "20 Vatu", diameter: 28.5, currency: "VUV", country: "Vanuatu", value: "20Vt" },
      { name: "50 Vatu", diameter: 31.5, currency: "VUV", country: "Vanuatu", value: "50Vt" },
      { name: "100 Vatu", diameter: 32.0, currency: "VUV", country: "Vanuatu", value: "100Vt" },
    ],
  },
  {
    label: "Solomon Islands (SBD)",
    coins: [
      { name: "10 Cents", diameter: 23.6, currency: "SBD", country: "Solomon Islands", value: "10¢" },
      { name: "20 Cents", diameter: 28.5, currency: "SBD", country: "Solomon Islands", value: "20¢" },
      { name: "50 Cents", diameter: 31.5, currency: "SBD", country: "Solomon Islands", value: "50¢" },
      { name: "1 Dollar", diameter: 25.0, currency: "SBD", country: "Solomon Islands", value: "$1" },
      { name: "2 Dollars", diameter: 26.0, currency: "SBD", country: "Solomon Islands", value: "$2" },
    ],
  },
  {
    label: "Guyana (GYD)",
    coins: [
      { name: "1 Dollar", diameter: 18.0, currency: "GYD", country: "Guyana", value: "$1" },
      { name: "5 Dollars", diameter: 21.5, currency: "GYD", country: "Guyana", value: "$5" },
      { name: "10 Dollars", diameter: 24.5, currency: "GYD", country: "Guyana", value: "$10" },
    ],
  },
  {
    label: "Suriname (SRD)",
    coins: [
      { name: "1 Cent", diameter: 14.0, currency: "SRD", country: "Suriname", value: "1¢" },
      { name: "5 Cents", diameter: 16.0, currency: "SRD", country: "Suriname", value: "5¢" },
      { name: "10 Cents", diameter: 18.0, currency: "SRD", country: "Suriname", value: "10¢" },
      { name: "25 Cents", diameter: 20.0, currency: "SRD", country: "Suriname", value: "25¢" },
      { name: "1 Dollar", diameter: 24.0, currency: "SRD", country: "Suriname", value: "$1" },
    ],
  },
  {
    label: "Libya (LYD)",
    nativeLabel: "ليبيا (LYD)",
    coins: [
      { name: "50 Dirhams", nativeName: "٥٠ درهم", diameter: 19.0, currency: "LYD", country: "Libya", value: "50d" },
      { name: "100 Dirhams", nativeName: "١٠٠ درهم", diameter: 22.0, currency: "LYD", country: "Libya", value: "100d" },
    ],
  },
  {
    label: "Sudan (SDG)",
    nativeLabel: "السودان (SDG)",
    coins: [
      { name: "10 Qirsh", nativeName: "١٠ قرش", diameter: 18.0, currency: "SDG", country: "Sudan", value: "10q" },
      { name: "20 Qirsh", nativeName: "٢٠ قرش", diameter: 20.0, currency: "SDG", country: "Sudan", value: "20q" },
      { name: "50 Qirsh", nativeName: "٥٠ قرش", diameter: 22.0, currency: "SDG", country: "Sudan", value: "50q" },
      { name: "1 Pound", nativeName: "١ جنيه", diameter: 25.0, currency: "SDG", country: "Sudan", value: "£1" },
    ],
  },
  {
    label: "Madagascar (MGA)",
    coins: [
      { name: "1 Ariary", diameter: 15.5, currency: "MGA", country: "Madagascar", value: "Ar1" },
      { name: "2 Ariary", diameter: 17.0, currency: "MGA", country: "Madagascar", value: "Ar2" },
      { name: "5 Ariary", diameter: 18.5, currency: "MGA", country: "Madagascar", value: "Ar5" },
      { name: "10 Ariary", diameter: 20.0, currency: "MGA", country: "Madagascar", value: "Ar10" },
      { name: "20 Ariary", diameter: 22.0, currency: "MGA", country: "Madagascar", value: "Ar20" },
      { name: "50 Ariary", diameter: 24.0, currency: "MGA", country: "Madagascar", value: "Ar50" },
    ],
  },
  {
    label: "Namibia (NAD)",
    coins: [
      { name: "5 Cents", diameter: 16.0, currency: "NAD", country: "Namibia", value: "5¢" },
      { name: "10 Cents", diameter: 19.0, currency: "NAD", country: "Namibia", value: "10¢" },
      { name: "50 Cents", diameter: 22.0, currency: "NAD", country: "Namibia", value: "50¢" },
      { name: "1 Dollar", diameter: 20.0, currency: "NAD", country: "Namibia", value: "$1" },
      { name: "5 Dollars", diameter: 23.0, currency: "NAD", country: "Namibia", value: "$5" },
      { name: "10 Dollars", diameter: 26.0, currency: "NAD", country: "Namibia", value: "$10" },
    ],
  },
  {
    label: "Angola (AOA)",
    coins: [
      { name: "50 Cêntimos", diameter: 17.0, currency: "AOA", country: "Angola", value: "50¢" },
      { name: "1 Kwanza", diameter: 20.0, currency: "AOA", country: "Angola", value: "Kz1" },
      { name: "2 Kwanzas", diameter: 22.0, currency: "AOA", country: "Angola", value: "Kz2" },
      { name: "5 Kwanzas", diameter: 24.0, currency: "AOA", country: "Angola", value: "Kz5" },
      { name: "10 Kwanzas", diameter: 26.0, currency: "AOA", country: "Angola", value: "Kz10" },
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
