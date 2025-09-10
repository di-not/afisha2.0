import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconEraser = forwardRef<SVGSVGElement, Props>((props, ref) => {
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
        d="M10 9L16 15M10 15L16 9M22 12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H11C9.037 4 8.056 4 7.211 4.422C6.367 4.845 5.778 5.63 4.6 7.2C2.867 9.511 2 10.667 2 12C2 13.333 2.867 14.489 4.6 16.8C5.778 18.37 6.367 19.155 7.211 19.578C8.056 20 9.037 20 11 20H14C17.771 20 19.657 20 20.828 18.828C21.999 17.656 22 15.771 22 12Z"
        stroke="#8C8F94"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconEraser.displayName = "IconEraser";

export { IconEraser };
