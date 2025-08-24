// FormLabel.tsx
import React from "react";

interface FormLabelProps {
  label: string;
  required?: boolean;
}

const FormTitle: React.FC<FormLabelProps> = ({ label, required = true }) => {
  return (
    <p className="flex items-center gap-1 text-sm font-medium text-[#414651]">
      {label}
      {required && <span className="text-xl text-[#262F69]">*</span>}
    </p>
  );
};

export default FormTitle;
