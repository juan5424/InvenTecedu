
import React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";
import { locations, categories, equipmentStates } from "@/contexts/InventoryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import EquipmentForm from "@/components/EquipmentForm";
import EquipmentList from "@/components/EquipmentList";

function Inventory() {
  const { 
    equipment,
    filters,
    setFilters,
    filterEquipment,
    exportInventory
  } = useInventory();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const { isDark } = useTheme();

  const filteredEquipment = filterEquipment(equipment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-3xl font-bold",
          isDark ? "text-white" : "text-gray-800"
        )}>
          Inventario
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => exportInventory(filters.location)}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Equipo
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, modelo, número de serie o inventario..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-md",
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className={cn(
              "p-2 rounded-md",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            )}
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="all">Todas las ubicaciones</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            className={cn(
              "p-2 rounded-md",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            )}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            className={cn(
              "p-2 rounded-md",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            )}
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          >
            <option value="all">Todos los estados</option>
            {equipmentStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      <EquipmentList equipment={filteredEquipment} />

      <EquipmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </motion.div>
  );
}

export default Inventory;
