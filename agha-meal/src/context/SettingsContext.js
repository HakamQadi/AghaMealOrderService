import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSettings } from "../services/api";
import { DEFAULT_CURRENCY, formatMoney } from "../utils/currency";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const FALLBACK = {
  currency: DEFAULT_CURRENCY,
  delivery: { fee: 0, minimumOrder: 0, radiusKm: 10, enforceRadius: false },
  isOpen: true,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchSettings();
      // Merge over the fallback so a partial response cannot leave the UI
      // without a currency to format with.
      setSettings({ ...FALLBACK, ...data });
    } catch (error) {
      // Staying on the defaults is better than blocking the menu on a settings
      // call — the server revalidates everything at checkout anyway.
      console.warn("Could not load settings, using defaults:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = {
    settings,
    loading,
    refresh,
    isOpen: settings.isOpen !== false,
    closedReason: settings.closedReason,
    nextOpen: settings.nextOpen,
    deliveryFee: settings.delivery?.fee ?? 0,
    minimumOrder: settings.delivery?.minimumOrder ?? 0,
    currency: settings.currency ?? DEFAULT_CURRENCY,
    format: (amount, language) => formatMoney(amount, settings.currency, language),
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};
