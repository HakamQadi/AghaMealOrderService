import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Star, MessageSquare } from "lucide-react";

const Stars = ({ value, size = "w-4 h-4" }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${
          s <= value ? "text-amber-400 fill-amber-400" : "text-slate-600"
        }`}
      />
    ))}
  </span>
);

/**
 * Customer feedback. There was no feedback loop at all before — no way for a
 * customer to report a problem, and no signal about which menu items work.
 */
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews", {
        params: filter ? { rating: filter } : {},
      });
      setReviews(data.reviews ?? []);
      setAverage(data.averageRating ?? 0);
      setTotal(data.total ?? 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/reviews/${id}/respond`, { response: replyText });
      setReplyTo(null);
      setReplyText("");
      load();
    } catch (err) {
      setError("Could not save the reply.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-100">Reviews</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm flex items-center gap-2">
            <Stars value={Math.round(average)} />
            {average} average · {total} review{total === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            filter === ""
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              : "text-slate-400 border-slate-700"
          }`}
        >
          All
        </button>
        {[5, 4, 3, 2, 1].map((n) => (
          <button
            key={n}
            onClick={() => setFilter(String(n))}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              filter === String(n)
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "text-slate-400 border-slate-700"
            }`}
          >
            {n} ★
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-400">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r._id}>
              <Card.Body className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3">
                      <Stars value={r.rating} />
                      <span className="text-slate-200 font-medium">
                        {r.user?.name ?? "Customer"}
                      </span>
                      {r.user?.phone && (
                        <a
                          href={`tel:${r.user.phone}`}
                          className="text-cyan-400 text-sm hover:text-cyan-300"
                        >
                          {r.user.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(r.createdAt).toLocaleString()}
                      {r.order && ` · order ${r.order.totalPrice} JOD`}
                    </p>
                  </div>
                  {r.rating <= 2 && (
                    <span className="text-red-300 text-xs bg-red-500/10 px-2 py-1 rounded">
                      Needs attention
                    </span>
                  )}
                </div>

                {r.comment && <p className="text-slate-300 text-sm">{r.comment}</p>}

                {r.response ? (
                  <div className="bg-slate-800/60 rounded-lg p-3 mt-2">
                    <p className="text-slate-400 text-xs mb-1">Your reply</p>
                    <p className="text-slate-300 text-sm">{r.response}</p>
                  </div>
                ) : replyTo === r._id ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Reply to this customer"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => sendReply(r._id)}>
                        Send
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setReplyTo(r._id)}>
                    Reply
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
