import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { LangIcon } from "@/assets/icons";

const languages = [
  { value: "uz", label: "O'z" },
  { value: "ru", label: "Ру" },
];

export function LanguageDropdown() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1];
  const path = location.pathname.split("/").slice(2).join("/");

 const handleMenuClick = ({ key }: { key: string }) => {
   if (key !== lang) {
     navigate(`/${key}/${path}`);
   }
 };


  const items = languages.map((l) => ({
    key: l.value,
    label: (
      <div className="flex items-center gap-2 px-2 py-1">
        <span>{l.label}</span>
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomLeft"
      trigger={["click"]}
      arrow
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-[#c0bbbb7a] px-3 py-1.5"
        style={{ minWidth: 70 }}
      >
        {/* Icon chapda sariq fon bilan */}
        <span className="flex h-7 w-7 items-center justify-center rounded-lg">
          <LangIcon/>
        </span>
        {/* Matn */}
        <span className="text-[16px] font-semibold text-[#2A221D]">
          {languages.find((l) => l.value === lang)?.label || "O'z"}
        </span>
        {/* Pastga strelka */}
        <svg width="18" height="18" fill="none">
          <path
            d="M5 7.5L9 11.5L13 7.5"
            stroke="#222"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </Dropdown>
  );
}
