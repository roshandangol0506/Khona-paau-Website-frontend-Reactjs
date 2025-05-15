"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const GeneralSettingContext = createContext();

export const GeneralSettingProvider = ({ children }) => {
  const [generalSetting, setGeneralSetting] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGeneralSetting = async () => {
    try {
      const response = await fetch(`http://localhost:8001/generalsetting`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const setting = data.data;

      setGeneralSetting({
        name: setting.name || "",
        subtitle: setting.subtitle || "",
        description: setting.description || "",
        currency: setting.currency || "rs",
        timezone: setting.timezone || "kathmandu",
        maintenance_mode: setting.maintenance_mode ?? false,
      });

      if (setting.logo) {
        setLogoPreview(`http://localhost:8001/logo/${setting.logo}`);
      }
    } catch (error) {
      console.error("Error fetching General Setting:", error);
      setError("Failed to load General Setting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneralSetting();
  }, []);

  return (
    <GeneralSettingContext.Provider
      value={{ generalSetting, logoPreview, loading, error }}
    >
      {children}
    </GeneralSettingContext.Provider>
  );
};

export const useGeneralSetting = () => useContext(GeneralSettingContext);
