// pages/ProductDetailPage.tsx
import { useParams } from "react-router-dom";
import { useGetProducts, type Product } from "@/api/products/useGetProducts";
import { Button, message, Spin, Divider, Avatar } from "antd";
import { useState } from "react";

const placeholderImage = "https://picsum.photos/400/400?random=10";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetProducts({ page: 0, size: 100 });
  const [orderCreating, setOrderCreating] = useState(false);

  if (isLoading) return <Spin size="large" className="mx-auto mt-20" />;

  const product: Product | undefined = data?.content.find(
    (p) => p.id === Number(id),
  );

  if (!product)
    return (
      <div className="mt-20 text-center text-lg font-semibold">
        Product not found
      </div>
    );

  const handleCreateOrder = () => {
    setOrderCreating(true);
    setTimeout(() => {
      message.success(`Order created for ${product.name}`);
      setOrderCreating(false);
    }, 1000);
  };

  // Statik commentlar
  const comments = [
    { id: 1, user: "Ali", text: "Bu product juda yaxshi!" },
    { id: 2, user: "Vali", text: "Narxi biroz qimmat, lekin sifatli." },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Image */}
        <div className="flex justify-center lg:w-1/2">
          <img
            src={placeholderImage}
            alt={product.name}
            className="max-h-[400px] rounded-xl object-cover shadow-lg"
          />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4 lg:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 space-y-2">
            <p className="text-black">
              Ushbu product eng sifatli materiallardan tayyorlangan va mijozlar
              tomonidan yuqori baholangan.
            </p>
            <p className="text-black">
              Mahsulot zamonaviy dizaynga ega va kundalik foydalanish uchun juda
              qulay.
            </p>
            <p className="text-black">
              Maxsus xususiyatlar: chidamlilik, engil vazn va ekologik toza
              materiallar.
            </p>
            <p className="text-black">
              Mijozlar sharhlari: 4.8/5 yulduz, 1200+ baholashlar asosida.
            </p>
          </div>

          <p className="text-lg">
            <b>Price:</b> ${product.price}
          </p>
          <p className="text-lg">
            <b>Stock:</b> {product.stock}
          </p>
          <p className="text-lg">
            <b>Category:</b> {product.category}
          </p>
          <p className="text-sm text-gray-600">
            {/* APIdan keladigan qo‘shimcha ma’lumot */}
            Created at: {new Date(product.createdAt).toLocaleDateString()}
          </p>

          <Button
            type="primary"
            size="large"
            loading={orderCreating}
            onClick={handleCreateOrder}
          >
            Buyurtma yaratish
          </Button>
        </div>
      </div>

      <Divider orientation="left">Comments</Divider>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-4">
            <Avatar>{c.user[0]}</Avatar>
            <div className="space-y-1">
              <p className="font-semibold">{c.user}</p>
              <p className="text-gray-700">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;
