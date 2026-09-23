import { useTranslation } from "../../utils/useTranslation";
import "./_Ad.scss";

export default function Ad({ hasAd = true }) {
  const { t } = useTranslation();
  if (!hasAd) return null;

  return (
    <div className="ad">
      <p>{t("footerAdvertising")}</p>
    </div>
  );
}
