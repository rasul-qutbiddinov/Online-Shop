/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusIcon } from "@/assets/icons";
import Navbar from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  Button,
  Pagination,
  Popconfirm,
  Table,
  Spin,
  message,
  Empty,
} from "antd";
import { useState } from "react";
import AnimatedTableWrapper from "@/components/shared/TableTransition";
import { useNavigate } from "react-router-dom";
import { useGetProducts } from "@/api/products/useGetProducts";
import { useDeleteProduct } from "@/api/products/useDeleteProducts";
import { useTranslations } from "@/hooks/useTranslations";

function ManageProducts() {
  const t = useTranslations().manageProducts;
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
 const { data, isLoading, isFetching } = useGetProducts({
   page: page - 1,
   size: pageSize,
   sortBy: "id",
   sortDir: "asc",
   isActive: undefined,
 });


  const deleteProduct = useDeleteProduct({
    onSuccess: () => messageApi.success(t.deleted),
    onError: () => messageApi.error(t.deleteError),
  });

  const products = data?.content || [];
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
      title: <p className="table-title">{t.tableProduct}</p>,
      dataIndex: "name",
      key: "name",
      width: "300px",
      render: (_: any, record: any) => (
        <div className="flex gap-3">
          <span
            className="line-clamp-2 block font-medium"
            style={{ maxWidth: 430 }}
          >
            {record.name}
          </span>
        </div>
      ),
    },
    {
      title: <p className="table-title">{t.tableCategory}</p>,
      dataIndex: "category",
      key: "category",
      width: "150px",
      render: (category: string) =>
        category ? (
          <span>{category}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: <p className="table-title">{t.tablePrice}</p>,
      dataIndex: "price",
      key: "price",
      width: "120px",
      render: (price: number) => <span>${price?.toFixed(2)}</span>,
    },
    {
      title: <p className="table-title">{t.tableStock}</p>,
      dataIndex: "stock",
      key: "stock",
      width: "100px",
    },
    {
      title: <p className="table-title">{t.tableActive}</p>,
      dataIndex: "isActive",
      key: "isActive",
      width: "120px",
      render: (isActive: boolean) =>
        isActive ? (
          <span className="font-medium text-green-600">{t.active}</span>
        ) : (
          <span className="font-medium text-red-500">{t.inactive}</span>
        ),
    },

    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex h-8 items-center">
          <Button
            className="group !h-8 !w-8 !p-0"
            type="link"
            onClick={() => navigate(`edit/${record.id}`)}
            aria-label={t.editBtn}
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
          <Popconfirm
            title={t.deleteConfirm}
            okText={t.deleteOk}
            cancelText={t.deleteCancel}
            onConfirm={() =>
              deleteProduct.mutate({ id: record.id, lang: "uz" })
            }
            okButtonProps={{ loading: deleteProduct.isPending }}
          >
            <Button
              className="group !p-0"
              type="link"
              danger
              aria-label={t.deleteBtn}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.6667 11.9999V11.4666C18.6667 10.7198 18.6667 10.3465 18.5213 10.0613C18.3935 9.81038 18.1895 9.60641 17.9387 9.47858C17.6534 9.33325 17.2801 9.33325 16.5333 9.33325H15.4667C14.7199 9.33325 14.3466 9.33325 14.0613 9.47858C13.8105 9.60641 13.6065 9.81038 13.4787 10.0613C13.3333 10.3465 13.3333 10.7198 13.3333 11.4666V11.9999M14.6667 15.6666V18.9999M17.3333 15.6666V18.9999M10 11.9999H22M20.6667 11.9999V19.4666C20.6667 20.5867 20.6667 21.1467 20.4487 21.5746C20.2569 21.9509 19.951 22.2569 19.5746 22.4486C19.1468 22.6666 18.5868 22.6666 17.4667 22.6666H14.5333C13.4132 22.6666 12.8532 22.6666 12.4254 22.4486C12.049 22.2569 11.7431 21.9509 11.5513 21.5746C11.3333 21.1467 11.3333 20.5867 11.3333 19.4666V11.9999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-[#FFCB1D] transition-colors duration-200 group-hover:stroke-red-500"
                />
              </svg>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      {contextHolder}
      <Navbar title={t.pageTitle} description="" />

      <div>
        <div className="mb-10 rounded-xl border border-[#E9EAEB] shadow-xs">
          <div className="flex items-center justify-between gap-5 px-6 py-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] leading-[28px] font-semibold text-[#181D27]">
                {t.cardTitle}
              </h3>
              <div className="rounded-[6px] border border-[#D5D7DA] px-[6px] py-[2px] shadow-xs">
                <p className="text-[12px] leading-[18px] font-medium text-[#414651]">
                  {t.cardCount.replace("{count}", String(totalItems))}
                </p>
              </div>
              <Button
                type="primary"
                className="!ml-110 !h-10 text-[14px] leading-5 font-semibold !shadow-xs"
                onClick={() => navigate("add-product")}
              >
                <PlusIcon />
                {t.addBtn}
              </Button>
            </div>
            {isFetching && <Spin size="small" />}
          </div>

          <div className="border-t border-t-[#E9EAEB]">
            <AnimatedTableWrapper dependencyKey={page}>
              <Table
                columns={columns}
                dataSource={products}
                pagination={false}
                rowKey="id"
                loading={isLoading}
                locale={{
                  emptyText: (
                    <div className="flex min-h-[30vh] items-center justify-center">
                      <Empty description={t.notFound} />
                    </div>
                  ),
                }}
              />
            </AnimatedTableWrapper>
            <div className="flex items-center justify-between px-6 pt-3 pb-4">
              <span className="text-gray-400">
                {`${t.page} ${products.length === 0 ? 0 : page} ${t.of} ${totalPages}`}
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
    </PageTransition>
  );
}

export default ManageProducts;
