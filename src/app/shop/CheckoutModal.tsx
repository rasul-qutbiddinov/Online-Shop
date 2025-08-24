/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  order: any[];
  total: number;
};

export const CheckoutModal = ({
  open,
  onClose,
  order,
  total,
}: CheckoutModalProps) => {
  const [form] = Form.useForm();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [customer, setCustomer] = useState<any>(null);

  const handleSubmit = (values: any) => {
    // ✅ LocalStorage'dan user emailini olish
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const customerData = {
      ...values,
      email: user.email, // email formdan emas, localStorage'dan
    };

    console.log("📦 Buyurtma:", order);
    console.log("👤 Mijoz ma’lumotlari:", customerData);

    setCustomer(customerData);
    setPaymentOpen(true); // ✅ To‘lov modalini ochamiz
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="📦 Buyurtmani rasmiylashtirish"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Ism"
            name="name"
            rules={[{ required: true, message: "Ismingizni kiriting" }]}
          >
            <Input placeholder="Ali Valiyev" />
          </Form.Item>

          {/* ❌ Email input olib tashlandi */}

          <Form.Item
            label="Telefon raqam"
            name="phone"
            rules={[
              { required: true, message: "Telefon raqamingizni kiriting" },
            ]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          <Form.Item
            label="Manzil"
            name="address"
            rules={[{ required: true, message: "Manzilingizni kiriting" }]}
          >
            <Input.TextArea rows={3} placeholder="Toshkent sh., Chilonzor..." />
          </Form.Item>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-bold">Jami: {total} UZS</div>
            <Button type="primary" htmlType="submit">
              Tasdiqlash
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ✅ To‘lov modali */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total}
        items={order}
        customer={customer}
      />
    </>
  );
};
