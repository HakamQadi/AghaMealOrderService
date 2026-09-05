import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Users, Search, Phone, MapPin } from "lucide-react";

/**
 * Customer lookup for support calls — who they are, what they have ordered,
 * and where they live. The dashboard previously had no way to answer any of
 * that when a customer rang about a problem.
 */
const Customers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async (term) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users", {
        params: term ? { search: term } : {},
      });
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounced so typing a phone number does not fire a request per keystroke.
    const timer = setTimeout(() => load(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search, load]);

  const toggleActive = async (user) => {
    try {
      await api.patch(`/admin/users/${user.id}/active`, { isActive: !user.isActive });
      load(search.trim());
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the account.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100">Customers</h1>
        <span className="text-slate-400 text-sm">({total})</span>
      </div>

      <Input
        icon={Search}
        placeholder="Search by name or phone number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && (
        <div className="bg-red-500/10 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-slate-400">No customers match that search.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <Card.Body className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-200 font-semibold">{user.name}</p>
                      {user.role === "admin" && <Badge variant="info">Admin</Badge>}
                      {user.isActive === false && (
                        <Badge variant="danger">Deactivated</Badge>
                      )}
                    </div>
                    <a
                      href={`tel:${user.phone}`}
                      className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 mt-1"
                    >
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Orders</p>
                      <p className="text-slate-200 font-semibold">{user.orderCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Completed</p>
                      <p className="text-slate-200 font-semibold">{user.completedCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Lifetime</p>
                      <p className="text-emerald-400 font-semibold">
                        {user.lifetimeValue} JOD
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpanded(expanded === user.id ? null : user.id)}
                    >
                      {expanded === user.id ? "Hide" : "Details"}
                    </Button>
                    {user.role !== "admin" && (
                      <Button
                        size="sm"
                        variant={user.isActive === false ? "success" : "danger"}
                        onClick={() => toggleActive(user)}
                      >
                        {user.isActive === false ? "Reactivate" : "Block"}
                      </Button>
                    )}
                  </div>
                </div>

                {expanded === user.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600 space-y-2 text-sm">
                    <p className="text-slate-400">
                      Joined {new Date(user.createdAt).toLocaleDateString()} · Last login{" "}
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "never"}
                    </p>
                    {user.savedAddresses?.length > 0 ? (
                      user.savedAddresses.map((addr, i) => (
                        <p key={i} className="flex items-start gap-2 text-slate-300">
                          <MapPin className="w-3 h-3 mt-1 text-cyan-400 shrink-0" />
                          <span>
                            {addr.label ? `${addr.label}: ` : ""}
                            {addr.address}
                          </span>
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-500">No saved addresses</p>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
