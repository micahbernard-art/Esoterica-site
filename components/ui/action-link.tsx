import type { ReactNode } from "react";
import Link from "next/link";

export type ActionIntent =
  | "brand"
  | "nav"
  | "primary"
  | "secondary"
  | "text"
  | "card"
  | "gateway";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  intent: ActionIntent;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  ariaCurrent?: "page";
  cursorLabel: string;
  reveal?: string;
};

/**
 * One interaction contract for route links and external actions. Visual classes
 * stay contextual; focus, cursor, motion, and touch semantics stay global.
 */
export function ActionLink({
  href,
  children,
  intent,
  className,
  external = false,
  ariaLabel,
  ariaCurrent,
  cursorLabel,
  reveal,
}: ActionLinkProps) {
  const sharedProps = {
    className,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
    "data-ui-action": intent,
    "data-cursor": "link",
    "data-cursor-label": cursorLabel,
    "data-reveal": reveal,
  } as const;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      {children}
    </Link>
  );
}
