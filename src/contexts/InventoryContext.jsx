
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InventoryContext = createContext();

export const locations = [
  "ZITE CECE",
  "ZITE GYM",
  "Informática",
  "Auditorio",
  "TEC EDU",
  "En Uso"
];

export const categories = [
  "Interfaces de Audio",
  "Consolas de Audio",
  "Capturadoras de Video",
  "Bocinas",
  "Laptops",
  "Trípies",
  "Micrófonos",
  "Cámaras",
  "Drones",
  "Hubs",
  "Cables de Audio",
  "Cables de Video",
  "Adaptadores y Extensores",
  "Extensiones de Corriente",
  "Switcher y Splitters"
];

export const equipmentStates = [
  "Disponible",
  "En uso",
  "Dañado",
  "En reparación"
];

export function InventoryProvider({ children }) {
  const [equipment, setEquipment] = useState([]);
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [filters, setFilters] = useState({
    location: "all",
    category: "all",
    state: "all",
    search: "",
    startDate: null,
    endDate: null
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "equipment"));
      const equipmentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate?.() || new Date()
      }));
      setEquipment(equipmentData);
    } catch (error) {
      console.error("Error loading equipment:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive"
      });
    }
  };

  const addEquipment = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "equipment"), {
        ...data,
        lastUpdated: new Date()
      });
      const newEquipment = {
        id: docRef.id,
        ...data,
        lastUpdated: new Date()
      };
      setEquipment(prev => [...prev, newEquipment]);
      toast({
        title: "Éxito",
        description: "Equipo agregado correctamente"
      });
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el equipo",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateEquipment = async (id, data) => {
    try {
      await updateDoc(doc(db, "equipment", id), {
        ...data,
        lastUpdated: new Date()
      });
      setEquipment(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...data, lastUpdated: new Date() }
            : item
        )
      );
      toast({
        title: "Éxito",
        description: "Equipo actualizado correctamente"
      });
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteEquipment = async (id) => {
    try {
      await deleteDoc(doc(db, "equipment", id));
      setEquipment(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Éxito",
        description: "Equipo eliminado correctamente"
      });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el equipo",
        variant: "destructive"
      });
    }
  };

  const moveEquipment = async (id, newLocation) => {
    try {
      await updateEquipment(id, { location: newLocation });
      toast({
        title: "Éxito",
        description: "Equipo movido correctamente"
      });
    } catch (error) {
      console.error("Error moving equipment:", error);
      toast({
        title: "Error",
        description: "No se pudo mover el equipo",
        variant: "destructive"
      });
    }
  };

  const filterEquipment = (items) => {
    return items.filter(item => {
      const matchesSearch = filters.search
        ? item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.serialNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.inventoryNumber?.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesLocation = filters.location === "all" || item.location === filters.location;
      const matchesCategory = filters.category === "all" || item.category === filters.category;
      const matchesState = filters.state === "all" || item.state === filters.state;

      return matchesSearch && matchesLocation && matchesCategory && matchesState;
    });
  };

  const getEquipmentByDateRange = (startDate, endDate) => {
    return equipment.filter(item => {
      const itemDate = new Date(item.lastUpdated);
      return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    });
  };

  const exportInventory = (locationFilter = "all") => {
    try {
      let dataToExport = equipment;
      if (locationFilter !== "all") {
        dataToExport = equipment.filter(item => item.location === locationFilter);
      }

      const exportData = dataToExport.map(item => ({
        "Nombre": item.name,
        "Modelo": item.model,
        "Número de Serie": item.serialNumber,
        "Número de Inventario": item.inventoryNumber,
        "Estado": item.state,
        "Cantidad": item.quantity,
        "Categoría": item.category,
        "Ubicación": item.location,
        "Última Actualización": new Date(item.lastUpdated).toLocaleString('es-ES'),
        "Notas": item.notes || ""
      }));

      const fileName = locationFilter === "all" 
        ? "inventario_completo" 
        : `inventario_${locationFilter.toLowerCase()}`;

      switch (exportFormat) {
        case "xlsx": {
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Inventario");
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          break;
        }
        case "csv": {
          const ws = XLSX.utils.json_to_sheet(exportData);
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${fileName}.csv`;
          link.click();
          break;
        }
        case "pdf": {
          const doc = new jsPDF();
          doc.autoTable({
            head: [Object.keys(exportData[0])],
            body: exportData.map(Object.values),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 66, 66] }
          });
          doc.save(`${fileName}.pdf`);
          break;
        }
      }

      toast({
        title: "Exportación exitosa",
        description: "El inventario ha sido exportado exitosamente."
      });
    } catch (error) {
      console.error("Error exporting inventory:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar el inventario",
        variant: "destructive"
      });
    }
  };

  return (
    <InventoryContext.Provider value={{
      equipment,
      filters,
      setFilters,
      exportFormat,
      setExportFormat,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      moveEquipment,
      filterEquipment,
      exportInventory,
      getEquipmentByDateRange
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
