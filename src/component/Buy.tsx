"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import React from "react";
import {
  ChevronDown,
  Menu,
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
  MessageSquare,
} from "lucide-react";
import Swap from "./Swap";

type Currency = {
  name: string;
  code: string;
  symbol: string;
  flag?: string;
  icon?: string;
};

export default function Buy({
  isDarkMode,
  fiatCurrencies: propFiatCurrencies,
  cryptoCurrencies: propCryptoCurrencies,
  networkOptions,
  cryptoToINR,
  onUpdateTransaction,
}: any) {
  // Define default currencies if not provided
  const fiatCurrencies = propFiatCurrencies || [
    { name: "Indian Rupees", code: "INR", symbol: "₹", flag: "/img/ind.png" },
    { name: "Türk Lirasi", code: "TRY", symbol: "₺", flag: "/img/tru.png" },
    { name: "Mexican Peso", code: "MXN", symbol: "MXN", flag: "/img/mex.png" },
    {
      name: "Vietnamese Dong",
      code: "VND",
      symbol: "₫",
      flag: "/img/viet.png",
    },
    { name: "Nigerian Naira", code: "NGN", symbol: "₦", flag: "/img/nig.png" },
    {
      name: "Brazilian Real",
      code: "BRL",
      symbol: "R$",
      flag: "/img/round.png",
    },
    { name: "Peruvian Sol", code: "PEN", symbol: "S/.", flag: "/img/peru.png" },
  ];

  const cryptoCurrencies = propCryptoCurrencies || [
    { name: "Tether", code: "USDT", symbol: "USDT", icon: "💎" },
    { name: "Bitcoin", code: "BTC", symbol: "BTC", icon: "₿" },
    { name: "Ethereum", code: "ETH", symbol: "ETH", icon: "Ξ" },
    { name: "USD Coin", code: "USDC", symbol: "USDC", icon: "⓾" },
    { name: "Binance Coin", code: "BNB", symbol: "BNB", icon: "⚛" },
  ];

  const [amount, setAmount] = useState<string>(() => {
    return "1050";
  });

  const [youGetValue, setYouGetValue] = useState<string>(() => {
    return "11.14";
  });

  const [selectedFiat, setSelectedFiat] = useState<Currency>(() => {
    return fiatCurrencies.length > 0 ? fiatCurrencies[0] : undefined;
  });

  const [selectedCrypto, setSelectedCrypto] = useState<Currency>(() => {
    return cryptoCurrencies.length > 0 ? cryptoCurrencies[0] : undefined;
  });

  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);

  useEffect(() => {
    if (selectedNetwork === null && networkOptions) {
      const firstCrypto = Object.keys(networkOptions)[0];
      setSelectedNetwork(networkOptions[firstCrypto][0]);
    }
  }, []);

  const handleTransactionUpdate = useCallback((details) => {
    if (details) {
      setAmount(details.payAmount || amount);
      setYouGetValue(details.youGetAmount || youGetValue);

      if (details.selectedFiat) setSelectedFiat(details.selectedFiat);
      if (details.selectedCrypto) setSelectedCrypto(details.selectedCrypto);
      if (details.selectedNetwork) setSelectedNetwork(details.selectedNetwork);
    }

    console.log("Transaction Details:", details);
  }, []);

  const calculateTotalFees = useMemo(() => {
    const onrampFee = ((parseFloat(amount) * 25) / 10000).toFixed(2);
    const networkFeeInINR =
      selectedNetwork && selectedCrypto
        ? (
            parseFloat(selectedNetwork.fee) *
            (cryptoToINR[selectedCrypto.code] || 0)
          ).toFixed(2)
        : "0";

    return {
      onrampFee,
      networkFeeInINR,
      totalFees: (
        parseFloat(onrampFee) + parseFloat(networkFeeInINR || 0)
      ).toFixed(2),
    };
  }, [amount, selectedNetwork, selectedCrypto, cryptoToINR]);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const networkFeeInINR = calculateTotalFees.networkFeeInINR;
  const totalFees = calculateTotalFees.totalFees;

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
                  onClick={() => isDarkMode(false)}
                  className={`${
                    !isDarkMode ? "text-yellow-500" : "text-gray-400"
                  } hover:text-yellow-500 mr-2`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => isDarkMode(true)}
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
        <Swap
          isDarkMode={isDarkMode}
          fiatCurrencies={fiatCurrencies}
          cryptoCurrencies={cryptoCurrencies}
          networkOptions={networkOptions}
          cryptoToINR={cryptoToINR}
          onUpdateTransaction={handleTransactionUpdate}
        />
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
            <span className={`${isDarkMode ? "text-white" : "text-[#181A20]"}`}>
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
                  <span>₹ {calculateTotalFees.onrampFee}</span>
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
