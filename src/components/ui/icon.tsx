import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";

export function Icon({
  as: IconComponent,
  className,
  size = 20,
}: {
  as: LucideIcon;
  className?: string;
  size?: number;
}) {
  const Styled = cssInterop(IconComponent, { className: { target: "style" } });
  return <Styled className={className} size={size} />;
}
