
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Inventory from "@/components/Inventory";
import Calendar from "@/components/Calendar";
import Settings from "@/components/Settings";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <InventoryProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster />
        </InventoryProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
