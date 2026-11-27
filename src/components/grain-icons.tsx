import type { AromaId } from "@/types";

export type GrainGroupId = "sorghum" | "multi" | "rice" | "botanical";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Custom botanical grain & ingredient emblems for each of the 12 official
 * baijiu aroma styles plus steeped botanicals.
 */
export function AromaGrainIcon({ id, className, size = 28 }: IconProps & { id: AromaId }) {
  switch (id) {
    case "jiang":
      // Red Sorghum (红高粱) — drooping ruby sorghum panicle
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M16 28V12" stroke="#5b3428" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 24C12 23 9.5 20.5 8.5 17.5C11.5 17.5 14.2 19.5 16 22" fill="#d97757" fillOpacity="0.22" stroke="#7d4a38" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 25C19.8 24 22.5 21.8 23.5 19C20.5 19 17.8 20.8 16 23" fill="#d97757" fillOpacity="0.22" stroke="#7d4a38" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="7" r="2.2" fill="#c8372d" />
          <circle cx="12.8" cy="9.5" r="2.1" fill="#d94e3f" />
          <circle cx="19.2" cy="9.5" r="2.1" fill="#b42820" />
          <circle cx="16" cy="11.2" r="2.2" fill="#c8372d" />
          <circle cx="12.2" cy="13.5" r="2" fill="#b42820" />
          <circle cx="19.8" cy="13.5" r="2" fill="#d94e3f" />
          <circle cx="16" cy="15.2" r="2" fill="#a2221a" />
        </svg>
      );

    case "nong":
      // Five Grains (五粮) — golden sheaf + 5 distinct grain kernels
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M16 27V11M16 19L10.5 10.5M16 19L21.5 10.5" stroke="#8a5a18" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12.5 22.5H19.5" stroke="#c8372d" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="16" cy="7.5" rx="2" ry="3.2" fill="#d99626" stroke="#8a5a18" strokeWidth="1.2" />
          <ellipse cx="10.2" cy="9.2" rx="1.9" ry="3" transform="rotate(-24 10.2 9.2)" fill="#c8372d" stroke="#7d201a" strokeWidth="1.1" />
          <ellipse cx="21.8" cy="9.2" rx="1.9" ry="3" transform="rotate(24 21.8 9.2)" fill="#e8b84b" stroke="#8a5a18" strokeWidth="1.1" />
          <ellipse cx="11.5" cy="15" rx="1.7" ry="2.6" transform="rotate(-35 11.5 15)" fill="#f3ebd3" stroke="#8a7448" strokeWidth="1.1" />
          <ellipse cx="20.5" cy="15" rx="1.7" ry="2.6" transform="rotate(35 20.5 15)" fill="#7da158" stroke="#47662d" strokeWidth="1.1" />
        </svg>
      );

    case "qing":
      // Sorghum + Barley & Pea (高粱·大麦豌豆) — crisp golden barley + green pea pod
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M12 27V8" stroke="#7d6428" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 8L10 4.5M12 8L14 4.5" stroke="#b59038" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="9.6" cy="11.5" rx="1.6" ry="2.6" transform="rotate(-28 9.6 11.5)" fill="#e3bc56" stroke="#7d6428" strokeWidth="1.1" />
          <ellipse cx="14.4" cy="11.5" rx="1.6" ry="2.6" transform="rotate(28 14.4 11.5)" fill="#e3bc56" stroke="#7d6428" strokeWidth="1.1" />
          <ellipse cx="9.6" cy="16.5" rx="1.6" ry="2.6" transform="rotate(-28 9.6 16.5)" fill="#d6a73e" stroke="#7d6428" strokeWidth="1.1" />
          <ellipse cx="14.4" cy="16.5" rx="1.6" ry="2.6" transform="rotate(28 14.4 16.5)" fill="#d6a73e" stroke="#7d6428" strokeWidth="1.1" />
          {/* Pea pod */}
          <path d="M19.5 25.5C24.5 23.5 26 17.5 24 12.5C21.2 15.2 19 20.5 19.5 25.5Z" fill="#6ab06e" fillOpacity="0.28" stroke="#2f7037" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="22.8" cy="16.4" r="1.45" fill="#3c8a45" />
          <circle cx="22" cy="19.8" r="1.45" fill="#3c8a45" />
          <circle cx="21" cy="22.9" r="1.35" fill="#3c8a45" />
        </svg>
      );

    case "mi":
      // Paddy Rice (大米) — graceful arching rice panicle
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M10 27C10 19 13 11 22.5 9.5" stroke="#5c7840" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M10.5 24C14.5 23.5 17.5 21.5 19.5 19" stroke="#5c7840" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx="14.8" cy="12" rx="1.5" ry="2.8" transform="rotate(-38 14.8 12)" fill="#f7f1db" stroke="#7d8f4f" strokeWidth="1.2" />
          <ellipse cx="18.6" cy="9.5" rx="1.5" ry="2.8" transform="rotate(-12 18.6 9.5)" fill="#f7f1db" stroke="#7d8f4f" strokeWidth="1.2" />
          <ellipse cx="22.8" cy="10.8" rx="1.5" ry="2.8" transform="rotate(28 22.8 10.8)" fill="#ede0b4" stroke="#7d8f4f" strokeWidth="1.2" />
          <ellipse cx="18.2" cy="14.5" rx="1.5" ry="2.7" transform="rotate(42 18.2 14.5)" fill="#ede0b4" stroke="#7d8f4f" strokeWidth="1.2" />
          <ellipse cx="23.5" cy="15.5" rx="1.45" ry="2.6" transform="rotate(55 23.5 15.5)" fill="#f7f1db" stroke="#7d8f4f" strokeWidth="1.2" />
        </svg>
      );

    case "feng":
      // Feng — Sorghum & Barley (高粱·大麦)
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M11 26.5L19.5 9.5" stroke="#8c5a20" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 26.5L12.5 10.5" stroke="#8a382c" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left sorghum crown */}
          <circle cx="11.5" cy="8.5" r="2" fill="#c84c32" />
          <circle cx="9.2" cy="11.5" r="1.8" fill="#d96747" />
          <circle cx="13.8" cy="11.5" r="1.8" fill="#b33b24" />
          <circle cx="11.8" cy="14" r="1.7" fill="#c84c32" />
          {/* Right golden barley */}
          <ellipse cx="20.6" cy="8.2" rx="1.6" ry="2.7" transform="rotate(24 20.6 8.2)" fill="#e6b647" stroke="#8c5a20" strokeWidth="1.15" />
          <ellipse cx="22.8" cy="12.2" rx="1.6" ry="2.6" transform="rotate(42 22.8 12.2)" fill="#e6b647" stroke="#8c5a20" strokeWidth="1.15" />
          <ellipse cx="18.2" cy="13.2" rx="1.5" ry="2.5" transform="rotate(-12 18.2 13.2)" fill="#d69c2c" stroke="#8c5a20" strokeWidth="1.15" />
        </svg>
      );

    case "jian":
      // Mixed (兼香) — Twin stalks: red sorghum + golden wheat
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M11.5 27V11" stroke="#7d3228" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20.5 27V9" stroke="#8f6318" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="11.5" cy="7.5" r="2" fill="#c8372d" />
          <circle cx="9" cy="10.5" r="1.85" fill="#d95344" />
          <circle cx="14" cy="10.5" r="1.85" fill="#a8261e" />
          <circle cx="11.5" cy="13.2" r="1.85" fill="#c8372d" />
          <ellipse cx="20.5" cy="7.5" rx="1.6" ry="2.7" fill="#e5b342" stroke="#8f6318" strokeWidth="1.15" />
          <ellipse cx="18.2" cy="12" rx="1.5" ry="2.5" transform="rotate(-24 18.2 12)" fill="#e5b342" stroke="#8f6318" strokeWidth="1.15" />
          <ellipse cx="22.8" cy="12" rx="1.5" ry="2.5" transform="rotate(24 22.8 12)" fill="#e5b342" stroke="#8f6318" strokeWidth="1.15" />
          <ellipse cx="18.2" cy="16.5" rx="1.5" ry="2.4" transform="rotate(-24 18.2 16.5)" fill="#d49c24" stroke="#8f6318" strokeWidth="1.15" />
          <ellipse cx="22.8" cy="16.5" rx="1.5" ry="2.4" transform="rotate(24 22.8 16.5)" fill="#d49c24" stroke="#8f6318" strokeWidth="1.15" />
        </svg>
      );

    case "dong":
      // Dong (董香) — Sorghum + Wild Mountain Herbs (百草)
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M16 27V11" stroke="#2c6352" strokeWidth="1.55" strokeLinecap="round" />
          {/* Herbal leaves */}
          <path d="M16 23.5C10.5 23 7.5 19.5 7.5 14.5C11.5 15 14.8 17.8 16 21.5Z" fill="#3a8f74" fillOpacity="0.28" stroke="#246350" strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M16 21.5C21.5 21 24.5 17.5 24.5 12.5C20.5 13 17.2 15.8 16 19.5Z" fill="#3a8f74" fillOpacity="0.28" stroke="#246350" strokeWidth="1.35" strokeLinejoin="round" />
          {/* Sorghum crown */}
          <circle cx="16" cy="7.2" r="2" fill="#b84232" />
          <circle cx="13.2" cy="9.8" r="1.8" fill="#cc5845" />
          <circle cx="18.8" cy="9.8" r="1.8" fill="#9c3224" />
          <circle cx="16" cy="12" r="1.85" fill="#b84232" />
        </svg>
      );

    case "zhima":
      // Sesame (芝麻香) — Roasted sesame seeds + golden grain
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M12.5 27V10" stroke="#7d4f22" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="12.5" cy="7.5" rx="1.6" ry="2.7" fill="#d99a3b" stroke="#7d4f22" strokeWidth="1.15" />
          <ellipse cx="9.8" cy="12.5" rx="1.5" ry="2.5" transform="rotate(-26 9.8 12.5)" fill="#d99a3b" stroke="#7d4f22" strokeWidth="1.15" />
          <ellipse cx="15.2" cy="12.5" rx="1.5" ry="2.5" transform="rotate(26 15.2 12.5)" fill="#c78328" stroke="#7d4f22" strokeWidth="1.15" />
          {/* Roasted sesame teardrops */}
          <path d="M22.2 10.5C22.2 10.5 25 13.8 25 15.6C25 17.1 23.7 18.2 22.2 18.2C20.7 18.2 19.4 17.1 19.4 15.6C19.4 13.8 22.2 10.5 22.2 10.5Z" fill="#9e5a22" stroke="#5e320e" strokeWidth="1.2" />
          <path d="M19.8 19.5C19.8 19.5 21.8 21.8 21.8 23.1C21.8 24.2 20.9 25 19.8 25C18.7 25 17.8 24.2 17.8 23.1C17.8 21.8 19.8 19.5 19.8 19.5Z" fill="#c9893a" stroke="#6e4014" strokeWidth="1.15" />
          <path d="M24.6 19.8C24.6 19.8 26.4 21.9 26.4 23C26.4 24 25.6 24.7 24.6 24.7C23.6 24.7 22.8 24 22.8 23C22.8 21.9 24.6 19.8 24.6 19.8Z" fill="#7a4218" stroke="#4d260a" strokeWidth="1.15" />
        </svg>
      );

    case "chi":
      // Chi (豉香) — Rice stalk + glistening "jade ice" pearl drop
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M11 26.5C11 19.5 12.5 13 16.5 8.5" stroke="#6d7850" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="10.2" cy="14" rx="1.5" ry="2.7" transform="rotate(-22 10.2 14)" fill="#f4ecd2" stroke="#7d875c" strokeWidth="1.15" />
          <ellipse cx="14.5" cy="11.5" rx="1.5" ry="2.7" transform="rotate(18 14.5 11.5)" fill="#f4ecd2" stroke="#7d875c" strokeWidth="1.15" />
          <ellipse cx="11.8" cy="19" rx="1.5" ry="2.6" transform="rotate(-16 11.8 19)" fill="#e8dcb4" stroke="#7d875c" strokeWidth="1.15" />
          {/* Glistening jade-ice droplet (玉冰) */}
          <path d="M22.2 13C22.2 13 26.2 17.8 26.2 20.6C26.2 22.8 24.4 24.6 22.2 24.6C20 24.6 18.2 22.8 18.2 20.6C18.2 17.8 22.2 13 22.2 13Z" fill="#f6d8c4" stroke="#b86b42" strokeWidth="1.35" />
          <path d="M20.6 20.6C20.6 21.6 21.3 22.4 22.3 22.4" stroke="#ffffff" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );

    case "te":
      // Te (特香) — Plump whole-grain rice kernels nestled in husk leaves
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M8.5 22C11.5 25.5 20.5 25.5 23.5 22" stroke="#8a7438" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 24.5V27.5" stroke="#8a7438" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="16" cy="13.5" rx="2.7" ry="5.4" fill="#fbf6e4" stroke="#8c7532" strokeWidth="1.4" />
          <ellipse cx="10.8" cy="16.5" rx="2.3" ry="4.5" transform="rotate(-26 10.8 16.5)" fill="#f4e8c4" stroke="#8c7532" strokeWidth="1.35" />
          <ellipse cx="21.2" cy="16.5" rx="2.3" ry="4.5" transform="rotate(26 21.2 16.5)" fill="#f4e8c4" stroke="#8c7532" strokeWidth="1.35" />
          <path d="M16 10.2V16.8" stroke="#c9b47a" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );

    case "laobaigan":
      // Laobaigan (老白干香) — Sharp, tall upright wheat & sorghum spike (67% fire!)
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M16 28V7.5" stroke="#6e3f19" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 7.5L13.5 3.8M16 7.5L18.5 3.8M16 7.5V3.5" stroke="#c8372d" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx="13.2" cy="11.2" rx="1.65" ry="2.9" transform="rotate(-28 13.2 11.2)" fill="#e3a036" stroke="#7d4a16" strokeWidth="1.2" />
          <ellipse cx="18.8" cy="11.2" rx="1.65" ry="2.9" transform="rotate(28 18.8 11.2)" fill="#e3a036" stroke="#7d4a16" strokeWidth="1.2" />
          <ellipse cx="13.2" cy="16.2" rx="1.65" ry="2.9" transform="rotate(-28 13.2 16.2)" fill="#d6782a" stroke="#7d4a16" strokeWidth="1.2" />
          <ellipse cx="18.8" cy="16.2" rx="1.65" ry="2.9" transform="rotate(28 18.8 16.2)" fill="#d6782a" stroke="#7d4a16" strokeWidth="1.2" />
          <ellipse cx="13.4" cy="21" rx="1.55" ry="2.6" transform="rotate(-28 13.4 21)" fill="#c8432d" stroke="#782418" strokeWidth="1.15" />
          <ellipse cx="18.6" cy="21" rx="1.55" ry="2.6" transform="rotate(28 18.6 21)" fill="#c8432d" stroke="#782418" strokeWidth="1.15" />
        </svg>
      );

    case "fuyu":
      // Layered (馥郁香) — Three-layer grain bundle (5 grains, 3 aromas in 1)
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M16 27V12M16 21L9.5 13M16 21L22.5 13" stroke="#6b4b32" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tie */}
          <path d="M12.5 23.5C14.2 22.5 17.8 22.5 19.5 23.5" stroke="#c8372d" strokeWidth="1.8" strokeLinecap="round" />
          {/* Left: Sorghum */}
          <circle cx="9.2" cy="11.2" r="2.1" fill="#c8372d" />
          <circle cx="7.4" cy="14" r="1.6" fill="#d95848" />
          {/* Center: Golden Wheat */}
          <ellipse cx="16" cy="8.5" rx="2.1" ry="3.6" fill="#e5b03e" stroke="#855b14" strokeWidth="1.2" />
          {/* Right: Rice */}
          <ellipse cx="22.8" cy="11.8" rx="1.9" ry="3.2" transform="rotate(25 22.8 11.8)" fill="#f3ebd2" stroke="#6c8044" strokeWidth="1.2" />
        </svg>
      );

    case "prepared":
      // Steeped (配制 · Zhuyeqing) — Emerald bamboo leaf + grain sprig
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" className={className} aria-hidden="true">
          <path d="M13 27V8" stroke="#2c7344" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M11.3 15.5H14.7M11.3 21.5H14.7" stroke="#2c7344" strokeWidth="1.4" strokeLinecap="round" />
          {/* Bamboo leaves */}
          <path d="M13.5 14C17 10 21.8 8 25.5 8.5C23.5 12.2 19.5 15 13.5 14Z" fill="#4aa366" fillOpacity="0.35" stroke="#24663a" strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M13.5 18.5C17.5 16.5 21.8 16.2 25 18C22 20.5 17.5 21 13.5 18.5Z" fill="#4aa366" fillOpacity="0.35" stroke="#24663a" strokeWidth="1.35" strokeLinejoin="round" />
          {/* Small grain seed */}
          <ellipse cx="9.2" cy="11.5" rx="1.6" ry="2.8" transform="rotate(-24 9.2 11.5)" fill="#e3b84f" stroke="#7d5c1a" strokeWidth="1.15" />
        </svg>
      );
  }
}

/** Mini grain group icon for filter pills */
export function GrainGroupIcon({ group, size = 15 }: { group: GrainGroupId; size?: number }) {
  switch (group) {
    case "sorghum":
      return <AromaGrainIcon id="jiang" size={size} />;
    case "multi":
      return <AromaGrainIcon id="nong" size={size} />;
    case "rice":
      return <AromaGrainIcon id="mi" size={size} />;
    case "botanical":
      return <AromaGrainIcon id="prepared" size={size} />;
  }
}
