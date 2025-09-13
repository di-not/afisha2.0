import { forwardRef, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const IconEvents = forwardRef<SVGSVGElement, Props>((props, ref) => {
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
        d="M12 21.0005C16.9706 21.0005 21 16.9711 21 12.0005C21 10.7591 20.7487 9.57639 20.2941 8.5005M12 21.0005C7.02944 21.0005 3 16.9711 3 12.0005C3 10.7591 3.25134 9.57637 3.70591 8.50047M12 21.0005C14.412 19.386 16 15.1209 16 12.0005C16 8.88007 14.412 4.61501 12 3.00049M12 21.0005C9.58803 19.386 8 15.1209 8 12.0005C8 8.88007 9.58803 4.61501 12 3.00049M12 3.00049C8.27085 3.00049 5.07143 5.26854 3.70591 8.50047M12 3.00049C13.7609 3.00049 15.4038 3.50622 16.7911 4.38037M3.70591 8.50047C5.07143 11.7324 8.27085 14.0005 12 14.0005C15.7292 14.0005 18.9286 11.7324 20.2941 8.5005M20.2941 8.5005C20.1039 8.05023 19.878 7.61867 19.6201 7.20935"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconEvents.displayName = "IconEvents";

export { IconEvents };
