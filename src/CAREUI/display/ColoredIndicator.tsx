import { cn } from "@/lib/utils";

const colorForID = (uuid: string, pallete: string[]) => {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pallete[Math.abs(hash) % pallete.length];
};

interface Props {
  id: string;
  pallete?: string[];
  className?: string;
}

/**
 * Returns a div with a background color from the pallete based on specified `id`.
 * Just to consistently get back the same color for a given id.
 */
export default function ColoredIndicator(props: Props) {
  return (
    <div
      className={cn(
        props.className,
        colorForID(
          props.id,
          props.pallete ?? [
            "bg-amber-600",
            "bg-blue-600",
            "bg-red-500",
            "bg-red-700",
            "bg-primary-400",
            "bg-primary-500",
            "bg-zinc-600",
          ],
        ),
      )}
    />
  );
}
