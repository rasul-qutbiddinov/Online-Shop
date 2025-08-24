/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  Button,
  Pagination,
  Popconfirm,
  Table,
  Spin,
  Empty,
  Tag,
  message,
} from "antd";
import { PlusIcon } from "@/assets/icons";
import { useState } from "react";
import AnimatedTableWrapper from "@/components/shared/TableTransition";
import { useGetOrders } from "@/api/orders/useOrders";
import { useDeleteOrder } from "@/api/orders/useDeleteOrder";
import AddOrderModal from "./add-orders";
import { UpdateOrderStatusModal } from "./edit-orders";

const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: "orange", label: "⏳ Kutilmoqda" },
  CONFIRMED: { color: "blue", label: "✅ Tasdiqlangan" },
  DELIVERED: { color: "green", label: "📦 Yetkazib berilgan" },
  CANCELLED: { color: "red", label: "❌ Bekor qilingan" },
};

function ManageOrders() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Qo‘shish modal
  const [openAdd, setOpenAdd] = useState(false);

  // Edit (status update) modal
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, isFetching } = useGetOrders({
    page: page - 1,
    size: pageSize,
    sortBy: "orderDate",
    sortDir: "desc",
  });

  const deleteOrder = useDeleteOrder({
    onSuccess: () => messageApi.success("Buyurtma o‘chirildi ✅"),
    onError: () => messageApi.error("Xatolik yuz berdi ❌"),
  });

  const orders = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalElements || 0;

  const columns = [
    {
      title: <p className="table-title">ID</p>,
      dataIndex: "id",
      key: "id",
      width: "80px",
    },
    {
      title: <p className="table-title">Mijoz</p>,
      key: "customerInfo",
      width: "250px",
      render: (_: any, record: any) => (
        <div>
          <p className="font-medium">{record.customerName}</p>
          <p className="text-xs text-gray-500">{record.customerEmail}</p>
        </div>
      ),
    },
    {
      title: <p className="table-title">Buyurtma mahsulotlari</p>,
      dataIndex: "orderItems",
      key: "orderItems",
      width: "300px",
      render: (items: any[]) => (
        <div>
          {items.map((item) => (
            <div key={item.id} className="text-sm">
              <span className="font-medium">{item.productName}</span>{" "}
              <span className="text-gray-500">x{item.quantity}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: <p className="table-title">Sana</p>,
      dataIndex: "orderDate",
      key: "orderDate",
      width: "200px",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: <p className="table-title">Holati</p>,
      dataIndex: "status",
      key: "status",
      width: "180px",
      render: (status: string) => {
        const st = statusMap[status] || { color: "default", label: status };
        return <Tag color={st.color}>{st.label}</Tag>;
      },
    },
    {
      title: <p className="table-title">Jami summa</p>,
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: "150px",
      render: (amt: number) => `${amt.toLocaleString()} UZS`,
    },
    {
      title: "",
      key: "actions",
      width: "120px",
      render: (_: any, record: any) => (
        <div className="flex h-8 items-center">
          {/* Edit tugma → status modal */}
          <Button
            className="group !h-8 !w-8 !p-0"
            type="link"
            onClick={() => {
              setSelectedOrder(record);
              setOpenEdit(true);
            }}
            aria-label="Edit Order"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M1.92 12.08C1.95 11.8 1.96 11.66 2.01 11.53C2.04 11.42 2.09 11.31 2.16 11.21C2.24 11.10 2.33 11.00 2.53 10.80L11.33 2C12.07 1.26 13.26 1.26 14 2C14.74 2.74 14.74 3.93 14 4.67L5.2 13.47C5.00 13.67 4.90 13.77 4.79 13.84C4.69 13.91 4.58 13.96 4.47 14C4.34 14.04 4.20 14.05 3.92 14.08L1.67 14.33L1.92 12.08Z"
                  stroke="#FFCB1D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-yellow-500"
                />
              </g>
            </svg>
          </Button>

          {/* ❌ Delete tugma */}
          <Popconfirm
            title="Buyurtmani bekor qilishni xohlaysizmi?"
            okText="Ha"
            cancelText="Yo‘q"
            onConfirm={() => deleteOrder.mutate({ id: record.id })}
            okButtonProps={{ loading: deleteOrder.isPending }}
          >
            <Button
              className="group !p-0"
              type="link"
              danger
              aria-label="Delete Order"
            >
              ❌
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      {contextHolder}
      <Navbar title="📦 Buyurtmalar" description="" />

      <div>
        <div className="mb-10 rounded-xl border border-[#E9EAEB] shadow-xs">
          <div className="flex items-center justify-between gap-5 px-6 py-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] leading-[28px] font-semibold text-[#181D27]">
                Buyurtmalar ro‘yxati
              </h3>
              <div className="rounded-[6px] border border-[#D5D7DA] px-[6px] py-[2px] shadow-xs">
                <p className="text-[12px] leading-[18px] font-medium text-[#414651]">
                  {totalItems} ta
                </p>
              </div>
              <div className="!ml-120 flex flex-wrap items-center gap-4">
                <Button
                  type="primary"
                  className="!h-10 text-[14px] leading-5 font-semibold !shadow-xs"
                  onClick={() => setOpenAdd(true)}
                >
                  <PlusIcon />
                  Buyurtma qo‘shish
                </Button>

                {/* Add Order Modal */}
                <AddOrderModal
                  open={openAdd}
                  onClose={() => setOpenAdd(false)}
                />
              </div>
            </div>
            {isFetching && <Spin size="small" />}
          </div>

          <div className="border-t border-t-[#E9EAEB]">
            <AnimatedTableWrapper dependencyKey={page}>
              <Table
                columns={columns}
                dataSource={orders}
                pagination={false}
                rowKey="id"
                loading={isLoading}
                locale={{
                  emptyText: (
                    <div className="flex min-h-[30vh] items-center justify-center">
                      <Empty description="Buyurtma topilmadi" />
                    </div>
                  ),
                }}
              />
            </AnimatedTableWrapper>
            <div className="flex items-center justify-between px-6 pt-3 pb-4">
              <span className="text-gray-400">
                {`Sahifa ${orders.length === 0 ? 0 : page} / ${totalPages}`}
              </span>
              <Pagination
                current={page}
                total={totalItems}
                pageSize={pageSize}
                showSizeChanger={false}
                onChange={setPage}
                hideOnSinglePage
              />
            </div>
          </div>
        </div>
      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <UpdateOrderStatusModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
        />
      )}
    </PageTransition>
  );
}

export default ManageOrders;
