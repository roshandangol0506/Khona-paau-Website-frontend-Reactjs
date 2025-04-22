"use client";
import { createContext, useContext, useState } from "react";

const DashboardContext = createContext({
  stats: {
    products: 0,
    team: 0,
    reviews: 0,
    orders: 0,
    revenue: 0,
  },
  updateStats: () => {},
});

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState({
    products: 0,
    team: 0,
    reviews: 0,
    orders: 0,
    revenue: 0,
  });

  const updateStats = (newStats) => {
    setStats((prevStats) => ({
      ...prevStats,
      ...newStats,
    }));
  };

  return (
    <DashboardContext.Provider value={{ stats, updateStats }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
