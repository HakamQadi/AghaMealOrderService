"use client"

import { useEffect, useState } from "react"
import api from "../services/api"
import Modal from "../components/Modal/PopupModal"
import Button from "../components/ui/Button"
import Table from "../components/ui/Table"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import { ShoppingBag, Eye, Trash2, Package, Phone, Calendar, MapPin } from "lucide-react"
import { STATUS_LABELS, STATUS_STYLES, nextStatuses } from "../utils/orderStatus"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [error, setError] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchOrdersData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/orders`)
      setOrders(response?.data?.orders || [])
    } catch (error) {
      console.error("ERROR fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleChangeStatus = async (orderId, status) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
      const updated = response?.data?.order
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)))
      if (selectedOrder?._id === orderId) setSelectedOrder(updated)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the order.")
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/admin/orders/delete/${orderId}`)
        fetchOrdersData()
        setIsViewModalOpen(false)
      } catch (error) {
        console.error("ERROR deleting order:", error)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    fetchOrdersData()
  }, [])

  return (
    <main className="bg-slate-900 min-h-screen">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4 md:p-6">
          {error && (
            <div className="bg-red-500/10 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3 hover:scale-105 transform transition-all duration-200">
              <div className="p-2 bg-slate-800 border border-cyan-500/30 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Orders Management
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">{orders.length} Total Orders</span>
            </div>
          </div>

          {/* View Order Modal */}
          {isViewModalOpen && selectedOrder && (
            <Modal onClose={() => setIsViewModalOpen(false)} size="xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                    <div className="p-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
                      <Eye className="w-5 h-5 text-cyan-400" />
                    </div>
                    Order Details
                  </h2>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[selectedOrder.status] ?? ""}`}
                  >
                    {STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <Card>
                    <Card.Body>
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">Customer Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <Phone className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Customer Name</p>
                            <p className="text-slate-200 font-medium">{selectedOrder.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <Phone className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Contact</p>
                            <p className="text-slate-200 font-medium">{selectedOrder.contact}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <Package className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Order Type</p>
                            <p className="text-slate-200 font-medium capitalize">{selectedOrder.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/50 rounded-lg">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Order Date</p>
                            <p className="text-slate-200 font-medium">{formatDate(selectedOrder.createdAt)}</p>
                          </div>
                        </div>

                        {/* Delivery address. Orders placed before address
                            capture existed have none, hence the fallback. */}
                        {selectedOrder.type === "delivery" && (
                          <div className="flex items-start gap-3 sm:col-span-2">
                            <div className="p-2 bg-slate-600/50 rounded-lg">
                              <MapPin className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-400 text-sm">Delivery Address</p>
                              {selectedOrder.location?.address ? (
                                <>
                                  <p className="text-slate-200 font-medium">
                                    {selectedOrder.location.address}
                                  </p>
                                  {selectedOrder.location.note && (
                                    <p className="text-slate-400 text-sm italic mt-1">
                                      Note: {selectedOrder.location.note}
                                    </p>
                                  )}
                                  {selectedOrder.location.coordinates?.length === 2 && (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${selectedOrder.location.coordinates[1]},${selectedOrder.location.coordinates[0]}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm mt-2"
                                    >
                                      <MapPin className="w-3 h-3" />
                                      Open in Maps
                                    </a>
                                  )}
                                </>
                              ) : (
                                <p className="text-amber-400 text-sm">
                                  No address recorded — placed before address capture. Call the customer.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <Card.Body>
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.cartItems.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                            <div>
                              <p className="text-slate-200 font-medium">{item.name.en}</p>
                              <p className="text-slate-400 text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <p className="text-amber-400 font-bold">{item.price} JOD</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        {selectedOrder.subtotal != null && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Subtotal</span>
                            <span className="text-slate-300 text-sm">{selectedOrder.subtotal} JOD</span>
                          </div>
                        )}
                        {selectedOrder.deliveryFee > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Delivery Fee</span>
                            <span className="text-slate-300 text-sm">{selectedOrder.deliveryFee} JOD</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-semibold text-lg">Total Price</span>
                          <span className="text-emerald-400 font-bold text-2xl">{selectedOrder.totalPrice} JOD</span>
                        </div>
                        {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-slate-400 text-sm">Discount Applied</span>
                            <span className="text-red-400 text-sm">-{selectedOrder.discountAmount} JOD</span>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses(selectedOrder.status).length === 0 ? (
                        <p className="text-slate-500 text-sm">
                          This order is {STATUS_LABELS[selectedOrder.status]?.toLowerCase()} and can no longer change.
                        </p>
                      ) : (
                        nextStatuses(selectedOrder.status).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={
                              status === "cancelled" || status === "rejected"
                                ? "danger"
                                : "success"
                            }
                            onClick={() => handleChangeStatus(selectedOrder._id, status)}
                          >
                            {STATUS_LABELS[status]}
                          </Button>
                        ))
                      )}
                    </div>
                    <Button
                      variant="danger"
                      className="flex-1"
                      icon={Trash2}
                      onClick={() => handleDeleteOrder(selectedOrder._id)}
                    >
                      Delete Order
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          )}

          {/* Orders Table */}
          <Table>
            <Table.Header>
              <div className="grid grid-cols-5 gap-4 font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Customer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Type</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status</span>
                </div>
              </div>
            </Table.Header>

            <Table.Body>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <Table.EmptyState
                  icon={ShoppingBag}
                  title="No orders found"
                  description="Orders will appear here once customers place them"
                />
              ) : (
                orders.map((order) => (
                  <Table.Row key={order._id} onClick={() => handleViewOrder(order)}>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="flex flex-col justify-center">
                        <span className="text-slate-200 font-medium">{order.name}</span>
                        <span className="text-slate-400 text-sm">{order.contact}</span>
                      </div>

                      <div className="flex items-center">
                        <Badge variant="info" className="capitalize">
                          {order.type}
                        </Badge>
                      </div>

                      <div className="flex items-center">
                        <span className="text-slate-300">
                          {order.cartItems.length} item{order.cartItems.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-amber-400 font-bold">{order.totalPrice} JOD</span>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[order.status] ?? ""}`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                    </div>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </section>
    </main>
  )
}
