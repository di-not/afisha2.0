import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconFavorite = forwardRef<SVGSVGElement, Props>((props, ref) => {
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
        d="M19.463 3.99404C16.781 2.34904 14.44 3.01204 13.034 4.06804C12.458 4.50104 12.17 4.71804 12 4.71804C11.83 4.71804 11.542 4.50104 10.966 4.06804C9.56 3.01204 7.219 2.34904 4.537 3.99404C1.018 6.15304 0.221996 13.274 8.34 19.284C9.886 20.427 10.659 21 12 21C13.341 21 14.114 20.428 15.66 19.283C23.778 13.275 22.982 6.15304 19.463 3.99404Z"
        fill="inherit"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconFavorite.displayName = "IconFavorite";

export { IconFavorite };
