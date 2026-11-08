type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const PlusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);

export const MinusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M4 12h16" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const InstagramIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const PhoneIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a11 11 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a1.9 1.9 0 0 1-2 1.9A15.6 15.6 0 0 1 4.6 5.5a1.9 1.9 0 0 1 2-2Z" />
  </svg>
);

export const WhatsAppIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2.5a9.45 9.45 0 0 0-8.1 14.33L2.5 21.5l4.8-1.4a9.46 9.46 0 1 0 4.74-17.6Zm0 17.25a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.85.83.85-2.78-.19-.3a7.8 7.8 0 1 1 6.46 3.51Zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.4 6.4 0 0 1-1.88-1.16 7.06 7.06 0 0 1-1.3-1.62c-.14-.23 0-.36.1-.47.1-.1.23-.27.35-.41.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.53-1.27-.72-1.74-.19-.46-.38-.39-.53-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.94c0 1.14.83 2.25.95 2.4.12.16 1.64 2.5 3.97 3.5.55.24.99.39 1.32.5.56.17 1.06.15 1.46.09.45-.07 1.38-.56 1.57-1.1.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.27Z" />
  </svg>
);

export const MenuIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.5 8.5h17M3.5 15.5h17" />
  </svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4 rtl:-scale-x-100" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const FacebookIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M14.5 8.5h2V5h-2.6c-2.4 0-3.9 1.6-3.9 4.1v2H8v3.4h2V21h3.4v-6.5h2.6l.5-3.4h-3.1V9.6c0-.7.4-1.1 1.1-1.1Z" />
  </svg>
);

export const PlayIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </svg>
);

export const PauseIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z" />
  </svg>
);

export const NextIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M5 6v12l9-6-9-6Zm10 0h2.5v12H15z" />
  </svg>
);

export const PrevIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M19 6v12l-9-6 9-6ZM9 6H6.5v12H9z" />
  </svg>
);

export const ShuffleIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.8 0 3-1.6 4.1-3.6M13.4 9.6C14.5 8 15.7 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3" />
  </svg>
);

export const VolumeIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5ZM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
  </svg>
);

export const DownloadIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />
  </svg>
);

export const YouTubeIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
    <path d="m10 9.2 5 2.8-5 2.8V9.2Z" fill="currentColor" />
  </svg>
);

export const AppleMusicIcon = ({ className = "h-[18px] w-[18px]" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M9 17.5V6.8l10-2.3v10.7" />
    <circle cx="6.8" cy="17.6" r="2.3" />
    <circle cx="16.8" cy="15.3" r="2.3" />
  </svg>
);

export const CollapseIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.6}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);

export const ExpandIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.6}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
