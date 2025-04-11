
import React from "react";
import { motion } from "framer-motion";
import { useInventory } from "@/contexts/InventoryContext";
import { locations, categories, equipmentStates } from "@/contexts/InventoryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const LOCATION_COLORS = {
  "ZITE CECE": "#FF6B6B",
  "ZITE GYM": "#4ECDC4",
  "Informática": "#45B7D1",
  "Auditorio": "#96CEB4",
  "TEC EDU": "#FFEEAD",
  "En Uso": "#D4A5A5"
};

const CATEGORY_COLORS = {
  "Interfaces de Audio": "#FF9F1C",
  "Capturadoras de Video": "#E71D36",
  "Bocinas": "#2EC4B6",
  "Laptops": "#011627",
  "Trípies": "#3772FF",
  "Micrófonos": "#DF2935",
  "Cámaras": "#FDCA40",
  "Drones": "#087E8B",
  "Hubs": "#FF5A5F",
  "Cables de Audio": "#C1839F",
  "Cables de Video": "#1B998B",
  "Adaptadores y Extensores": "#2D3047",
  "Extensiones de Corriente": "#FF9F1C",
  "Switcher y Splitters": "#E71D36"
};

const STATE_COLORS = {
  "Disponible": "#4CAF50",
  "En uso": "#2196F3",
  "Dañado": "#F44336",
  "En reparación": "#FF9800"
};

function Dashboard() {
  const { equipment } = useInventory();
  const { isDark } = useTheme();

  const locationData = locations.map(location => ({
    name: location,
    cantidad: equipment.filter(item => item.location === location).length
  }));

  const categoryData = categories.map(category => ({
    name: category,
    cantidad: equipment.filter(item => item.category === category).length
  }));

  const stateData = equipmentStates.map(state => ({
    name: state,
    cantidad: equipment.filter(item => item.state === state).length
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "p-3 rounded-lg shadow-lg",
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        )}>
          <p className="font-semibold">{label}</p>
          <p>Cantidad: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

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
        Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Ubicaciones */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-6 rounded-lg shadow-lg",
            isDark ? "bg-gray-800" : "bg-white"
          )}
        >
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            isDark ? "text-white" : "text-gray-800"
          )}>
            Equipos por Ubicación
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: isDark ? "#fff" : "#000" }}
                />
                <YAxis tick={{ fill: isDark ? "#fff" : "#000" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad">
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={LOCATION_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico de Estados */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-6 rounded-lg shadow-lg",
            isDark ? "bg-gray-800" : "bg-white"
          )}
        >
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            isDark ? "text-white" : "text-gray-800"
          )}>
            Estado de Equipos
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stateData}
                  dataKey="cantidad"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico de Categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-lg shadow-lg lg:col-span-2",
            isDark ? "bg-gray-800" : "bg-white"
          )}
        >
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            isDark ? "text-white" : "text-gray-800"
          )}>
            Equipos por Categoría
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={categoryData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis type="number" tick={{ fill: isDark ? "#fff" : "#000" }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: isDark ? "#fff" : "#000" }}
                  width={140}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
