/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Select, Button } from "antd";
import { useUpdateOrderStatus } from "@/api/orders/useUpdateOrderStatus";

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: number;
  currentStatus: string;
}

const statusOptions = [
  { value: "PENDING", label: "⏳ Kutilmoqda" },
  { value: "CONFIRMED", label: "✅ Tasdiqlangan" },
  { value: "DELIVERED", label: "🚚 Yetkazilgan" },
  { value: "CANCELLED", label: "❌ Bekor qilingan" },
];

export const UpdateOrderStatusModal = ({
  open,
  onClose,
  orderId,
  currentStatus,
}: Props) => {
  const [form] = Form.useForm();
  const updateStatus = useUpdateOrderStatus({
    onSuccess: () => {
      onClose();
      form.resetFields();
    },
  });

  const onFinish = (values: { status: string }) => {
    updateStatus.mutate({
      id: orderId,
      data: { status: values.status as any },
    });
  };

  return (
    <Modal
      open={open}
      title="Buyurtma holatini o‘zgartirish"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: currentStatus }}
      >
        <Form.Item
          name="status"
          label="Yangi holat"
          rules={[{ required: true, message: "Holatni tanlang!" }]}
        >
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Yangilash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
