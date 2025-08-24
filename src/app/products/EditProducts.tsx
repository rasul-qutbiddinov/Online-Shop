/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomBreadcrumb from "@/components/shared/CustomBreadcrumb";
import FormTitle from "@/components/shared/FormTitle";
import Navbar from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Spin,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetProducts } from "@/api/products/useGetProducts";
import { useUpdateProduct } from "@/api/products/useUpdateproducts";
import { useTranslations } from "@/hooks/useTranslations";

function EditProduct() {
  const t = useTranslations().editProduct;
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Bitta mahsulotni olish (soddalashtirib umumiy product listdan filter qilamiz)
  const { data, isLoading } = useGetProducts({ page: 0, size: 100 });
  const product = data?.content.find((p) => p.id === Number(id));

  const updateProduct = useUpdateProduct({
    onSuccess: () => {
      messageApi.success(t.success);
      setTimeout(() => navigate(-1), 800);
    },
    onError: () => messageApi.error(t.error),
  });

  // Form initial values
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        isActive: product.isActive,
      });
    }
  }, [product, form]);

  const onFinish = (values: any) => {
    if (!id) {
      messageApi.error(t.idError);
      return;
    }
    updateProduct.mutate({ id: Number(id), ...values });
  };

  if (isLoading)
    return (
      <PageTransition>
        <Spin size="large" className="my-20 flex w-full justify-center" />
      </PageTransition>
    );

  return (
    <PageTransition>
      {contextHolder}
      <Navbar title={t.navbarTitle} description="" />
      <CustomBreadcrumb back={t.back} current={t.current} />
      <div className="mx-auto mb-10 w-full max-w-[520px] rounded-xl border border-[#E9EAEB] pt-6 pb-4 shadow-xs">
        <Form
          name="edit-product"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          disabled={updateProduct.isPending}
        >
          <div className="flex flex-col gap-4 px-6">
            <Form.Item
              label={<FormTitle label={t.nameLabel} />}
              name="name"
              rules={[{ required: true, message: t.nameRequired }]}
            >
              <Input placeholder={t.namePlaceholder} className="input-shadow" />
            </Form.Item>
            <Form.Item
              label={<FormTitle label={t.categoryLabel} />}
              name="category"
              rules={[{ required: true, message: t.categoryRequired }]}
            >
              <Select
                placeholder={t.categoryPlaceholder}
                options={[
                  { value: "Electronics", label: "Elektronika" },
                  { value: "Kitchen", label: "Oshxona" },
                  { value: "Furniture", label: "Mebel" },
                  { value: "Clothes", label: "Kiyimlar" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={<FormTitle label={t.priceLabel} />}
              name="price"
              rules={[{ required: true, message: t.priceRequired }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                placeholder={t.pricePlaceholder}
              />
            </Form.Item>
            <Form.Item
              label={<FormTitle label={t.stockLabel} />}
              name="stock"
              rules={[{ required: true, message: t.stockRequired }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={t.stockPlaceholder}
              />
            </Form.Item>
            <Form.Item
              label={<FormTitle label={t.activeLabel} />}
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
          <div className="flex w-full items-center justify-end gap-3 border-t border-t-[#E9EAEB] px-6 pt-4">
            <Button htmlType="button" onClick={() => form.resetFields()}>
              {t.reset}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateProduct.isPending}
              className="!shadow-xs"
            >
              {t.save}
            </Button>
          </div>
        </Form>
      </div>
    </PageTransition>
  );
}

export default EditProduct;
