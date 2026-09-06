import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Settings as SettingsIcon, Clock, Truck, Coins, PauseCircle } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Minutes-from-midnight <-> "HH:MM" for the time inputs. */
const toTimeInput = (minutes) => {
  const safe = Number.isFinite(minutes) ? minutes : 0;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};
const fromTimeInput = (value) => {
  const [h, m] = String(value).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/settings/admin");
      setSettings(data.settings);
    } catch (error) {
      setMessage({ type: "error", text: "Could not load settings." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.patch("/settings/admin", {
        currency: settings.currency,
        delivery: settings.delivery,
        hours: settings.hours,
        ordersPaused: settings.ordersPaused,
        pausedMessage: settings.pausedMessage,
      });
      setSettings(data.settings);
      setMessage({ type: "success", text: "Settings saved." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Could not save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const patch = (path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      let target = next;
      for (let i = 0; i < path.length - 1; i += 1) target = target[path[i]];
      target[path[path.length - 1]] = value;
      return next;
    });
  };

  const patchDay = (index, field, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.hours.week[index] = { ...next.hours.week[index], [field]: value };
      return next;
    });
  };

  if (loading) {
    return <p className="text-slate-400 p-6">Loading settings…</p>;
  }
  if (!settings) {
    return <p className="text-red-400 p-6">Settings unavailable.</p>;
  }

  const coords = settings.delivery.restaurantLocation?.coordinates ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Pause switch — the control staff reach for most often. */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PauseCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-lg font-semibold text-slate-200">Pause new orders</h2>
                <p className="text-slate-400 text-sm">
                  Stops customers placing orders immediately, whatever the opening hours say.
                </p>
              </div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 accent-amber-500"
                checked={settings.ordersPaused}
                onChange={(e) => patch(["ordersPaused"], e.target.checked)}
              />
            </label>
          </div>
          {settings.ordersPaused && (
            <div className="mt-4">
              <Input
                label="Message shown to customers"
                value={settings.pausedMessage || ""}
                onChange={(e) => patch(["pausedMessage"], e.target.value)}
                placeholder="e.g. We are at capacity — back in 30 minutes"
              />
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Currency */}
      <Card>
        <Card.Body>
          <div className="flex items-center gap-3 mb-4">
            <Coins className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-slate-200">Currency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Code"
              value={settings.currency.code}
              onChange={(e) => patch(["currency", "code"], e.target.value)}
            />
            <Input
              label="Symbol (EN)"
              value={settings.currency.symbol.en}
              onChange={(e) => patch(["currency", "symbol", "en"], e.target.value)}
            />
            <Input
              label="Symbol (AR)"
              value={settings.currency.symbol.ar}
              onChange={(e) => patch(["currency", "symbol", "ar"], e.target.value)}
            />
            <Input
              label="Decimal places"
              type="number"
              min="0"
              max="3"
              value={settings.currency.decimals}
              onChange={(e) => patch(["currency", "decimals"], Number(e.target.value))}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Delivery */}
      <Card>
        <Card.Body>
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-slate-200">Delivery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={`Delivery fee (${settings.currency.code})`}
              type="number"
              step="0.01"
              min="0"
              value={settings.delivery.fee}
              onChange={(e) => patch(["delivery", "fee"], Number(e.target.value))}
            />
            <Input
              label={`Minimum order (${settings.currency.code})`}
              type="number"
              step="0.01"
              min="0"
              value={settings.delivery.minimumOrder}
              onChange={(e) => patch(["delivery", "minimumOrder"], Number(e.target.value))}
            />
            <Input
              label="Delivery radius (km)"
              type="number"
              step="0.5"
              min="0"
              value={settings.delivery.radiusKm}
              onChange={(e) => patch(["delivery", "radiusKm"], Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label="Restaurant latitude"
              type="number"
              step="0.00001"
              value={coords[1] ?? ""}
              onChange={(e) =>
                patch(["delivery", "restaurantLocation"], {
                  type: "Point",
                  coordinates: [coords[0] ?? 0, Number(e.target.value)],
                })
              }
            />
            <Input
              label="Restaurant longitude"
              type="number"
              step="0.00001"
              value={coords[0] ?? ""}
              onChange={(e) =>
                patch(["delivery", "restaurantLocation"], {
                  type: "Point",
                  coordinates: [Number(e.target.value), coords[1] ?? 0],
                })
              }
            />
          </div>

          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-cyan-500"
              checked={settings.delivery.enforceRadius}
              onChange={(e) => patch(["delivery", "enforceRadius"], e.target.checked)}
            />
            <span className="text-slate-300 text-sm">
              Reject delivery orders outside the radius
              {coords.length !== 2 && (
                <span className="text-amber-400"> — set the restaurant location first</span>
              )}
            </span>
          </label>
        </Card.Body>
      </Card>

      {/* Opening hours */}
      <Card>
        <Card.Body>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-slate-200">Opening hours</h2>
            <span className="text-slate-500 text-sm">({settings.hours.timezone})</span>
          </div>
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const slot = settings.hours.week[index] ?? {};
              return (
                <div key={day} className="flex flex-wrap items-center gap-3">
                  <span className="w-28 text-slate-300 text-sm">{day}</span>
                  <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-red-500"
                      checked={!!slot.isClosed}
                      onChange={(e) => patchDay(index, "isClosed", e.target.checked)}
                    />
                    Closed
                  </label>
                  {!slot.isClosed && (
                    <>
                      <input
                        type="time"
                        className="bg-slate-700 text-slate-200 rounded px-2 py-1 text-sm"
                        value={toTimeInput(slot.open)}
                        onChange={(e) => patchDay(index, "open", fromTimeInput(e.target.value))}
                      />
                      <span className="text-slate-500">to</span>
                      <input
                        type="time"
                        className="bg-slate-700 text-slate-200 rounded px-2 py-1 text-sm"
                        value={toTimeInput(slot.close)}
                        onChange={(e) => patchDay(index, "close", fromTimeInput(e.target.value))}
                      />
                      {slot.close <= slot.open && (
                        <span className="text-slate-500 text-xs">(closes next day)</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
