/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu } from "antd";
import { useState } from "react";
import type { MenuProps } from "antd";
import { DocsIcon } from "@/assets/icons";
import { LogoImg } from "@/assets";
import { cn } from "@/lib/utils";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function MainLayout() {
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split("/");
  const lang = segments[1] || "ru";
  const path = "/" + segments.slice(2).join("/");

  const selectedKey = path.replace(/^\/dashboard/, "") || "/products";
  const items: MenuItem[] = [
    {
      key: "/statistica",
      icon: <DocsIcon />,
      label: "Statistika",
    },
    {
      key: "/products",
      icon: <DocsIcon />,
      label: "Mahsulotlar",
    },
    {
      key: "/orders",
      icon: <DocsIcon />,
      label: "Buyurtmalar",
    },
  ];
  const handleMenuClick = ({ key }: any) => {
    navigate(`/${lang}/dashboard${key}`);
  };
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#FFCB1D" },
        components: {
          Layout: { bodyBg: "#fff" },
          Menu: {
            itemActiveBg: "#FFEDB8",
            subMenuItemBg: "#fff",
            itemSelectedBg: "#f6dc84",
            itemHoverBg: "#FFEDB8",
            itemColor: "#414651",
            itemSelectedColor: "#000",
            itemHoverColor: "#000",
            padding: 20,
            itemPaddingInline: 20,
            itemHeight: 40,
            itemMarginBlock: 6,
            subMenuItemSelectedColor: "#edbd1e",
          },
          Button: {
            primaryShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
            controlHeight: 40,
          },
        },
      }}
    >
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            position: "sticky",
            insetInlineStart: 0,
            top: 4,
            bottom: 0,
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
            background: "white",
            padding: collapsed ? "40px 0" : "40px 20px 20px",
          }}
          className="m-1 h-[calc(100vh-8px)] rounded-2xl border border-[#E9EAEB]"
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={314}
          breakpoint="xl"
          onBreakpoint={setCollapsed}
        >
          <div className={cn("flex h-full w-full flex-col justify-between")}>
            <div>
              <img
                src={LogoImg}
                alt="logo"
                className={cn(
                  collapsed
                    ? "mx-auto mb-10 block w-10 object-cover transition-all duration-300"
                    : "hidden",
                )}
              />
              <div
                className={cn(
                  "mb-8 ml-2 flex w-full max-w-[180px] items-center gap-4 transition-all duration-300",
                  collapsed && "hidden",
                )}
              >
                <img
                  src={LogoImg}
                  alt="sidebar logo"
                  className="h-[50px] w-[50px] rounded-xl object-cover"
                />
                <span className="text-3xl font-bold text-[#FFCB1D]">
                  Kitobim
                </span>
              </div>
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={items}
                style={{ border: "none" }}
                inlineCollapsed={collapsed}
                onClick={handleMenuClick}
              />
            </div>
            <div
              className={cn(
                "flex w-full items-center",
                collapsed ? "justify-center" : "justify-start",
              )}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </div>
          </div>
        </Sider>
        <div className="my-1 mr-6 ml-5 w-full">
          <Layout>
            <Outlet />
          </Layout>
        </div>
      </Layout>
    </ConfigProvider>
  );
}

export default MainLayout;
