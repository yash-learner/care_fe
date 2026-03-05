import { navigate } from "raviger";

import { Button } from "@/components/ui/button";

import useAppHistory from "@/hooks/useAppHistory";

type BackButtonProps = {
  to?: string;
  fallbackUrl?: string;
} & Omit<React.ComponentProps<typeof Button>, "onClick">;

export default function BackButton({
  to,
  fallbackUrl,
  ...props
}: BackButtonProps) {
  const { history, signalBackNavigation } = useAppHistory();

  to ??= history[1] ?? fallbackUrl;

  if (!to) {
    return null;
  }

  const handleClick = () => {
    signalBackNavigation();
    navigate(to!, { replace: true });
  };

  return (
    <Button
      variant="outline"
      data-shortcut-id="go-back"
      onClick={handleClick}
      {...props}
    >
      {props.children}
    </Button>
  );
}
