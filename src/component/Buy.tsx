"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  MessageSquare,
  Search,
  X,
  Sun,
  Moon,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCcw,
  User,
  History,
  Languages,
  Banknote,
  ChevronUp,
  LogIn,
  Handshake,
  ShieldCheck,
} from "lucide-react";

const fiatCurrencies = [
  { name: "Indian Rupees", code: "INR", symbol: "₹", flag: "/img/ind.png" },
  { name: "Türk Lirasi", code: "TRY", symbol: "₺", flag: "/img/tru.png" },
  { name: "Mexican Peso", code: "MXN", symbol: "MXN", flag: "/img/mex.png" },
  { name: "Vietnamese Dong", code: "VND", symbol: "₫", flag: "/img/viet.png" },
  { name: "Nigerian Naira", code: "NGN", symbol: "₦", flag: "/img/nig.png" },
  { name: "Brazilian Real", code: "BRL", symbol: "R$", flag: "/img/round.png" },
  { name: "Peruvian Sol", code: "PEN", symbol: "S/.", flag: "/img/peru.png" },
];

const cryptoCurrencies = [
  { name: "Tether", code: "USDT", symbol: "USDT", icon: "💎" },
  { name: "Bitcoin", code: "BTC", symbol: "BTC", icon: "₿" },
  { name: "Ethereum", code: "ETH", symbol: "ETH", icon: "Ξ" },
  { name: "USD Coin", code: "USDC", symbol: "USDC", icon: "⓾" },
  { name: "Binance Coin", code: "BNB", symbol: "BNB", icon: "⚛" },
];

type Currency = {
  name: string;
  code: string;
  symbol: string;
  flag?: string;
  icon?: string;
};

export default function Buy() {
  const [amount, setAmount] = useState("1050");
  const [showFiatDropdown, setShowFiatDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [selectedFiat, setSelectedFiat] = useState<Currency>({
    name: "Indian Rupees",
    code: "INR",
    symbol: "₹",
    flag: "/img/ind.png",
  });
  const [selectedCrypto, setSelectedCrypto] = useState<Currency>({
    name: "Tether",
    code: "USDT",
    symbol: "USDT",
    icon: "💎",
  });
  const [searchFiat, setSearchFiat] = useState("");
  const [searchCrypto, setSearchCrypto] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fiatDropdownRef = useRef<HTMLDivElement>(null);
  const cryptoDropdownRef = useRef<HTMLDivElement>(null);
  const fiatButtonRef = useRef<HTMLDivElement>(null);
  const cryptoButtonRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [selectedCryptoForNetwork, setSelectedCryptoForNetwork] =
    useState<Currency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const networkOptions = {
    USDT: [
      {
        name: "ERC20",
        fee: "1.5",
        minBuy: "100",
        desc: "Ethereum Network",
      },
      { name: "TRC20", fee: "0.0001", minBuy: "50", desc: "Tron Network" },
      {
        name: "BEP20",
        fee: "0.00031",
        minBuy: "150",
        desc: "Binance Smart Chain",
      },
    ],
    BTC: [
      {
        name: "ERC20",
        fee: "0.000019",
        minBuy: "300",
        desc: "Ethereum Network",
      },
      {
        name: "BEP20",
        fee: "0.0000069",
        minBuy: "300",
        desc: "Binance Smart C...",
      },
      { name: "BTC", fee: "0.00003", minBuy: "420", desc: "Bitcoin" },
      { name: "KCC", fee: "0.00002", minBuy: "3100", desc: "KCC" },
      {
        name: "BTCLN",
        fee: "0.00002",
        minBuy: "300",
        desc: "Lightning Network",
      },
    ],
    ETH: [
      {
        name: "ERC20",
        fee: "0.00042",
        minBuy: "100",
        desc: "Ethereum Network",
      },
      {
        name: "BEP20",
        fee: "0.00031",
        minBuy: "150",
        desc: "Binance Smart C...",
      },
    ],
    USDC: [
      {
        name: "ERC20",
        fee: "0.00042",
        minBuy: "100",
        desc: "Ethereum Network",
      },
      { name: "TRC20", fee: "0.0001", minBuy: "50", desc: "Tron Network" },
      {
        name: "BEP20",
        fee: "0.00031",
        minBuy: "150",
        desc: "Binance Smart Chain",
      },
    ],
    BNB: [
      {
        name: "BEP20",
        fee: "0.00031",
        minBuy: "150",
        desc: "Binance Smart Chain",
      },
      {
        name: "ERC20",
        fee: "0.00042",
        minBuy: "100",
        desc: "Ethereum Network",
      },
    ],
  };
  const cryptoToINR = {
    USDT: 94,
    BTC: 6000000,
    ETH: 300000,
    USDC: 94,
    BNB: 25000,
  };
  const networkFeeInINR =
    selectedNetwork && selectedCrypto
      ? (
          parseFloat(selectedNetwork.fee) *
          (cryptoToINR[selectedCrypto.code] || 0)
        ).toFixed(2)
      : "0";
  const filteredFiat = fiatCurrencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchFiat.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchFiat.toLowerCase())
  );
  const filteredCrypto = cryptoCurrencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCrypto.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchCrypto.toLowerCase())
  );
  const handleSelectFiat = (currency: Currency) => {
    setSelectedFiat(currency);
    setShowFiatDropdown(false);
  };
  const handleSelectCrypto = (currency: Currency) => {
    setSelectedCrypto(currency);
    setShowCryptoDropdown(false);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showFiatDropdown &&
        fiatDropdownRef.current &&
        !fiatDropdownRef.current.contains(event.target as Node) &&
        !fiatButtonRef.current?.contains(event.target as Node)
      ) {
        setShowFiatDropdown(false);
      }
      if (
        showCryptoDropdown &&
        cryptoDropdownRef.current &&
        !cryptoDropdownRef.current.contains(event.target as Node) &&
        !cryptoButtonRef.current?.contains(event.target as Node)
      ) {
        setShowCryptoDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFiatDropdown, showCryptoDropdown]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // Add state for 'You get' value
  const [youGetValue, setYouGetValue] = useState("11.14");

  // Update Pay (amount) automatically when 'You get', selectedCrypto, or selectedNetwork changes
  useEffect(() => {
    if (selectedCrypto && selectedNetwork) {
      const inrValue =
        cryptoToINR[selectedCrypto.code as keyof typeof cryptoToINR] || 0;
      setAmount((parseFloat(youGetValue) * inrValue).toFixed(2));
    }
  }, [youGetValue, selectedCrypto, selectedNetwork]);

  // Calculate Onramp fee from Pay value
  const onrampFee = ((parseFloat(amount) * 25) / 10000).toFixed(2);
  // Calculate total fee (onrampFee + networkFeeInINR)
  const totalFees = (
    parseFloat(onrampFee) + parseFloat(networkFeeInINR || 0)
  ).toFixed(2);

  return (
    <div className="relative flex justify-center items-center bg-[#080808] p-4 h-screen">
      <div
        className={`w-full max-w-sm sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-md ${
          isDarkMode ? "bg-[#1F1F1F] text-white" : "bg-white text-[#181A20]"
        } rounded-xl overflow-hidden relative my-10 overflow-y-auto max-h-[68vh] hide-scrollbar p-6`}
        style={{ minWidth: 0 }}
      >
        {showSidebar && (
          <aside
            className={`absolute top-0 left-0 h-full w-72 ${
              isDarkMode
                ? "bg-[#181A20] text-white"
                : "bg-gray-50 text-[#181A20]"
            } rounded-r-xl shadow-xl z-20 flex flex-col overflow-y-auto animate-slide-in`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-[#23262F]" : "border-gray-200"
              }`}
            >
              <button
                onClick={toggleSidebar}
                className={`${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
              <div>
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`${
                    !isDarkMode ? "text-yellow-500" : "text-gray-400"
                  } hover:text-yellow-500 mr-2`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-gray-400"
                  } hover:text-blue-400`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="flex-1 p-2">
              <ul className="space-y-3">
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <ArrowDownLeft className="w-5 h-5 mr-3" />
                    Buy
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5 mr-3" />
                    Sell
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <Gift className="w-5 h-5 mr-3" />
                    Gift Cards
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <RefreshCcw className="w-5 h-5 mr-3" />
                    Swap
                  </button>
                </li>
              </ul>
              <hr className="my-3 border-gray-200" />
              <ul className="space-y-1">
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOrderHistoryOpen((v) => !v)}
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] justify-between ${
                      isDarkMode
                        ? "text-gray-400"
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <span className="flex items-center">
                      <History className="w-5 h-5 mr-3" />
                      Order History
                    </span>
                    {orderHistoryOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {orderHistoryOpen && (
                    <ul className="ml-10 mt-1 space-y-3 text-sm">
                      <li>
                        <button className="hover:underline">Buy Orders</button>
                      </li>
                      <li>
                        <button className="hover:underline">Sell Orders</button>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setLanguageOpen((v) => !v)}
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] justify-between ${
                      isDarkMode
                        ? "text-gray-400"
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <span className="flex items-center">
                      <Languages className="w-5 h-5 mr-3" />
                      Language
                    </span>
                    {languageOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {languageOpen && (
                    <ul className="ml-10 mt-1 space-y-3 text-sm">
                      <li>
                        <button className="hover:underline">English</button>
                      </li>
                      <li>
                        <button className="hover:underline">French</button>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <Gift className="w-5 h-5 mr-3" />
                    Refer
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <Banknote className="w-5 h-5 mr-3" />
                    Bank Accounts
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Login
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <Handshake className="w-5 h-5 mr-3" />
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className={`flex items-center w-full px-3 py-3 rounded-lg focus:bg-[#23262F] text-gray-400 ${
                      isDarkMode
                        ? ""
                        : "focus:bg-gray-400 text-gray-600 focus:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 mr-3" />
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
        )}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={toggleSidebar}
            className={`w-6 h-6 ${
              isDarkMode ? "text-white" : "text-[#181A20]"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <svg
                viewBox="0 0 24 24"
                fill={isDarkMode ? "white" : "#181A20"}
                className="w-full h-full"
              >
                <path d="M12 2L2 19.5h20L12 2z" />
              </svg>
            </div>
            <span
              className={`font-bold text-lg ${
                isDarkMode ? "" : "text-[#181A20]"
              }`}
            >
              Logo
            </span>
          </div>
          <MessageSquare
            className={`w-6 h-6 ${
              isDarkMode ? "text-white" : "text-[#181A20]"
            }`}
          />
        </div>
        <div className="p-4">
          <div className="mb-2">
            <p
              className={`text-base font-medium tracking-wide mb-2 ${
                isDarkMode ? "text-white" : "text-[#181A20]"
              }`}
            >
              Pay
            </p>
            <div
              className={`rounded-lg p-3 flex justify-between items-center mb-5 ${
                isDarkMode ? "bg-[#141414]" : "bg-gray-100"
              }`}
            >
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full ${
                  isDarkMode
                    ? "bg-transparent text-2xl font-base text-white"
                    : "text-2xl font-base text-[#181A20]"
                } outline-none`}
              />
              <div
                ref={fiatButtonRef}
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setShowFiatDropdown(!showFiatDropdown);
                  setShowCryptoDropdown(false);
                }}
              >
                <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedFiat.flag}
                    alt={selectedFiat.code + " flag"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mr-2">{selectedFiat.code}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFiatDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {showFiatDropdown && (
              <div
                ref={fiatDropdownRef}
                className={`absolute top-0 left-0 z-10 w-full h-full rounded-lg shadow-lg border overflow-hidden animate-slide-up ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800 text-white"
                    : "bg-white border-gray-200 text-[#181A20]"
                }`}
              >
                <div
                  className={`p-3 border-b border-gray-200 flex justify-between items-center ${
                    isDarkMode ? "" : "border-gray-200"
                  }`}
                >
                  <h2 className="font-bold">Select Fiat</h2>
                  <button
                    onClick={() => setShowFiatDropdown(false)}
                    className="text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className={`p-3 border-b border-gray-200`}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchFiat}
                      onChange={(e) => setSearchFiat(e.target.value)}
                      className={`w-full ${
                        isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-[#181A20]"
                      } rounded-lg py-2 pl-10 pr-3 text-sm outline-none`}
                    />
                  </div>
                </div>
                <div className={`p-3 border-b border-gray-200`}>
                  <p className="text-xs text-gray-400">
                    All Fiats ({filteredFiat.length})
                  </p>
                </div>
                <div className="max-h-90 overflow-y-auto hide-scrollbar">
                  {filteredFiat.map((currency) => (
                    <div
                      key={currency.code}
                      className={`flex items-center justify-between p-3 cursor-pointer border-b ${
                        isDarkMode
                          ? "hover:bg-gray-200 border-gray-800 text-gray-600"
                          : "hover:bg-gray-100 border-gray-200 text-[#181A20]"
                      }`}
                      onClick={() => handleSelectFiat(currency)}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          <img
                            src={currency.flag}
                            alt={currency.code + " flag"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{currency.name}</p>
                          <p className="text-xs text-gray-400">
                            {currency.symbol} - {currency.code}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-2">
              <p
                className={`text-base font-medium tracking-wid mb-2 ${
                  isDarkMode ? "text-white" : "text-[#181A20]"
                }`}
              >
                You get
              </p>
              <div
                className={`rounded-lg p-3 flex justify-between items-center ${
                  isDarkMode ? "bg-[#141414]" : "bg-gray-100"
                }`}
              >
                <input
                  type="text"
                  value={youGetValue}
                  onChange={(e) => setYouGetValue(e.target.value)}
                  className="text-2xl font-semibold bg-transparent outline-none w-24"
                />
                <div
                  ref={cryptoButtonRef}
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setShowCryptoDropdown(!showCryptoDropdown);
                    setShowFiatDropdown(false);
                  }}
                >
                  <div className="w-6 h-6 mr-2 rounded-full bg-teal-500 flex items-center justify-center">
                    <span className="text-xs">{selectedCrypto.icon}</span>
                  </div>
                  <span className="mr-2">{selectedCrypto.code}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showCryptoDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {showCryptoDropdown && (
                <div
                  ref={cryptoDropdownRef}
                  className={`absolute top-0 left-0 z-10 w-full h-full rounded-lg shadow-lg border overflow-y-auto animate-slide-up ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800 text-white"
                      : "bg-white border-gray-200 text-[#181A20]"
                  }`}
                >
                  <div
                    className={`p-3 border-b border-gray-800 flex justify-between items-center ${
                      isDarkMode ? "" : "border-gray-200"
                    }`}
                  >
                    <h2 className="font-bold">Select Crypto</h2>
                    <button
                      onClick={() => setShowCryptoDropdown(false)}
                      className="text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div
                    className={`p-3 border-b border-gray-800 ${
                      isDarkMode ? "" : "border-gray-200"
                    }`}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchCrypto}
                        onChange={(e) => setSearchCrypto(e.target.value)}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-[#181A20]"
                        } rounded-lg py-3 pl-10 pr-3 text-sm outline-none`}
                      />
                    </div>
                  </div>
                  <div className={`p-3 border-b border-gray-200`}>
                    <p className="text-xs text-gray-400">
                      All Cryptocurrencies ({filteredCrypto.length})
                    </p>
                  </div>
                  <div className="max-h-90 overflow-y-auto hide-scrollbar">
                    {filteredCrypto.map((currency) => (
                      <div
                        key={currency.code}
                        className={`flex items-center justify-between p-3 cursor-pointer border-b ${
                          isDarkMode
                            ? "hover:bg-gray-800 border-gray-800 text-white"
                            : "hover:bg-gray-100 border-gray-200 text-[#181A20]"
                        }`}
                        onClick={() => {
                          setSelectedCryptoForNetwork(currency);
                          setShowNetworkDropdown(true);
                          setShowCryptoDropdown(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-2">
                            <span>{currency.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {currency.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {currency.symbol}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showNetworkDropdown && selectedCryptoForNetwork && (
                <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
                  <div className="bg-[#181A20] rounded-xl shadow-xl w-[95vw] max-w-lg p-6 relative animate-fade-in text-white">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-white"
                      onClick={() => setShowNetworkDropdown(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">
                        {selectedCryptoForNetwork.icon}
                      </span>
                      <span className="font-bold text-lg mr-2">
                        {selectedCryptoForNetwork.name}
                      </span>
                    </div>
                    <div className="mb-2 font-semibold">
                      Select blockchain network
                    </div>
                    <div className="mb-4 text-xs text-gray-400">
                      Ensure that you use the same network on the other end.
                    </div>
                    <div className="mb-2 text-blue-400 cursor-pointer text-sm mb-5">
                      What's this?
                    </div>
                    <div className="flex font-bold text-xs mb-2 border-b border-gray-700 pb-5">
                      <div className="w-2/5 text-gray-400">Network</div>
                      <div className="w-1/3 text-gray-400">
                        Network fee <br />({selectedCryptoForNetwork.code})
                      </div>
                      <div className="w-1/3 text-gray-400">
                        Min Buy <br /> (IND)
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto hide-scrollbar divide-y divide-gray-700">
                      {(
                        networkOptions[selectedCryptoForNetwork.code] || []
                      ).map((net) => (
                        <div
                          key={net.name}
                          className="flex items-center py-3 cursor-pointer hover:bg-gray-800 rounded-lg px-2"
                          onClick={() => {
                            setSelectedCrypto(selectedCryptoForNetwork);
                            setSelectedNetwork(net);
                            setShowNetworkDropdown(false);
                          }}
                        >
                          <div className="w-2/5 flex items-center">
                            <span className="bg-[#23262F] rounded-full p-2 mr-2">
                              {selectedCryptoForNetwork.icon}
                            </span>
                            <div>
                              <div className="font-semibold text-sm">
                                {net.name}
                              </div>
                              <div className="text-xs text-gray-400 truncate w-24">
                                {net.desc}
                              </div>
                            </div>
                          </div>
                          <div className="w-1/3 font-mono">{net.fee}</div>
                          <div className="w-1/3 font-mono">{net.minBuy}</div>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mb-5">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-[#181A20]"
                }`}
              >
                1 {selectedCryptoForNetwork?.code} ≈ ₺ 94
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-[#181A20]"
                }`}
              >
                {selectedNetwork
                  ? `${selectedNetwork.name} · Network fee ₹${selectedNetwork.fee}`
                  : ""}
              </p>
            </div>
            <div
              className={`rounded-lg overflow-hidden mb-10 py-2 ${
                isDarkMode ? "bg-[#141414]" : "bg-gray-100"
              }`}
            >
              <div
                className={`p-3 flex justify-between items-center cursor-pointer ${
                  isDarkMode ? "" : "text-[#181A20]"
                }`}
              >
                <span
                  className={`${isDarkMode ? "text-white" : "text-[#181A20]"}`}
                >
                  You pay {selectedFiat.symbol} 1,050 including fees
                </span>
                <button
                  className={`${isDarkMode ? "text-white" : "text-[#181A20]"}`}
                  onClick={() => setShowPreviewModal(true)}
                >
                  Preview
                </button>
              </div>
            </div>
            <button
              className={`w-full font-medium py-3 rounded-lg transition mb-10 ${
                isDarkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-400 hover:bg-blue-500 text-white"
              }`}
            >
              Proceed
            </button>
            <div
              className={`flex items-center justify-center text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <span className="w-4 h-4 mr-2 text-green-500">✓</span>
              <span>Onramp is registered with FIU-IND in India</span>
            </div>
          </div>
        </div>
        {showPreviewModal && (
          <div
            className={`absolute inset-0 z-40 flex items-center justify-center bg-black opacity-90 ${
              isDarkMode ? "bg-black" : "bg-gray-100"
            }`}
          >
            <div
              className={`bg-black rounded-2xl shadow-xl w-[40vw] max-w-xs p-6 relative animate-fade-in ${
                isDarkMode ? "bg-black" : "bg-gray-100"
              }`}
            >
              <button
                className="absolute top-3 right-3 text-gray-400"
                onClick={() => setShowPreviewModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex justify-center items-center mb-4">
                <img
                  src={selectedFiat.flag}
                  alt={selectedFiat.code + " flag"}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span className="font-semibold text-lg mr-2">
                  {selectedFiat.code}
                </span>
                <span className="mx-2">→</span>
                <span className="text-2xl mr-2">{selectedCrypto.icon}</span>
                <span className="font-semibold text-lg">
                  {selectedCrypto.code}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Onramp fee</span>
                  <span>₹ {onrampFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blockchain Fee</span>
                  <span>₹ {networkFeeInINR}</span>
                </div>
                <div className="flex justify-end text-xs text-gray-400">
                  {selectedNetwork
                    ? `(${selectedNetwork.fee} ${selectedCrypto.code})`
                    : ""}
                </div>
                <div className="flex justify-between">
                  <span>Payment gateway fee</span>
                  <span>MXN 1.5</span>
                </div>
                <hr className="my-2 border-dashed border-gray-300" />
                <div className="flex justify-between font-semibold">
                  <span>Total fee</span>
                  <span>₹ {totalFees}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
