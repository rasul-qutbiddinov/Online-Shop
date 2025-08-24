import { useCustomerOrders } from "@/api/orders/useCustomerOrders";
import { Card, List, Spin, Tag } from "antd";

// LocalStorage'dan userni olish
const user = JSON.parse(localStorage.getItem("user") || "{}");

// ✅ status rang + text map
const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: "orange", label: "⏳ Kutilmoqda" },
  DONE: { color: "green", label: "✅ Bajarilgan" },
  CANCELED: { color: "red", label: "❌ Bekor qilingan" },
};

const ProfilePage = () => {
  const { data, isLoading, error } = useCustomerOrders(user.email);

  if (isLoading) return <Spin size="large" className="mt-10" />;
  if (error) return <div>Xatolik yuz berdi</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">👤 Profil</h1>
      <Card className="mb-6">
        <p>
          <b>Ism:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
      </Card>

      <h2 className="mb-3 text-xl font-semibold">📦 Buyurtmalar</h2>

      <List
        dataSource={data?.data || []}
        renderItem={(order) => {
          const st = statusMap[order.status] || {
            color: "default",
            label: order.status,
          };
          return (
            <Card key={order.id} className="!mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span>
                  <b>ID:</b> {order.id}
                </span>
                <Tag color={st.color}>{st.label}</Tag>
              </div>
              <p>
                <b>Sana:</b> {new Date(order.orderDate).toLocaleString()}
              </p>
              <p>
                <b>Jami summa:</b> {order.totalAmount} UZS
              </p>
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
