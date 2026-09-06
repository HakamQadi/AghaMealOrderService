import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Bike,
  ShoppingBag,
} from "lucide-react";

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "week", label: "Last 7 days" },
  { key: "month", label: "Last 30 days" },
  { key: "all", label: "All time" },
];

const money = (n) => `${(n ?? 0).toFixed(2)} JOD`;

/** Period-over-period arrow. `null` means there was no prior period to compare. */
const Change = ({ value }) => {
  if (value === null || value === undefined) {
    return <span className="text-slate-500 text-xs">no prior period</span>;
  }
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const tone = value > 0 ? "text-emerald-400" : value < 0 ? "text-red-400" : "text-slate-400";
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${tone}`}>
      <Icon className="w-3 h-3" />
      {value > 0 ? "+" : ""}
      {value}% vs previous
    </span>
  );
};

const Metric = ({ label, value, change, accent = "text-slate-100" }) => (
  <Card>
    <Card.Body className="p-5">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
      {change !== undefined && (
        <div className="mt-2">
          <Change value={change} />
        </div>
      )}
    </Card.Body>
  </Card>
);

/** Horizontal bars, so no charting dependency is needed. */
const BarList = ({ rows, valueKey = "count", labelKey = "label", format = (v) => v }) => {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-slate-400 text-xs w-24 shrink-0 truncate">
            {row[labelKey]}
          </span>
          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${(row[valueKey] / max) * 100}%` }}
            />
          </div>
          <span className="text-slate-300 text-xs w-20 text-right shrink-0">
            {format(row[valueKey])}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/analytics/overview", { params: { period } });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = async () => {
    try {
      const response = await api.get("/admin/analytics/export", {
        params: { period },
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${period}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not export orders.");
    }
  };

  const summary = data?.summary;
  const busiestHours = (data?.demand?.byHour ?? [])
    .filter((h) => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .sort((a, b) => a.hour - b.hour)
    .map((h) => ({ label: `${String(h.hour).padStart(2, "0")}:00`, count: h.count }));

  return (
    <main className="bg-slate-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Dashboard</h1>
            <p className="text-slate-400 text-sm">
              Revenue counts completed orders only
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  period === p.key
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 border border-slate-700 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
            <Button size="sm" variant="secondary" onClick={exportCsv}>
              <Download className="w-4 h-4" />
              <span className="ml-2">CSV</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
          </div>
        ) : (
          summary && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Metric
                  label="Revenue"
                  value={money(summary.current.revenue)}
                  change={summary.change.revenue}
                  accent="text-emerald-400"
                />
                <Metric
                  label="Completed orders"
                  value={summary.current.orders}
                  change={summary.change.orders}
                />
                <Metric
                  label="Average order"
                  value={money(summary.current.averageOrderValue)}
                  change={summary.change.averageOrderValue}
                />
                <Metric
                  label="Lost orders"
                  value={`${summary.fulfilment.lost} (${summary.fulfilment.lossRate}%)`}
                  accent={summary.fulfilment.lossRate > 10 ? "text-red-400" : "text-slate-100"}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <Card.Body className="p-5">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">
                      Pickup vs delivery
                    </h2>
                    {summary.typeBreakdown.length === 0 ? (
                      <p className="text-slate-500 text-sm">No completed orders yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {summary.typeBreakdown.map((t) => (
                          <div key={t.type} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-300 capitalize">
                              {t.type === "delivery" ? (
                                <Bike className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                              )}
                              {t.type}
                            </span>
                            <span className="text-slate-400 text-sm">
                              {t.count} orders ·{" "}
                              <span className="text-emerald-400">{money(t.revenue)}</span>
                            </span>
                          </div>
                        ))}
                        <div className="pt-3 mt-3 border-t border-slate-600 text-sm text-slate-400">
                          Delivery fees collected:{" "}
                          <span className="text-slate-200">
                            {money(summary.current.deliveryFees)}
                          </span>
                          {summary.current.discounts > 0 && (
                            <>
                              {" · "}Discounts given:{" "}
                              <span className="text-amber-400">
                                {money(summary.current.discounts)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body className="p-5">
                    <h2 className="text-lg font-semibold text-slate-200 mb-1">Customers</h2>
                    <p className="text-slate-500 text-xs mb-4">
                      Repeat rate is the share of ordering customers who came back
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Total</p>
                        <p className="text-xl font-bold text-slate-100">
                          {data.customers.totalCustomers}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">New this period</p>
                        <p className="text-xl font-bold text-cyan-400">
                          {data.customers.newCustomers}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Ordered at least once</p>
                        <p className="text-xl font-bold text-slate-100">
                          {data.customers.orderingCustomers}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Repeat rate</p>
                        <p className="text-xl font-bold text-emerald-400">
                          {data.customers.repeatRate}%
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <Card.Body className="p-5">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">
                      Best sellers by revenue
                    </h2>
                    {data.menu.top.length === 0 ? (
                      <p className="text-slate-500 text-sm">No sales in this period.</p>
                    ) : (
                      <BarList
                        rows={data.menu.top.map((m) => ({
                          label: m.name.en,
                          count: m.revenue,
                        }))}
                        format={money}
                      />
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body className="p-5">
                    <h2 className="text-lg font-semibold text-slate-200 mb-1">
                      Busiest hours
                    </h2>
                    <p className="text-slate-500 text-xs mb-4">
                      Use this to decide staffing
                    </p>
                    {busiestHours.length === 0 ? (
                      <p className="text-slate-500 text-sm">Not enough data yet.</p>
                    ) : (
                      <BarList rows={busiestHours} />
                    )}
                  </Card.Body>
                </Card>
              </div>

              <Card>
                <Card.Body className="p-5">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    Orders by day of week
                  </h2>
                  <BarList
                    rows={data.demand.byWeekday.map((d) => ({
                      label: d.day,
                      count: d.count,
                    }))}
                  />
                </Card.Body>
              </Card>
            </>
          )
        )}
      </div>
    </main>
  );
}
