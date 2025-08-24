/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Statistic, Row, Col, Spin, Empty } from "antd";
import { useGetOrders } from "@/api/orders/useOrders";
import { useGetProducts } from "@/api/products/useGetProducts";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { PageTransition } from "@/components/shared/PageTransition";
import Navbar from "@/components/shared/Navbar";

// Status bo‘yicha ranglar
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#FFBB28", // sariq
  CONFIRMED: "#00C49F", // yashil
  DELIVERED: "#0088FE", // ko‘k
  CANCELLED: "#FF4D4F", // qizil
};

const Statistica = () => {
  const { data: ordersData, isLoading: ordersLoading } = useGetOrders({
    page: 0,
    size: 1000,
    sortBy: "orderDate",
    sortDir: "desc",
  });

  const { data: productsData, isLoading: productsLoading } = useGetProducts({
    page: 0,
    size: 1000,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const orders = ordersData?.content || [];
  const products = productsData?.content || [];

  // 📊 Umumiy statistika
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum: number, o: any) => sum + (o.totalAmount || 0),
    0,
  );
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum: number, p: any) => sum + (p.stock || 0),
    0,
  );

  // 📊 Statuslar bo‘yicha taqsimot
  const statusCounts: Record<string, number> = {};
  orders.forEach((o: any) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // 📊 Mahsulotlar bo‘yicha sotuvlar
  const productSales: Record<
    string,
    { sold: number; stock: number; price: number }
  > = {};

  orders.forEach((o: any) => {
    o.orderItems?.forEach((item: any) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { sold: 0, stock: 0, price: 0 };
      }
      productSales[item.productId].sold += item.quantity;
    });
  });

  products.forEach((p: any) => {
    if (!productSales[p.id]) {
      productSales[p.id] = { sold: 0, stock: 0, price: 0 };
    }
    productSales[p.id].stock = p.stock;
    productSales[p.id].price = p.price;
  });

  const productChartData = Object.keys(productSales)
    .map((id) => {
      const product = products.find((p: any) => String(p.id) === String(id));
      if (!product) return null; // mahsulot yo‘q bo‘lsa chartga qo‘shma
      return {
        name: product.name,
        Sotilgan: productSales[id].sold,
        Qolgan: productSales[id].stock,
        Narx: productSales[id].price,
      };
    })
    .filter(Boolean); // null bo‘lganlarini olib tashlaymiz

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // 📊 PieChart data
  const pieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
    color: STATUS_COLORS[key] || "#8884d8", // fallback rang
  }));

  return (
    <PageTransition>
      <Navbar
        title="📊 Statistika"
        description="Umumiy ko‘rsatkichlar va tahlil"
      />

      {ordersLoading || productsLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-6">
          {/* Stat Cards */}
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false} className="rounded-2xl shadow-md">
                <Statistic title="Umumiy Buyurtmalar" value={totalOrders} />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="rounded-2xl shadow-md">
                <Statistic
                  title="Jami Tushum"
                  value={totalRevenue}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="rounded-2xl shadow-md">
                <Statistic title="Mahsulotlar" value={totalProducts} />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="rounded-2xl shadow-md">
                <Statistic title="Umumiy Mahsulotlar soni" value={totalStock} />
              </Card>
            </Col>
          </Row>

          {/* Pie Chart */}
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">
              📦 Buyurtmalar statusi bo‘yicha
            </h3>
            {pieData.length === 0 ? (
              <Empty description="Ma’lumot yo‘q" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart - Mahsulotlar */}
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">
              🛒 Mahsulotlar sotuvlari
            </h3>
            {productChartData.length === 0 ? (
              <Empty description="Ma’lumot yo‘q" />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "Narx" ? formatCurrency(Number(value)) : value
                    }
                  />
                  <Legend />
                  <Bar dataKey="Sotilgan" fill="#00C49F" />
                  <Bar dataKey="Qolgan" fill="#FFBB28" />
                  <Bar dataKey="Narx" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default Statistica;
