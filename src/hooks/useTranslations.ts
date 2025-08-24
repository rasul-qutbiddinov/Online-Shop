import { uz } from "@/locales/uz";
import { ru } from "@/locales/ru";

const translations = { uz, ru };

export const useTranslations = () => {
  return translations.uz; // login/register sahifalarda doim uz
};
