import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  ACTIVE_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  elapsedSince,
  nextStatuses,
  primaryNext,
} from "../../utils/orderStatus";
import { Bell, BellOff, MapPin, Phone, RefreshCw, Clock } from "lucide-react";

const POLL_MS = 20000;

/**
 * Service-time order board.
 *
 * Replaces a flat list that could not distinguish a brand new order from one
 * already in the kitchen. Columns are lifecycle stages, tickets carry the
 * elapsed time since the order was placed, and a new order rings a bell —
 * previously staff only learned of an order by refreshing.
 */
const OrderBoard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Ids already seen, so only genuinely new orders trigger the alert.
  const seenIds = useRef(new Set());
  const isFirstLoad = useRef(true);

  const playAlert = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Browsers block audio until the page has been interacted with; the
      // visual highlight still does the job.
    }
  }, [soundOn]);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/orders", {
        params: { active: "true", limit: 200 },
      });
      const incoming = data.orders ?? [];

      const fresh = incoming.filter((o) => !seenIds.current.has(o._id));
      if (!isFirstLoad.current && fresh.some((o) => o.status === "placed")) {
        playAlert();
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(`${fresh.length} new order(s)`);
        }
      }
      incoming.forEach((o) => seenIds.current.add(o._id));
      isFirstLoad.current = false;

      setOrders(incoming);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [playAlert]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const advance = async (order, status) => {
    setUpdatingId(order._id);
    try {
      await api.patch(`/admin/orders/${order._id}/status`, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = ACTIVE_STATUSES.map((status) => ({
    status,
    orders: orders.filter((o) => o.status === status),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Order Board</h1>
          <p className="text-slate-400 text-sm">
            {orders.length} order{orders.length === 1 ? "" : "s"} in service ·
            refreshes every {POLL_MS / 1000}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setSoundOn((v) => !v)}>
            {soundOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="ml-2">{soundOn ? "Sound on" : "Sound off"}</span>
          </Button>
          <Button variant="secondary" onClick={load}>
            <RefreshCw className="w-4 h-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading board…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {columns.map(({ status, orders: columnOrders }) => (
            <div key={status} className="space-y-3">
              <div
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${STATUS_STYLES[status]}`}
              >
                {STATUS_LABELS[status]} · {columnOrders.length}
              </div>

              {columnOrders.length === 0 && (
                <p className="text-slate-600 text-xs px-1">Nothing here</p>
              )}

              {columnOrders.map((order) => {
                const next = primaryNext(order.status, order.type);
                const others = nextStatuses(order.status).filter((s) => s !== next);
                return (
                  <Card key={order._id}>
                    <Card.Body className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-slate-200 text-sm">
                          #{order._id.slice(-5).toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {elapsedSince(order.createdAt)}
                        </span>
                      </div>

                      <p className="text-slate-200 text-sm font-medium">{order.name}</p>

                      <a
                        href={`tel:${order.contact}`}
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        <Phone className="w-3 h-3" />
                        {order.contact}
                      </a>

                      <p className="text-xs text-slate-400 capitalize">
                        {order.type} · {order.cartItems?.length ?? 0} item
                        {order.cartItems?.length === 1 ? "" : "s"} ·{" "}
                        <span className="text-amber-400 font-semibold">
                          {order.totalPrice} JOD
                        </span>
                      </p>

                      {order.type === "delivery" && order.location?.coordinates?.length === 2 && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${order.location.coordinates[1]},${order.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{order.location.address}</span>
                        </a>
                      )}

                      <div className="pt-2 space-y-2">
                        {next && (
                          <Button
                            className="w-full"
                            disabled={updatingId === order._id}
                            onClick={() => advance(order, next)}
                          >
                            {updatingId === order._id ? "…" : STATUS_LABELS[next]}
                          </Button>
                        )}
                        {others.length > 0 && (
                          <div className="flex gap-2">
                            {others.map((status) => (
                              <button
                                key={status}
                                disabled={updatingId === order._id}
                                onClick={() => advance(order, status)}
                                className="flex-1 text-xs text-slate-400 hover:text-red-300 border border-slate-600 rounded py-1 transition-colors disabled:opacity-50"
                              >
                                {STATUS_LABELS[status]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderBoard;
