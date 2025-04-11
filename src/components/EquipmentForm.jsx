
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";
import { locations, categories, equipmentStates } from "@/contexts/InventoryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

function EquipmentForm({ isOpen, onClose, editingEquipment = null }) {
  const { addEquipment, updateEquipment } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { isDark } = useTheme();

  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "El nombre es requerido";
    if (!data.model?.trim()) errors.model = "El modelo es requerido";
    if (!data.serialNumber?.trim()) errors.serialNumber = "El número de serie es requerido";
    if (!data.inventoryNumber?.trim()) errors.inventoryNumber = "El número de inventario es requerido";
    if (!data.category) errors.category = "La categoría es requerida";
    if (!data.location) errors.location = "La ubicación es requerida";
    if (!data.state) errors.state = "El estado es requerido";
    if (data.quantity < 1) errors.quantity = "La cantidad debe ser mayor a 0";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formData = new FormData(e.target);
      const equipmentData = {
        name: formData.get("name")?.trim(),
        model: formData.get("model")?.trim(),
        serialNumber: formData.get("serialNumber")?.trim(),
        inventoryNumber: formData.get("inventoryNumber")?.trim(),
        quantity: parseInt(formData.get("quantity")),
        category: formData.get("category"),
        location: formData.get("location"),
        state: formData.get("state"),
        notes: formData.get("notes")?.trim()
      };

      const errors = validateForm(equipmentData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      if (editingEquipment) {
        await updateEquipment(editingEquipment.id, equipmentData);
      } else {
        await addEquipment(equipmentData);
      }
      onClose();
    } catch (error) {
      console.error("Error en el formulario:", error);
      setFormErrors({
        submit: "Hubo un error al procesar el formulario. Por favor, intente nuevamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formClasses = cn(
    "space-y-4",
    isDark ? "text-white" : "text-gray-900"
  );

  const inputClasses = cn(
    "w-full p-2 border rounded",
    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className={cn(
              "text-xl font-semibold",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {editingEquipment ? "Editar Equipo" : "Agregar Nuevo Equipo"}
            </Dialog.Title>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {formErrors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {formErrors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Equipo</label>
              <input
                name="name"
                defaultValue={editingEquipment?.name}
                className={cn(inputClasses, formErrors.name && "border-red-500")}
                required
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Modelo</label>
              <input
                name="model"
                defaultValue={editingEquipment?.model}
                className={cn(inputClasses, formErrors.model && "border-red-500")}
                required
              />
              {formErrors.model && <p className="text-red-500 text-sm mt-1">{formErrors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de Serie</label>
              <input
                name="serialNumber"
                defaultValue={editingEquipment?.serialNumber}
                className={cn(inputClasses, formErrors.serialNumber && "border-red-500")}
                required
              />
              {formErrors.serialNumber && <p className="text-red-500 text-sm mt-1">{formErrors.serialNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de Inventario</label>
              <input
                name="inventoryNumber"
                defaultValue={editingEquipment?.inventoryNumber}
                className={cn(inputClasses, formErrors.inventoryNumber && "border-red-500")}
                required
              />
              {formErrors.inventoryNumber && <p className="text-red-500 text-sm mt-1">{formErrors.inventoryNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="state"
                defaultValue={editingEquipment?.state || "Disponible"}
                className={cn(inputClasses, formErrors.state && "border-red-500")}
                required
              >
                {equipmentStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                name="quantity"
                defaultValue={editingEquipment?.quantity || 1}
                min="1"
                className={cn(inputClasses, formErrors.quantity && "border-red-500")}
                required
              />
              {formErrors.quantity && <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                name="category"
                defaultValue={editingEquipment?.category}
                className={cn(inputClasses, formErrors.category && "border-red-500")}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ubicación</label>
              <select
                name="location"
                defaultValue={editingEquipment?.location}
                className={cn(inputClasses, formErrors.location && "border-red-500")}
                required
              >
                <option value="">Seleccione una ubicación</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                name="notes"
                defaultValue={editingEquipment?.notes}
                className={inputClasses}
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? "Guardando..." 
                  : editingEquipment 
                    ? "Guardar Cambios" 
                    : "Agregar Equipo"
                }
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EquipmentForm;
