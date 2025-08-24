import { useEffect, useState } from "react";
import { useCustomerOrders } from "@/api/orders/useCustomerOrders";
import { Card, List, Spin, Tag } from "antd";

// ✅ status rang + text map
const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: "orange", label: "⏳ Kutilmoqda" },
  CONFIRMED: { color: "blue", label: "✅ Tasdiqlangan" },
  DELIVERED: { color: "green", label: "📦 Yetkazib berilgan" },
  CANCELLED: { color: "red", label: "❌ Bekor qilingan" },
};

const ProfilePage = () => {
  // ✅ userni state’da saqlaymiz, shunda localStorage o‘zgarsa component yangilanadi
  const [user, setUser] = useState<{ username?: string; email?: string }>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(stored);
  }, []);

  const { data, isLoading, error } = useCustomerOrders(user.email || "");

  if (!user?.email) {
    return <div className="p-6">❌ Avval tizimga kiring</div>;
  }

  if (isLoading) return <Spin size="large" className="mt-10" />;
  if (error) return <div>Xatolik yuz berdi</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">👤 Profil</h1>

      {/* User ma'lumotlari */}
      <Card className="mb-6 rounded-xl shadow-md">
        <p>
          <b>Ism:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
      </Card>

      <h2 className="mb-3 text-xl font-semibold">📦 Buyurtmalar</h2>

      {/* Buyurtmalar ro'yxati */}
      <List
        dataSource={data?.data || []}
        renderItem={(order) => {
          const st = statusMap[order.status] || {
            color: "default",
            label: order.status,
          };
          return (
            <Card
              key={order.id}
              className="!mb-4 rounded-xl border border-gray-200 shadow-sm"
            >
              {/* Order Header */}
              <div className="mb-2 flex items-center justify-between">
                <span>
                  <b>ID:</b> {order.id}
                </span>
                <Tag
                  color={st.color}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {st.label}
                </Tag>
              </div>

              {/* Order details */}
              <p>
                <b>Sana:</b> {new Date(order.orderDate).toLocaleString()}
              </p>
              <p>
                <b>Jami summa:</b> {order.totalAmount} UZS
              </p>

              {/* Order Items */}
              <List
                size="small"
                dataSource={order.orderItems}
                renderItem={(item) => (
                  <List.Item>
                    {item.productName} × {item.quantity} = {item.totalPrice} UZS
                  </List.Item>
                )}
              />
            </Card>
          );
        }}
      />
    </div>
  );
};

export default ProfilePage;
