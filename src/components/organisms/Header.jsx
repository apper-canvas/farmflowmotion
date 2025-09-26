import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/contexts/AuthContext";
const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Farms", href: "/farms", icon: "MapPin" },
    { name: "Crops", href: "/crops", icon: "Wheat" },
    { name: "Rotation", href: "/rotation", icon: "RotateCcw" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Weather", href: "/weather", icon: "CloudSun" },
    { name: "Finances", href: "/finances", icon: "DollarSign" }
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg border-b border-primary-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-primary-100 transition-colors duration-200">
              <div className="bg-gradient-to-br from-white/20 to-white/10 p-2 rounded-lg backdrop-blur">
                <ApperIcon name="Leaf" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold">FarmFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white/20 text-white shadow-lg backdrop-blur"
                    : "text-primary-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.name}
              </Link>
            ))}
          </nav>

{/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-primary-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-700/95 backdrop-blur border-t border-primary-400">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-primary-100 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="text-primary-100 border-primary-100 hover:bg-white/10 hover:text-white"
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  );
}

export default Header;