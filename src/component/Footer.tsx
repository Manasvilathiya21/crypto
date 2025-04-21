import {
  BsFacebook,
  BsLinkedin,
  BsTelegram,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D10] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8">
        {/* Link Sections */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Company */}
          <div>
            <h4 className="text-blue-400 text-lg font-semibold mb-6 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-base text-gray-300">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Partnerships</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">News & Updates</a>
              </li>
              <li>
                <a href="#">Media Assets</a>
              </li>
            </ul>
          </div>
          {/* Features */}
          <div>
            <h4 className="text-blue-400 text-lg font-semibold mb-6 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2 text-base text-gray-300">
              <li>
                <a href="#">Supported Tokens</a>
              </li>
              <li>
                <a href="#">Experience</a>
              </li>
            </ul>
          </div>
          {/* Help */}
          <div>
            <h4 className="text-blue-400 text-lg font-semibold mb-6 uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2 text-base text-gray-300">
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">System Health</a>
              </li>
              <li>
                <a href="#">Channel Verification</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media + App Buttons */}
        <div className="md:col-span-2 flex flex-col items-center md:items-end space-y-4">
          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-6 grid grid-cols-3">
            <BsTwitterX className="w-8 h-8" />
            <BsYoutube className="w-8 h-8" />
            <BsLinkedin className="w-8 h-8" />
            <BsTelegram className="w-8 h-8" />
            <BsFacebook className="w-8 h-8" />
            {/* <BsDapp className="w-8 h-8" /> */}
          </div>

          {/* App Store Buttons */}
          <div className="flex space-x-4 mt-10">
            <img src="/img/playstore.svg" alt="Google Play" className="h-10" />
            <img src="/img/appstore.svg" alt="App Store" className="h-10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
