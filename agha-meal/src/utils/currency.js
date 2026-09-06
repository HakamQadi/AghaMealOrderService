/**
 * Money formatting for the app.
 *
 * Prices used to render as `${price}` throughout the UI — a US dollar sign on
 * a Jordanian product. Currency and decimal places now come from the server's
 * settings, with a JOD default so the app still renders sensibly offline.
 */
export const DEFAULT_CURRENCY = {
  code: "JOD",
  symbol: { en: "JD", ar: "د.أ" },
  decimals: 2,
};

export const formatMoney = (amount, currency = DEFAULT_CURRENCY, language = "en") => {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  const decimals = currency?.decimals ?? DEFAULT_CURRENCY.decimals;
  const symbol =
    currency?.symbol?.[language] ??
    currency?.symbol?.en ??
    DEFAULT_CURRENCY.symbol.en;

  return `${safe.toFixed(decimals)} ${symbol}`;
};
