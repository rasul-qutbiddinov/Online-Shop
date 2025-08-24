import { LogOutIcon } from "@/assets/icons";
import { useAuth } from "@/hooks/useAuth";
import { Button, message, Popconfirm } from "antd";
import { LanguageDropdown } from "./LanguageSwitcher";

interface IProps {
  title: string;
  description: string;
}

function Navbar({ title, description }: IProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { user, setToken, setUser } = useAuth();

  const confirm = () => {
    messageApi.success("Вы успешно вышли из системы.");
    setTimeout(() => {
      setToken(null);
      setUser(null);
    }, 800);
  };

  const userName = user?.name || "Admin";
  const userAvatar = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/api/files/users/${user.id}/${user.avatar}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  const roleText =
    user?.role === "superadmin"
      ? "superadmin"
      : user?.role === "admin"
        ? "admin"
        : "foydalanuvchi";

  return (
    <div className="mb-8 flex items-center justify-between gap-5 rounded-xl border border-[#E9EAEB] px-6 py-[16.5px]">
      {contextHolder}
      <div>
        <h3 className="text-2xl font-semibold text-[#181D27]">{title}</h3>
        <p className="text-[16px] leading-6 text-[#535862]">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* 1. TIL TANLASH DROPDOWN */}
        <LanguageDropdown />

        {/* 2. AVATAR */}
        <div className="relative h-10 w-10">
          <img
            src={userAvatar}
            alt="user image"
            className="h-10 w-10 rounded-full object-cover"
          />
          {/* Status */}
          <div className="absolute right-0 bottom-0 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white">
            <span className="h-[10px] w-[10px] rounded-full bg-[#17B26A]" />
          </div>
        </div>

        {/* 3. Ism, familya, rol */}
        <div>
          <h4 className="text-[14px] leading-5 font-semibold text-[#181D27]">
            {userName}
          </h4>
          <p className="text-[14px] leading-5 text-[#535862]">{roleText}</p>
        </div>
        <Popconfirm
          title="Выйти из системы"
          description="Вы уверены, что хотите выйти?"
          onConfirm={confirm}
          okText="Да"
          cancelText="Нет"
          placement="leftBottom"
        >
          <Button className="ml-[15px]" variant="solid" type="text">
            <LogOutIcon />
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}

export default Navbar;
