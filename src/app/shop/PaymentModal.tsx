/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateOrder } from "@/api/orders/useCreateOrder";
import { Button, Modal, Radio, message } from "antd";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export const PaymentModal = ({
  open,
  onClose,
  total,
  items,
  customer,
}: any) => {
  const [method, setMethod] = useState<string>("");
  const createOrder = useCreateOrder();
  const { clear } = useCart();

  const [messageApi, contextHolder] = message.useMessage();

  const handlePay = () => {
    createOrder.mutate(
      {
        customerName: customer.name,
        customerEmail: customer.email,
        orderItems: items.map((p: any) => ({
          productId: p.id,
          quantity: p.quantity,
        })),
      },
      {
        onSuccess: () => {
          messageApi.success("✅ Buyurtma muvaffaqiyatli yaratildi!");
          // ❗️ Message chiqishga ulgurishi uchun biroz delay
          setTimeout(() => {
            clear(); // savatni tozalash
            onClose(); // modalni yopish
          }, 1300);
        },
        onError: (err: any) => {
          messageApi.error(err.message || "❌ Buyurtma yaratishda xatolik");
        },
      },
    );
  };

  return (
    <>
      {contextHolder} {/* ✅ message uchun kerak */}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="💳 To‘lov usulini tanlang"
      >
        <Radio.Group
          onChange={(e) => setMethod(e.target.value)}
          value={method}
          className="flex flex-col gap-3"
        >
          <Radio value="cash">💵 Naqd pul</Radio>
          <Radio value="card">💳 Karta orqali</Radio>
          <Radio value="click">📱 Click/Payme</Radio>
        </Radio.Group>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-lg font-bold">Jami: {total} UZS</div>
          <Button
            type="primary"
            disabled={!method || createOrder.isPending}
            loading={createOrder.isPending}
            onClick={handlePay}
          >
            Buyurtma Berish
          </Button>
        </div>
      </Modal>
    </>
  );
};
