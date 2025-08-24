import { Layout, Input, Avatar, Button } from "antd";
import {
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogoImg, UserIcon2 } from "@/assets";
import { SearchIcon } from "@/assets/icons";
import { useAuth } from "@/hooks/useAuth"; // <-- useAuth qo‘shildi
import { CartModal } from "@/app/shop/CartModal";
import { useState } from "react";

const { Header, Content } = Layout;

function UserLayout() {
  const navigate = useNavigate();
   const [open, setOpen] = useState(false);
  const location = useLocation();
  const { setToken, setUser } = useAuth(); // <-- token va user state update

  // URL’dan til segmentini olish (faqat 'uz' yoki 'ru')
  const segments = location.pathname.split("/");
  const lang = segments[1] === "ru" ? "ru" : "uz";

  const handleLogout = () => {
    // tokenni va userni tozalash
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // localStorage’dan ham o‘chirish
    navigate("/login", { replace: true }); // login sahifasiga yo‘naltirish
  };

  return (
    <Layout className="min-h-screen">
      {/* NAVBAR */}
      <Header className="flex h-16 items-center justify-between !bg-yellow-400 px-6 text-white shadow">
        {/* Logo */}
        <div
          className="flex cursor-pointer items-center space-x-2"
          onClick={() => navigate(`/${lang}/shop`)}
        >
          <img src={LogoImg} alt="logo" className="h-10 w-10" />
          <span className="text-xl font-bold">Online Shop</span>
        </div>

        {/* Catalog + Search */}
        <div className="mx-6 flex max-w-lg flex-1 items-center space-x-4">
          {/* <Dropdown>
            <Button className="flex items-center gap-2 rounded bg-transparent px-4 py-2 font-medium text-yellow-500 hover:bg-yellow-100">
              Каталог
            </Button>
          </Dropdown> */}
          <Input
            type="search"
            suffix={<SearchIcon />}
            placeholder="Search products and categories"
            className="input-shadow h-10 w-full max-w-[620px]"
            allowClear
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 space-x-6">
          {/* Savat */}
          <Button
            icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />} // ikonani kattalashtirish
            className="rounded-full p-4 bg-yellow-100" // button padding va radius
            type="text"
            onClick={() => setOpen(true)}
          />
          <CartModal open={open} onClose={() => setOpen(false)} />

          {/* Profil */}
          <Avatar
            size={36}
            className="cursor-pointer"
            src={UserIcon2}
            alt="User Avatar"
            onClick={() => navigate(`/${lang}/profile`)}
          />

          {/* Chiqish tugmasi */}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className="!text-white hover:!text-gray-200"
            onClick={handleLogout}
          >
            Chiqish
          </Button>
        </div>
      </Header>

      {/* PAGE CONTENT */}
      <Content className="min-h-[calc(100vh-64px)] bg-gray-50 p-6">
        <Outlet />
      </Content>
    </Layout>
  );
}

export default UserLayout;
