
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";

function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { exportFormat, setExportFormat } = useInventory();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h1 className={cn(
        "text-3xl font-bold mb-8",
        isDark ? "text-white" : "text-gray-800"
      )}>
        Configuración
      </h1>

      <div className={cn(
        "grid gap-8",
        isDark ? "text-white" : "text-gray-900"
      )}>
        <section className={cn(
          "p-6 rounded-lg shadow-lg",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          <h2 className="text-xl font-semibold mb-4">Preferencias de Visualización</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Modo Oscuro</span>
              <Button 
                variant="outline"
                onClick={toggleTheme}
                className={cn(
                  isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""
                )}
              >
                {isDark ? "Activado" : "Desactivado"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Animaciones</span>
              <Button 
                variant="outline"
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={cn(
                  isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : ""
                )}
              >
                {animationsEnabled ? "Activadas" : "Desactivadas"}
              </Button>
            </div>
          </div>
        </section>

        <section className={cn(
          "p-6 rounded-lg shadow-lg",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          <h2 className="text-xl font-semibold mb-4">Exportación</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Formato de Exportación</span>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className={cn(
                  "p-2 rounded-md border",
                  isDark 
                    ? "bg-gray-700 text-white border-gray-600 focus:border-gray-500" 
                    : "bg-white border-gray-300"
                )}
              >
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default Settings;
