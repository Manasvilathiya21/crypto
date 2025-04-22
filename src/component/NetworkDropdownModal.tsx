import { X } from "lucide-react";

type Currency = {
  name: string;
  code: string;
  symbol: string;
  flag?: string;
  icon?: string;
  desc?: string;
  fee?: string;
  minBuy?: string;
};

interface NetworkDropdownModalProps {
  networks: Currency[];
  selectedCrypto: Currency;
  isDarkMode: boolean;
  onSelect: (network: Currency) => void;
  onClose: () => void;
}
export function NetworkDropdownModal({
  networks,
  selectedCrypto,
  isDarkMode,
  onSelect,
  onClose,
}: NetworkDropdownModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        isDarkMode ? "bg-opacity-70" : "bg-opacity-30"
      }`}
    >
      <div
        className={`w-[95vw] max-w-md rounded-xl p-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Select {selectedCrypto.name} Network
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {networks.map((network) => (
            <div
              key={network.name}
              onClick={() => {
                onSelect(network);
                onClose();
              }}
              className={`flex items-center justify-between p-3 cursor-pointer hover:bg-opacity-10`}
            >
              <div className="flex items-center">
                <div className="mr-3 text-2xl">{selectedCrypto.icon}</div>
                <div>
                  <p className="font-medium">{network.name}</p>
                  <p className="text-sm text-gray-500">{network.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p>Fee: {network.fee}</p>
                <p className="text-sm text-gray-500">Min: {network.minBuy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
