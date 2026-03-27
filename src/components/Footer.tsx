import { Link } from "react-router-dom";
import logoImg from "../assets/logo-footer.png"; // adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-[#B33D11] text-white pt-12 pb-6 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Logo and Description */}
        <div className="flex flex-col gap-4">
          <img
            src={logoImg}
            alt="KindDrop Logo"
            width={120}
            height={45}
            className="object-contain brightness-110"
          />
          <p className="text-sm leading-relaxed text-gray-200">
            Connecting donors with charities and individuals in need. Reduce
            waste, reuse items, build community.
          </p>
        </div>

        {/* Column 2: Platform */}
        <div>
          <h3 className="font-bold text-lg mb-4">Platform</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/donate" className="hover:underline">
                Donate Items
              </Link>
            </li>
            <li>
              <Link to="/browse" className="hover:underline">
                Browse Donations
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:underline">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="font-bold text-lg mb-4">Support</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h3 className="font-bold text-lg mb-4">Legal</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms Of Service
              </Link>
            </li>
            <li>
              <Link to="/cookie" className="hover:underline">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-gray-200">
        <p>© 2026 GiveFlow. Made with ❤ by Hong Sophaline & Thoeun Mary</p>
      </div>
    </footer>
  );
};

export default Footer;
