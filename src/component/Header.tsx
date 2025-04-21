"use client";
import React, { useState } from "react";

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">Logo</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#home" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#kyc" className="text-gray-700 hover:text-blue-600">
            KYC
          </a>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              More ▾
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <a
                  href="#support"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Support
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </a>
              </div>
            )}
          </div>
          <a
            href="#kyc"
            className="text-gray-700 hover:text-blue-600 text-base font-semibold"
          >
            <button className="bg-[#DCE6FE] rounded-lg px-4 py-2">Buy</button>
          </a>
          <a
            href="#kyc"
            className="text-gray-700 hover:text-blue-600 text-base font-semibold"
          >
            <button className="bg-[#DCE6FE] rounded-lg px-4 py-2">Sell</button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
          <a href="#home" className="block text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#buy" className="block text-gray-700 hover:text-blue-600">
            Buy
          </a>
          <a href="#kyc" className="block text-gray-700 hover:text-blue-600">
            KYC
          </a>
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              More ▾
            </button>
            {isDropdownOpen && (
              <div className="mt-1 ml-4 space-y-1">
                <a
                  href="#support"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Support
                </a>
                <a
                  href="#settings"
                  className="block text-gray-600 hover:text-blue-600"
                >
                  Settings
                </a>
              </div>
            )}
          </div>
          <a
            href="#kyc"
            className="text-gray-700 hover:text-blue-600 text-base font-semibold block"
          >
            <button className="bg-[#DCE6FE] rounded-lg px-4 py-2  w-full">
              Buy
            </button>
          </a>
          <a
            href="#kyc"
            className="text-gray-700 hover:text-blue-600 text-base font-semibold block"
          >
            <button className="bg-[#DCE6FE] rounded-lg px-4 py-2 w-full">
              Sell
            </button>
          </a>
        </div>
      )}
    </nav>
  );
}
