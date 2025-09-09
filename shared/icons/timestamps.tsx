import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconTimestamps = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M9.5 5V5C8.57099 5 8.10649 5 7.71783 5.06156C5.57837 5.40042 3.90042 7.07837 3.56156 9.21783C3.5 9.60649 3.5 10.071 3.5 11V13C3.5 15.8003 3.5 17.2004 4.04497 18.27C4.52433 19.2108 5.28924 19.9757 6.23005 20.455C7.29961 21 8.69974 21 11.5 21H13.5C16.3003 21 17.7004 21 18.77 20.455C19.7108 19.9757 20.4757 19.2108 20.955 18.27C21.5 17.2004 21.5 15.8003 21.5 13V11C21.5 10.071 21.5 9.60649 21.4384 9.21783C21.0996 7.07837 19.4216 5.40042 17.2822 5.06156C16.8935 5 16.429 5 15.5 5V5M9.5 5V6.5M9.5 5V3M9.5 5H15.5M15.5 5V3M15.5 5V6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconTimestamps.displayName = "IconTimestamps";

export { IconTimestamps };
