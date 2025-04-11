
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package2, 
  Sun, 
  Moon, 
  Calendar,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Package2, label: "Inventario", path: "/inventory" },
    { icon: Calendar, label: "Calendario", path: "/calendar" },
    { icon: Settings, label: "Configuración", path: "/settings" }
  ];

  return (
    <div className={cn(
      "flex h-screen",
      isDark ? "bg-gray-900" : "bg-gray-100"
    )}>
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        className={cn(
          "w-64 shadow-lg",
          isDark ? "bg-gray-800" : "bg-white"
        )}
      >
        <div className="p-6">
          <h1 className={cn(
            "text-2xl font-bold",
            isDark ? "text-white" : "text-gray-800"
          )}>
            Inventario TecEdu
          </h1>
        </div>
        <nav className="mt-6">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex items-center w-full px-6 py-3 transition-colors",
                isDark
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-50",
                location.pathname === path && (
                  isDark
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-blue-600"
                )
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-full",
              isDark ? "border-gray-600" : "border-gray-200"
            )}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.aside>
      <main className={cn(
        "flex-1 overflow-auto p-8",
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      )}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
