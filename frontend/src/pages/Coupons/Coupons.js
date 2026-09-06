import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Ticket, Plus, X } from "lucide-react";

const EMPTY = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  maxDiscount: "",
  minOrderValue: "",
  usageLimit: "",
  perUserLimit: 1,
  validTo: "",
};

/**
 * Coupon management.
 *
 * `couponCode` existed on orders as a bare string with nothing behind it, and
 * the discount was whatever the client sent. Codes now live here and the
 * server computes what they are worth.
 */
const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.coupons ?? []);
    } catch (err) {
      setMessage({ type: "error", text: "Could not load coupons." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Empty strings mean "not set", not zero.
      const payload = Object.fromEntries(
        Object.entries(form)
          .filter(([, v]) => v !== "" && v !== null)
          .map(([k, v]) =>
            ["value", "maxDiscount", "minOrderValue", "usageLimit", "perUserLimit"].includes(k)
              ? [k, Number(v)]
              : [k, v]
          )
      );
      await api.post("/coupons", payload);
      setForm(EMPTY);
      setShowForm(false);
      setMessage({ type: "success", text: "Coupon created." });
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not create the coupon.",
      });
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await api.patch(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      load();
    } catch (err) {
      setMessage({ type: "error", text: "Could not update the coupon." });
    }
  };

  const remove = async (coupon) => {
    try {
      const { data } = await api.delete(`/coupons/${coupon._id}`);
      setMessage({ type: "success", text: data.message });
      load();
    } catch (err) {
      setMessage({ type: "error", text: "Could not delete the coupon." });
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-100">Coupons</h1>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="ml-2">{showForm ? "Cancel" : "New coupon"}</span>
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

      {showForm && (
        <Card>
          <Card.Body>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Code" value={form.code} onChange={set("code")} required />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Type</label>
                <select
                  value={form.type}
                  onChange={set("type")}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (JOD)</option>
                </select>
              </div>
              <Input
                label={form.type === "percentage" ? "Percent off" : "Amount off"}
                type="number"
                step="0.01"
                value={form.value}
                onChange={set("value")}
                required
              />
              <Input
                label="Description"
                value={form.description}
                onChange={set("description")}
                className="sm:col-span-3"
              />
              {form.type === "percentage" && (
                <Input
                  label="Max discount (optional)"
                  type="number"
                  step="0.01"
                  value={form.maxDiscount}
                  onChange={set("maxDiscount")}
                />
              )}
              <Input
                label="Minimum order (optional)"
                type="number"
                step="0.01"
                value={form.minOrderValue}
                onChange={set("minOrderValue")}
              />
              <Input
                label="Total uses (blank = unlimited)"
                type="number"
                value={form.usageLimit}
                onChange={set("usageLimit")}
              />
              <Input
                label="Uses per customer"
                type="number"
                value={form.perUserLimit}
                onChange={set("perUserLimit")}
              />
              <Input
                label="Expires (optional)"
                type="date"
                value={form.validTo}
                onChange={set("validTo")}
              />
              <div className="sm:col-span-3">
                <Button type="submit">Create coupon</Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : coupons.length === 0 ? (
        <p className="text-slate-400">No coupons yet.</p>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => (
            <Card key={c._id}>
              <Card.Body className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-cyan-300">{c.code}</span>
                    <Badge variant={c.isActive ? "success" : "danger"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {c.type === "percentage"
                      ? `${c.value}% off${c.maxDiscount ? `, up to ${c.maxDiscount} JOD` : ""}`
                      : `${c.value} JOD off`}
                    {c.minOrderValue > 0 && ` · min order ${c.minOrderValue} JOD`}
                    {c.validTo && ` · expires ${new Date(c.validTo).toLocaleDateString()}`}
                  </p>
                  {c.description && (
                    <p className="text-slate-500 text-sm mt-1">{c.description}</p>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-slate-400 text-xs">Redeemed</p>
                  <p className="text-slate-200 font-semibold">
                    {c.usageCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleActive(c)}>
                    {c.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(c)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
