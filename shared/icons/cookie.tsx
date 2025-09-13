import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconCookie = forwardRef<SVGSVGElement, Props>((props, ref) => {
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
        d="M20.0649 15.9995C20.5371 15.0491 20.8462 14.0035 20.9557 12.8991L21 11.9971H20.0998C17.7007 11.9693 17.0435 11.6996 16.289 9.08608L16 7.99951L14.9691 8.44419C11.9928 9.50171 10.4875 7.92109 11.5616 4.25659L12 2.99951L10.6751 3.09717C6.33268 3.73784 3 7.47989 3 12.0003C3 16.9709 7.02944 21.0003 12 21.0003C14.0707 21.0003 15.9781 20.301 17.4988 19.1257"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"
        fill="currentColor"
      />
      <path
        d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z"
        fill="currentColor"
      />
      <path
        d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
        fill="currentColor"
      />
      <path
        d="M12 17C12 17.5523 11.5523 18 11 18C10.4477 18 10 17.5523 10 17C10 16.4477 10.4477 16 11 16C11.5523 16 12 16.4477 12 17Z"
        fill="currentColor"
      />
      <path
        d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
        fill="currentColor"
      />
    </svg>
  );
});

IconCookie.displayName = "IconCookie";

export { IconCookie };
