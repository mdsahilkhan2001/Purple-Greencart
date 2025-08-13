import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons
import logo from "../assets/images.png"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Dashboard", path: "/" },
        { name: "Simulation", path: "/simulation" },
        { name: "Drivers", path: "/drivers" },
        { name: "Routes", path: "/routes" },
        { name: "Orders", path: "/orders" },
    ];

    return (
        <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="GreenCart Logo" className="h-14 w-auto" />
                        <span className="text-white font-bold text-lg">GreenCart</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${location.pathname === link.path
                                        ? "bg-green-500 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition ${location.pathname === link.path
                                        ? "bg-green-500 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
