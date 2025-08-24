import { RightIcon } from "@/assets/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

interface IProps {
  back: string;
  current: string;
}

function CustomBreadcrumb({ back, current }: IProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center gap-1">
      <Button
        onClick={() => navigate(-1)}
        variant="solid"
        type="text"
        className="text-[14px] leading-5 !font-semibold !text-[#535862] hover:!bg-[#fafafa]"
      >
        {back}
      </Button>

      <RightIcon />

      <Button
        type="default"
        variant="text"
        className="!cursor-text !border-0 !bg-[#FAFAFA] text-[14px] leading-5 !font-semibold !text-[#414651] !shadow-none"
      >
        {current}
      </Button>
    </div>
  );
}

export default CustomBreadcrumb;
