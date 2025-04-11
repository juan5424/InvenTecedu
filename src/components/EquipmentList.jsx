
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import EquipmentForm from "@/components/EquipmentForm";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

function EquipmentList({ equipment }) {
  const { deleteEquipment, moveEquipment } = useInventory();
  const [editingEquipment, setEditingEquipment] = useState(null);
  const { isDark } = useTheme();
  
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveEquipment(active.id, over.data.current.location);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4">
          {equipment.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-4 rounded-lg shadow-md",
                isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              )}
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Modelo: {item.model}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Serie: {item.serialNumber}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Inventario: {item.inventoryNumber}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Estado: {item.state}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Cantidad: {item.quantity}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Categoría: {item.category}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                        Ubicación: {item.location}
                      </p>
                      <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-500")}>
                        Última actualización: {formatDate(item.lastUpdated)}
                      </p>
                      {item.notes && (
                        <p className={cn("mt-2", isDark ? "text-gray-300" : "text-gray-600")}>
                          Notas: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingEquipment(item)}
                        className={isDark ? "border-gray-600" : ""}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteEquipment(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </DndContext>

      {editingEquipment && (
        <EquipmentForm
          isOpen={!!editingEquipment}
          onClose={() => setEditingEquipment(null)}
          editingEquipment={editingEquipment}
        />
      )}
    </div>
  );
}

export default EquipmentList;
