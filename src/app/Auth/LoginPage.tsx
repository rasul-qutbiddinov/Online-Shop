/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoImg } from "@/assets";
import { HelpIcon, LockIcon, UserIcon } from "@/assets/icons";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "@/hooks/useTranslations";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Tooltip, type FormProps } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios"; // axios instance

type LoginPayload = { username: string; password: string };
type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
    username: string;
    email: string;
    role: string;
  };
};

// 🔹 Statik admin login
const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const { username, password } = credentials;
  const adminUsernames = ["admin", "ADMIN", "Admin", "Superadmin"];
  const adminPassword = "admin123";

  if (adminUsernames.includes(username) && password === adminPassword) {
    return {
      success: true,
      message: "Admin login successful",
      data: {
        token: "static-admin-token",
        type: "Bearer",
        username: "Admin",
        email: "admin@test.com",
        role: "ADMIN",
      },
    };
  }

  const response = await api.post<LoginResponse>("/auth/login", credentials, {
    headers: { "Accept-Language": "uz" },
  });
  return response.data;
};

function LoginPage() {
  const navigate = useNavigate();
  const t = useTranslations().login;

  const { setToken, setUser, token, user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleRedirect = (role: string) => {
    const routes: Record<string, string> = {
      ADMIN: `/uz/dashboard/products`,
      USER: `/uz/shop`,
    };
    const target = routes[role] || `/uz`;
    navigate(target, { replace: true });
  };

  // Agar token bo'lsa, sahifa avtomatik yo'naltiriladi
  useEffect(() => {
    if (token && user?.role) {
      handleRedirect(user.role);
    }
  }, [token, user]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      const { token: authToken, username, email, role } = res.data;
      setToken(authToken);
      setUser({ username, email, role });

      messageApi.success(t.loginSuccess);

      setTimeout(() => handleRedirect(role), 400);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || error?.message || t.loginError;
      messageApi.error(errorMsg);
    },
  });

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    loginMutation.mutate({
      username: values.identity,
      password: values.password,
    });
  };

  const onFinishFailed: FormProps<any>["onFinishFailed"] = () => {
    messageApi.error(t.formError);
  };

  return (
    <PageTransition>
      {contextHolder}
      <div className="flex h-screen w-full">
        <div className="flex w-full items-center justify-center bg-[#f3cd4e] max-lg:mx-5">
          <div className="w-full max-w-[456px] rounded-[24px] border border-[#E9EAEB] bg-white p-10">
            <div className="font-inter space-y-3 text-center">
              <h3 className="text-xl font-bold text-black">{t.title}</h3>
              <p className="text-sm font-medium text-[#777]">{t.subtitle}</p>
            </div>

            <div className="mt-8 w-full max-w-[333px]">
              <Form
                form={form}
                name="login page form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                className="!space-y-4"
                requiredMark={false}
                disabled={loginMutation.isPending}
              >
                <Form.Item
                  label={
                    <p className="flex items-center gap-1 text-sm font-medium text-[#414651]">
                      {t.loginLabel}{" "}
                      <span className="text-xl text-[#7F56D9]">*</span>
                    </p>
                  }
                  name="identity"
                  rules={[
                    { required: true, message: t.loginRequired },
                    { min: 3, message: t.loginMinLength },
                  ]}
                >
                  <Input
                    placeholder={t.loginPlaceholder}
                    prefix={<UserIcon />}
                    suffix={
                      <Tooltip placement="topLeft" title={t.loginTooltip}>
                        <HelpIcon />
                      </Tooltip>
                    }
                    size="large"
                    disabled={loginMutation.isPending}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <p className="flex items-center gap-1 text-sm font-medium text-[#414651]">
                      {t.passwordLabel}{" "}
                      <span className="text-xl text-[#7F56D9]">*</span>
                    </p>
                  }
                  name="password"
                  rules={[
                    { required: true, message: t.passwordRequired },
                    { min: 6, message: t.passwordMinLength },
                  ]}
                >
                  <Input.Password
                    placeholder={t.passwordPlaceholder}
                    prefix={<LockIcon />}
                    suffix={
                      <Tooltip placement="topLeft" title={t.passwordTooltip}>
                        <HelpIcon />
                      </Tooltip>
                    }
                    size="large"
                    disabled={loginMutation.isPending}
                  />
                </Form.Item>

                <Form.Item label={null} className="!mt-8">
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
                    loading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? t.loggingIn : t.loginBtn}
                  </Button>
                </Form.Item>

                <Form.Item className="!mt-2 text-center">
                  <Button
                    type="link"
                    style={{ color: "#F8CA32", fontWeight: 600 }}
                    onClick={() => navigate("/register")}
                  >
                    Roʻyxatdan oʻtish
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center max-lg:hidden">
          <img
            src={LogoImg}
            alt="login page image"
            className="mb-30 w-full max-w-[300px] object-cover"
          />
          <h1 className="absolute bottom-4 mb-35 ml-10 text-6xl font-bold text-yellow-400 drop-shadow-lg">
            Online Shop
          </h1>
        </div>
      </div>
    </PageTransition>
  );
}

export default LoginPage;
