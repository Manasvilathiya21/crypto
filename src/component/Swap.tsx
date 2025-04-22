"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { CurrencyDropdownModal } from "./CurrencyDropdownModal";
import { NetworkDropdownModal } from "./NetworkDropdownModal";

// Custom debounce function
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

type Currency = {
  name: string;
  code: string;
  symbol: string;
  flag?: string;
  icon?: string;
};

interface PayAndYouGetInputProps {
  isDarkMode: boolean;
  fiatCurrencies: Currency[];
  cryptoCurrencies: Currency[];
  networkOptions: Record<string, any[]>;
  cryptoToINR: Record<string, number>;
  onUpdateTransaction: (details: {
    payAmount: string;
    youGetAmount: string;
    selectedFiat: Currency;
    selectedCrypto: Currency;
    selectedNetwork: any;
    onrampFee: string;
    networkFeeInINR: string;
    totalFees: string;
  }) => void;
}

export default function Swap({
  isDarkMode,
  fiatCurrencies,
  cryptoCurrencies,
  networkOptions,
  cryptoToINR,
  onUpdateTransaction,
}: PayAndYouGetInputProps) {
  // State for inputs and selections
  const [payAmount, setPayAmount] = useState("1050");
  const [youGetValue, setYouGetValue] = useState("11.14");
  const [selectedFiat, setSelectedFiat] = useState<Currency>(fiatCurrencies[0]);
  const [selectedCrypto, setSelectedCrypto] = useState<Currency>(
    cryptoCurrencies[0]
  );
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [selectedCryptoForNetwork, setSelectedCryptoForNetwork] =
    useState<Currency | null>(null);

  // Debounced pay amount
  const debouncedPayAmount = useDebounce(payAmount, 500);

  // Calculation helper functions
  const calculateYouGetValue = (
    payAmount: string,
    cryptoPrice: number,
    totalFees: number
  ) => {
    const payAmountNum = parseFloat(payAmount);
    const youGetAmount = (payAmountNum - totalFees) / cryptoPrice;
    return youGetAmount.toFixed(4);
  };

  const calculatePayAmount = (
    youGetValue: string,
    cryptoPrice: number,
    networkFee: number
  ) => {
    const youGetNum = parseFloat(youGetValue);
    const payAmount = youGetNum * cryptoPrice + networkFee;
    return payAmount.toFixed(2);
  };

  // Calculate onramp fee
  const onrampFee = ((parseFloat(payAmount || "0") * 25) / 10000).toFixed(2);

  // Calculate network fee in INR
  const networkFeeInINR =
    selectedNetwork && selectedCrypto
      ? (
          parseFloat(selectedNetwork.fee) *
          (cryptoToINR[selectedCrypto.code] || 0)
        ).toFixed(2)
      : "0";

  // Calculate total fees
  const totalFees = (
    parseFloat(onrampFee) + parseFloat(networkFeeInINR || 0)
  ).toFixed(2);

  // Handler for pay amount input
  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove any non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const decimalParts = numericValue.split(".");
    const formattedValue =
      decimalParts.length > 2
        ? `${decimalParts[0]}.${decimalParts[1]}`
        : numericValue;

    // Set the formatted value
    setPayAmount(formattedValue);
  };

  // Handler for pay amount input key press
  const handlePayAmountKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Update calculation when Enter is pressed
    if (e.key === "Enter") {
      updateYouGetValue(payAmount);
    }
  };

  // Function to update you get value
  const updateYouGetValue = (value: string) => {
    // Ensure we have a valid numeric input
    const payAmountNum = parseFloat(value);
    if (isNaN(payAmountNum)) return;

    // Calculate you get value even if crypto or network is not selected
    if (selectedCrypto && selectedNetwork) {
      const inrValue = cryptoToINR[selectedCrypto.code] || 0;
      const networkFee = parseFloat(selectedNetwork.fee) || 0;

      // Calculate total fees
      const calculatedTotalFees =
        parseFloat(onrampFee) + parseFloat(networkFeeInINR || 0);

      // Calculate you get value based on new pay amount
      const calculatedYouGetValue = calculateYouGetValue(
        value,
        inrValue,
        calculatedTotalFees
      );
      setYouGetValue(calculatedYouGetValue);

      // Update parent component with transaction details
      onUpdateTransaction({
        payAmount: value,
        youGetAmount: calculatedYouGetValue,
        selectedFiat,
        selectedCrypto,
        selectedNetwork,
        onrampFee,
        networkFeeInINR,
        totalFees,
      });
    } else {
      // Fallback calculation if crypto or network is not selected
      const defaultInrValue = 94; // Using a default value
      const defaultTotalFees = 0;

      const calculatedYouGetValue = calculateYouGetValue(
        value,
        defaultInrValue,
        defaultTotalFees
      );
      setYouGetValue(calculatedYouGetValue);
    }
  };

  // Trigger you get value update when debounced pay amount changes
  useEffect(() => {
    if (debouncedPayAmount) {
      updateYouGetValue(debouncedPayAmount);
    }
  }, [debouncedPayAmount]);

  // Modal states
  const [showFiatModal, setShowFiatModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  // Dropdown states
  const [showFiatDropdown, setShowFiatDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // Search states
  const [searchFiat, setSearchFiat] = useState("");
  const [searchCrypto, setSearchCrypto] = useState("");

  // Refs for dropdowns
  const fiatDropdownRef = useRef<HTMLDivElement>(null);
  const cryptoDropdownRef = useRef<HTMLDivElement>(null);
  const fiatButtonRef = useRef<HTMLDivElement>(null);
  const cryptoButtonRef = useRef<HTMLDivElement>(null);

  // Handlers for modal selections
  const handleFiatSelect = (currency: Currency) => {
    setSelectedFiat(currency);
    setShowFiatModal(false);
  };

  const handleCryptoSelect = (currency: Currency) => {
    setSelectedCrypto(currency);
    setShowCryptoModal(false);

    // Always open network modal after selecting a crypto
    setSelectedCryptoForNetwork(currency);
    setShowNetworkModal(true);
  };

  const handleNetworkSelect = (network: any) => {
    setSelectedNetwork(network);
    setShowNetworkModal(false);
  };

  const openNetworkModal = (crypto: Currency) => {
    setSelectedCryptoForNetwork(crypto);
    setShowNetworkModal(true);
  };

  // Automatic calculations and updates
  useEffect(() => {
    if (selectedCrypto && selectedNetwork) {
      const inrValue = cryptoToINR[selectedCrypto.code] || 0;
      const networkFee = selectedNetwork.fee || 0;

      // Recalculate based on pay amount change
      const calculatedTotalFees =
        parseFloat(onrampFee) + parseFloat(networkFeeInINR || 0);
      const calculatedYouGetValue = calculateYouGetValue(
        payAmount,
        inrValue,
        calculatedTotalFees
      );
      setYouGetValue(calculatedYouGetValue);

      // Update parent component with transaction details
      onUpdateTransaction({
        payAmount,
        youGetAmount: calculatedYouGetValue,
        selectedFiat,
        selectedCrypto,
        selectedNetwork,
        onrampFee,
        networkFeeInINR,
        totalFees,
      });
    }
  }, [payAmount, selectedCrypto, selectedNetwork, cryptoToINR]);

  // Recalculate when you get value changes
  useEffect(() => {
    if (selectedCrypto && selectedNetwork) {
      const inrValue = cryptoToINR[selectedCrypto.code] || 0;
      const networkFee = selectedNetwork.fee || 0;

      // Recalculate based on you get value change
      const calculatedPayAmount = calculatePayAmount(
        youGetValue,
        inrValue,
        networkFee
      );
      setPayAmount(calculatedPayAmount);

      // Update parent component with transaction details
      onUpdateTransaction({
        payAmount: calculatedPayAmount,
        youGetAmount: youGetValue,
        selectedFiat,
        selectedCrypto,
        selectedNetwork,
        onrampFee,
        networkFeeInINR,
        totalFees,
      });
    }
  }, [youGetValue, selectedCrypto, selectedNetwork, cryptoToINR]);

  // Filtered lists for dropdowns
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

  // Dropdown close logic
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

  return (
    <div>
      {/* Pay Input Section */}
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
            value={payAmount}
            onChange={handlePayAmountChange}
            onKeyPress={handlePayAmountKeyPress}
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
              setShowFiatModal(true);
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

        {/* You Get Input Section */}
        <div className="mb-2">
          <p
            className={`text-base font-medium tracking-wide mb-2 ${
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
              className={`w-full ${
                isDarkMode
                  ? "bg-transparent text-2xl font-base text-white"
                  : "text-2xl font-base text-[#181A20]"
              } outline-none`}
            />
            <div
              ref={cryptoButtonRef}
              className="flex items-center cursor-pointer"
              onClick={() => {
                setShowCryptoModal(true);
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
        </div>
        <div className="flex justify-between mb-5">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-[#181A20]"
            }`}
          >
            1 {selectedCryptoForNetwork?.code} ≈ ₺ 91
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
      </div>

      {/* Modals */}
      {showFiatModal && (
        <CurrencyDropdownModal
          currencies={fiatCurrencies}
          isDarkMode={isDarkMode}
          onSelect={handleFiatSelect}
          onClose={() => setShowFiatModal(false)}
          type="fiat"
        />
      )}

      {showCryptoModal && (
        <CurrencyDropdownModal
          currencies={cryptoCurrencies}
          isDarkMode={isDarkMode}
          onSelect={handleCryptoSelect}
          onClose={() => setShowCryptoModal(false)}
          type="crypto"
        />
      )}

      {showNetworkModal && selectedCryptoForNetwork && (
        <NetworkDropdownModal
          networks={networkOptions[selectedCryptoForNetwork.code] || []}
          selectedCrypto={selectedCryptoForNetwork}
          isDarkMode={isDarkMode}
          onSelect={handleNetworkSelect}
          onClose={() => setShowNetworkModal(false)}
        />
      )}
    </div>
  );
}
