/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Space,
  message,
} from "antd";
import { useGetProducts } from "@/api/products/useGetProducts";
import { useCreateOrder } from "@/api/orders/useCreateOrders";

const AddOrderModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const { data: productsData } = useGetProducts({ size: 100 }); // barcha productlar
const createOrder = useCreateOrder({
  onSuccess: () => {
    message.success("✅ Buyurtma qo‘shildi");
    form.resetFields();
    onClose();
  },
    onError: () => {
      message.error("❌ Buyurtma qo‘shishda xatolik!");
    },
  });

  const onFinish = (values: any) => {
    const payload = {
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      phone: values.phone,
      address: values.address,
      orderItems: values.orderItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    createOrder.mutate(payload);
  };

  return (
    <Modal
      title="🆕 Buyurtma qo‘shish"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Mijoz ma'lumotlari */}
        <Form.Item
          label="Mijoz ismi"
          name="customerName"
          rules={[{ required: true, message: "Mijoz ismini kiriting" }]}
        >
          <Input placeholder="Mijoz ismi" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="customerEmail"
          rules={[{ required: true, type: "email", message: "Email kiriting" }]}
        >
          <Input placeholder="Mijoz email" />
        </Form.Item>
        <Form.Item label="Telefon raqam" name="phone">
          <Input placeholder="+998 90 123 45 67" />
        </Form.Item>
        <Form.Item label="Manzil" name="address">
          <Input.TextArea rows={2} placeholder="Mijoz manzili" />
        </Form.Item>

        {/* Mahsulot tanlash */}
        <Form.List
          name="orderItems"
          initialValue={[{ productId: undefined, quantity: 1 }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline" className="mb-3 flex">
                  <Form.Item
                    {...rest}
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Mahsulotni tanlang" }]}
                  >
                    <Select
                      placeholder="Mahsulotni tanlang"
                      style={{ width: 250 }}
                      showSearch
                      optionFilterProp="children"
                      options={productsData?.content.map((p) => ({
                        value: p.id,
                        label: `${p.name} (${p.price} UZS)`,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...rest}
                    name={[name, "quantity"]}
                    initialValue={1}
                    rules={[{ required: true, message: "Soni kiriting" }]}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>
                    ❌
                  </Button>
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                ➕ Mahsulot qo‘shish
              </Button>
            </>
          )}
        </Form.List>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} className="mr-2">
            Bekor qilish
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createOrder.isPending}
          >
            Saqlash
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
