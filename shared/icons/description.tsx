import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconDescription = forwardRef<SVGSVGElement, Props>((props, ref) => {
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
        d="M5.5 19V10.2C5.5 7.20021 5.5 5.70032 6.26393 4.64886C6.51065 4.30928 6.80928 4.01065 7.14886 3.76393C8.20032 3 9.70021 3 12.7 3H17.7C18.4499 3 18.8249 3 19.0878 3.19098C19.1727 3.25266 19.2473 3.32732 19.309 3.41221C19.5 3.67508 19.5 4.05005 19.5 4.8V19M9.5 7H15.5M9.5 10H13.5M7 21H18C18.4659 21 18.6989 21 18.8827 20.9239C19.1277 20.8224 19.3224 20.6277 19.4239 20.3827C19.5 20.1989 19.5 19.9659 19.5 19.5V19.5C19.5 19.0341 19.5 18.8011 19.4239 18.6173C19.3224 18.3723 19.1277 18.1776 18.8827 18.0761C18.6989 18 18.4659 18 18 18H7C6.17157 18 5.5 18.6716 5.5 19.5V19.5C5.5 20.3284 6.17157 21 7 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconDescription.displayName = "IconDescription";

export { IconDescription };
