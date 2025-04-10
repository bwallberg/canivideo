import styles from "./icons.module.css";

export function Unknown() {
  return (
    <svg
      className={styles.unknown}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.87988 8.53992C9.18539 7.87725 9.70251 7.33494 10.3499 6.99828C10.9973 6.66163 11.7382 6.54975 12.4562 6.68023C12.9476 6.75705 13.4144 6.94734 13.8195 7.23602C14.2245 7.52468 14.5567 7.90377 14.7897 8.34322C14.9567 8.6954 15.0473 9.0789 15.0554 9.46856C15.0636 9.85821 14.9893 10.2452 14.8373 10.6041C14.6853 10.963 14.4591 11.2856 14.1736 11.5509C13.8879 11.8161 13.5495 12.0179 13.1804 12.1431C12.8046 12.287 12.4795 12.5384 12.2458 12.8659C12.0119 13.1935 11.88 13.5827 11.8661 13.9848V14.7448"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M11.96 17.1616H11.9689"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="6"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>
  );
}

export function NotSupported() {
  return (
    <svg
      className={styles["not-supported"]}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8543 8.146L8.146 15.8543"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.8543 15.8543L8.146 8.146"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="6"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>
  );
}

export function Supported() {
  return (
    <svg
      className={styles.supported}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.39258 12.084L9.98594 14.6774C10.0772 14.7697 10.1858 14.843 10.3056 14.8931C10.4253 14.9431 10.5539 14.9689 10.6837 14.9689C10.8134 14.9689 10.942 14.9431 11.0617 14.8931C11.1815 14.843 11.2901 14.7697 11.3814 14.6774L16.6076 9.45117"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="6"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>
  );
}
