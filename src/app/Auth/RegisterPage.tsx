/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoImg } from "@/assets";
import { LockIcon, UserIcon } from "@/assets/icons";
import { PageTransition } from "@/components/shared/PageTransition";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, type FormProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios"; // axios instance

// Backend API orqali ro‘yxatdan o‘tish funksiyasi
const registerUser = async (credentials: {
  email: string;
  username: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/register", credentials, {
    headers: { "Accept-Language": "uz" },
  });
  return data;
};

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "ru";
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      messageApi.success(
        "Roʻyxatdan oʻtish muvaffaqiyatli! Endi kirish sahifasiga o‘ting.",
      );
      setTimeout(() => {
        navigate("/login", { replace: true }); // login page ga yo‘naltirish
      }, 1000);
    },
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    registerMutation.mutate(values);
  };

  const onFinishFailed: FormProps<any>["onFinishFailed"] = () => {
    messageApi.error("Iltimos, formani toʻliq toʻldiring");
  };

  return (
    <PageTransition>
      {contextHolder}
      <div className="flex h-screen w-full">
        {/* Chap panel */}
        <div className="flex w-full items-center justify-center bg-[#f3cd4e] max-lg:mx-5">
          <div className="w-full max-w-[456px] rounded-[24px] border border-[#E9EAEB] bg-white p-10">
            <div className="font-inter space-y-3 text-center">
              <h3 className="text-xl font-bold text-black">
                Roʻyxatdan oʻtish
              </h3>
              <p className="text-sm font-medium text-[#777]">
                Hisob yaratish uchun maʼlumotlarni kiriting
              </p>
            </div>

            <div className="mt-8 w-full max-w-[333px]">
              <Form
                form={form}
                name="register page form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                className="!space-y-4"
                requiredMark={false}
                disabled={registerMutation.isPending}
              >
                {/* Email */}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email kiriting" },
                    { type: "email", message: "Email notoʻgʻri formatda" },
                  ]}
                >
                  <Input
                    placeholder="example@mail.com"
                    size="large"
                    disabled={registerMutation.isPending}
                  />
                </Form.Item>

                {/* Username */}
                <Form.Item
                  label="Foydalanuvchi nomi"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Foydalanuvchi nomini kiriting",
                    },
                    { min: 3, message: "Kamida 3 ta belgi boʻlishi kerak" },
                  ]}
                >
                  <Input
                    placeholder="username"
                    prefix={<UserIcon />}
                    size="large"
                    disabled={registerMutation.isPending}
                  />
                </Form.Item>

                {/* Password */}
                <Form.Item
                  label="Parol"
                  name="password"
                  rules={[
                    { required: true, message: "Parolni kiriting" },
                    { min: 6, message: "Kamida 6 ta belgi boʻlishi kerak" },
                  ]}
                >
                  <Input.Password
                    placeholder="********"
                    prefix={<LockIcon />}
                    size="large"
                    disabled={registerMutation.isPending}
                  />
                </Form.Item>

                {/* Submit */}
                <Form.Item className="!mt-8">
                  <Button
                    htmlType="submit"
                    className="w-full"
                    size="large"
                    style={{
                      background: "#F8CA32",
                      borderColor: "#F8CA32",
                      color: "#181D27",
                      fontWeight: 600,
                    }}
                    loading={registerMutation.isPending}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Yuklanmoqda..."
                      : "Roʻyxatdan oʻtish"}
                  </Button>
                </Form.Item>

                {/* Back to login */}
                <Form.Item className="!mt-2 text-center">
                  <Button
                    type="link"
                    style={{ color: "#F8CA32", fontWeight: 600 }}
                    onClick={() => navigate(`/${lang}/login`)}
                  >
                    Kirish sahifasiga qaytish
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>

        {/* O‘ng panel */}
        <div className="relative flex w-full items-center justify-center max-lg:hidden">
          <img
            src={LogoImg}
            alt="register page image"
            className="w-full max-w-[300px] object-cover"
          />
          <h1 className="absolute bottom-4 text-6xl font-bold text-yellow-400 drop-shadow-lg">
            Online Shop
          </h1>
        </div>
      </div>
    </PageTransition>
  );
}

export default RegisterPage;
