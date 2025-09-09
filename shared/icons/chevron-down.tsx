import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconChevronDown = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M7 9.5L12 14.5L17 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconChevronDown.displayName = "IconChevronDown";

export { IconChevronDown };
