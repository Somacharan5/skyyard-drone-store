// Small hand-rolled line-icon set (Feather-style) so the app has no icon-font dependency.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function make(paths, viewBox = '0 0 24 24') {
  return function IconCmp({ size = 20, className, style, ...rest }) {
    return (
      <svg width={size} height={size} viewBox={viewBox} className={className} style={style} {...base} {...rest}>
        {paths}
      </svg>
    );
  };
}

export const Search = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const Cart = make(
  <>
    <circle cx="9" cy="21" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="19" cy="21" r="1.5" fill="currentColor" stroke="none" />
    <path d="M1 1h3l2.4 13.2a2 2 0 0 0 2 1.8h9.2a2 2 0 0 0 2-1.6L22 6H6" />
  </>
);

export const Heart = make(
  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
);

export const User = make(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </>
);

export const Star = make(
  <polygon points="12,2 15.1,8.6 22.2,9.6 17.1,14.4 18.4,21.5 12,18.1 5.6,21.5 6.9,14.4 1.8,9.6 8.9,8.6" />
);

export const Menu = make(
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
);

export const Close = make(
  <>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </>
);

export const ChevronDown = make(<polyline points="6,9 12,15 18,9" />);
export const ChevronRight = make(<polyline points="9,6 15,12 9,18" />);
export const ChevronLeft = make(<polyline points="15,6 9,12 15,18" />);

export const Truck = make(
  <>
    <rect x="1" y="6" width="14" height="11" rx="1.5" />
    <path d="M15 10h4l3 3.5V17h-7z" />
    <circle cx="6" cy="19.5" r="1.8" />
    <circle cx="17.5" cy="19.5" r="1.8" />
  </>
);

export const Shield = make(<path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />);

export const Rotate = make(
  <>
    <polyline points="1,4 1,10 7,10" />
    <path d="M3.5 15a9 9 0 1 0 2-13.5L1 10" />
  </>
);

export const Phone = make(
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.2 4.2 2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2Z" />
);

export const WhatsApp = make(
  <path d="M20.5 3.5a10.7 10.7 0 0 0-17.4 12L2 21l5.7-1a10.7 10.7 0 0 0 12.8-16.5ZM12 19.4a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 19.4Z M9 7.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.7.7 1.9.1.1.1.3 0 .4-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.6-.1l1-1.1c.2-.3.4-.2.6-.1l1.7.8c.2.1.3.2.4.3.1.2.1.9-.2 1.7-.3.8-1.7 1.6-2.4 1.6-.6.1-1.4.1-2.3-.1-.5-.1-1.2-.4-2-.8-3.6-1.6-5.9-5.2-6-5.5-.2-.2-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.9Z" />
);

export const Plus = make(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);

export const Minus = make(<line x1="5" y1="12" x2="19" y2="12" />);

export const Trash = make(
  <>
    <polyline points="3,6 5,6 21,6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
);

export const Check = make(<polyline points="20,6 9,17 4,12" />);

export const CheckCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8,12.5 11,15.5 16,9" />
  </>
);

export const MapPin = make(
  <>
    <path d="M20 10.5c0 6-8 12.5-8 12.5S4 16.5 4 10.5a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.5" r="2.7" />
  </>
);

export const Mail = make(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,6 12,13 22,6" />
  </>
);

export const Filter = make(<polygon points="4,4 20,4 14,12.5 14,19 10,21 10,12.5" />);

export const ArrowRight = make(
  <>
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13,5 20,12 13,19" />
  </>
);

export const Instagram = make(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </>
);

export const Youtube = make(
  <>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
  </>
);

export const Facebook = make(
  <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3Z" />
);

export const Twitter = make(
  <path d="M22 5.3a8.2 8.2 0 0 1-2.3.6 4 4 0 0 0 1.8-2.2 8.1 8.1 0 0 1-2.6 1 4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.6 4.1a4 4 0 0 0 1.3 5.4 4 4 0 0 1-1.9-.5v.1a4 4 0 0 0 3.3 4 4 4 0 0 1-1.9.1 4 4 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 17.5a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5A8.3 8.3 0 0 0 22 5.3Z" />
);

export const Package = make(
  <>
    <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
    <polyline points="3,8 12,13 21,8" />
    <line x1="12" y1="13" x2="12" y2="21.5" />
  </>
);

export const Lock = make(
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
);
