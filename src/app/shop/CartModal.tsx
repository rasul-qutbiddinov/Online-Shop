import { Modal, Button, List, Checkbox } from "antd";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CheckoutModal } from "./CheckoutModal";

type CartModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CartModal = ({ open, onClose }: CartModalProps) => {
  const { items, remove, clear, update } = useCart();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="🛒 Savatcha">
      {items.length === 0 ? (
        <p>Savat bo‘sh</p>
      ) : (
        <>
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button danger onClick={() => remove(item.id)}>
                    O‘chirish
                  </Button>,
                ]}
              >
                <div className="flex w-full items-center gap-4">
                  {/* ✅ Checkbox */}
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />

                  <span className="flex-1">{item.name}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() =>
                        update(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    />
                    <span>{item.quantity}</span>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => update(item.id, item.quantity + 1)}
                    />
                  </div>

                  <span>{item.price} UZS</span>
                  <strong>= {item.price * item.quantity} UZS</strong>
                </div>
              </List.Item>
            )}
          />

          {/* Pastki panel */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-lg font-bold">Jami: {totalPrice} UZS</div>
            <div className="flex gap-2">
              <Button danger onClick={clear}>
                Savatni tozalash
              </Button>
              <Button
                type="primary"
                disabled={selectedItems.length === 0}
                onClick={() => setCheckoutOpen(true)}
              >
                Buyurtmani rasmiylashtirish
              </Button>

              <CheckoutModal
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                order={selectedItems} // 🟢 yuboramiz
                total={totalPrice} // 🟢 umumiy summa
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
