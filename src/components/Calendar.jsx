
import React from "react";
import { motion } from "framer-motion";
import { useInventory } from "@/contexts/InventoryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function Calendar() {
  const { equipment } = useInventory();
  const { isDark } = useTheme();

  // Agrupar equipos por fecha de actualización
  const groupedByDate = equipment.reduce((acc, item) => {
    const date = new Date(item.lastUpdated).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Convertir a formato para el gráfico
  const chartData = Object.entries(groupedByDate).map(([date, items]) => ({
    date,
    actualizaciones: items.length
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

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
        Calendario de Actualizaciones
      </h1>

      <div className={cn(
        "p-6 rounded-lg shadow-lg",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <h2 className={cn(
          "text-xl font-semibold mb-4",
          isDark ? "text-white" : "text-gray-800"
        )}>
          Actividad de Inventario
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: isDark ? "#fff" : "#000" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: isDark ? "#fff" : "#000" }}
                label={{ 
                  value: 'Actualizaciones', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: isDark ? "#fff" : "#000"
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: isDark ? "#fff" : "#000"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actualizaciones" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={cn(
        "grid gap-4",
        isDark ? "text-white" : "text-gray-900"
      )}>
        {Object.entries(groupedByDate).reverse().map(([date, items]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "p-4 rounded-lg shadow-md",
              isDark ? "bg-gray-800" : "bg-white"
            )}
          >
            <h3 className="text-lg font-semibold mb-2">{date}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-2 rounded",
                    isDark ? "bg-gray-700" : "bg-gray-50"
                  )}
                >
                  <p className="font-medium">{item.name}</p>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    {item.location} - {item.category}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Calendar;
