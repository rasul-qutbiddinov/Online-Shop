import { Card, Row, Col, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetProducts, type Product } from "@/api/products/useGetProducts";
import { useState } from "react";
import { CartButton } from "./CartButton";

// Statik rasm
const placeholderImage = "https://picsum.photos/400/300?random=1";

const ShopPage = () => {
  const navigate = useNavigate();
  const [page] = useState(0);

  // API orqali mahsulotlarni olish
  const { data, isLoading } = useGetProducts({
    page,
    size: 12,
    isActive: true,
  });

  // Loading holati
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const products = data?.content || [];

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Do'kon mahsulotlari</h2>
      <Row gutter={[24, 24]}>
        {products.map((product: Product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={placeholderImage}
                  className="h-[150px] object-cover"
                />
              }
              style={{ borderRadius: 12 }}
            >
              <Card.Meta
                title={product.name}
                description={`Narx: ${product.price} UZS | Stock: ${product.stock}`}
              />
              <div className="mt-4 flex items-center justify-between">
                <Button
                  type="primary"
                  onClick={() => navigate(`${product.id}`)}
                >
                  Batafsil
                </Button>

                {/* ✅ Redux bilan ishlaydigan CartButton */}
                <CartButton product={product} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopPage;
