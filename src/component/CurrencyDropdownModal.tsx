// CurrencyDropdownModal.tsx
import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';

type Currency = {
  name: string;
  code: string;
  symbol: string;
  flag?: string;
  icon?: string;
};

interface CurrencyDropdownModalProps {
  currencies: Currency[];
  isDarkMode: boolean;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
  type: 'fiat' | 'crypto';
}

export function CurrencyDropdownModal({
  currencies,
  isDarkMode,
  onSelect,
  onClose,
  type
}: CurrencyDropdownModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        isDarkMode ? 'bg-opacity-70' : 'bg-opacity-30'
      }`}
    >
      <div 
        className={`w-[95vw] max-w-md rounded-xl p-4 ${
          isDarkMode ? 'bg-[#1F1F1F] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Select {type === 'fiat' ? 'Fiat' : 'Cryptocurrency'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-black'
            }`}
          />
        </div>

        {/* Currency List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.code}
              onClick={() => {
                onSelect(currency);
                onClose();
              }}
              className={`flex items-center justify-between p-3 cursor-pointer hover:bg-opacity-10 ${
                isDarkMode 
                  ? 'hover:bg-white' 
                  : 'hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center">
                {currency.flag && (
                  <img 
                    src={currency.flag} 
                    alt={`${currency.name} flag`} 
                    className="w-8 h-8 rounded-full mr-3" 
                  />
                )}
                {currency.icon && (
                  <div className="mr-3 text-2xl">{currency.icon}</div>
                )}
                <div>
                  <p className="font-medium">{currency.name}</p>
                  <p className="text-sm text-gray-500">{currency.code}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

