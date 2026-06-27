/**
 * Custom nav icons — gaya "doodle playful" yang menyatu dengan desain
 * Animalpedia Kids: outline tebal, fill warna solid dari palet sistem kita,
 * bentuk membulat. Sengaja TANPA wajah/mata/mulut (faceless) sesuai keputusan
 * desain — kesan "hidup"-nya datang dari warna + outline tebal + bentuk
 * organik, bukan dari ekspresi wajah.
 *
 * Warna:
 * - inactive: outline coklat tua (--ink, #5B3E2B), fill warna sistem yang sama di semua state
 * - active:   outline hijau tua (--green-deep, #2C7A4F)
 */

interface IconProps {
  active?: boolean;
  size?: number;
}

const INACTIVE_STROKE = "#5B3E2B"; // var(--ink)
const ACTIVE_STROKE = "#2C7A4F"; // var(--green-deep)

export function HomeIcon({ active, size = 22 }: IconProps) {
  const stroke = active ? ACTIVE_STROKE : INACTIVE_STROKE;
  const roofFill = active ? "#3FA66C" : "#F2994A"; // var(--green) saat active, var(--orange) saat inactive
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size}>
      <path
        d="M4.5 16L16 5.5L27.5 16"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 14V24.5C7.5 25.3 8.2 26 9 26H23C23.8 26 24.5 25.3 24.5 24.5V14L16 7L7.5 14Z"
        stroke={stroke}
        strokeWidth={3}
        strokeLinejoin="round"
        fill={roofFill}
      />
      <rect
        x="13.3"
        y="18"
        width="5.4"
        height="8"
        rx="1.5"
        stroke={stroke}
        strokeWidth={2.6}
        strokeLinejoin="round"
        fill="#FBF3E7"
      />
    </svg>
  );
}

/** Kompas — jarum panjang dua warna + penanda arah di lingkaran luar, faceless */
export function ExploreIcon({ active, size = 22 }: IconProps) {
  const stroke = active ? ACTIVE_STROKE : INACTIVE_STROKE;
  const fill = active ? "#3FA66C" : "#4FA8D8"; // var(--green) saat active, var(--blue) saat inactive
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size}>
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke={stroke}
        strokeWidth={3}
        fill={fill}
      />
      {/* Penanda arah N/E/S/W */}
      <circle cx="16" cy="6.8" r="1" fill={stroke} />
      <circle cx="25.2" cy="16" r="1" fill={stroke} />
      <circle cx="16" cy="25.2" r="1" fill={stroke} />
      <circle cx="6.8" cy="16" r="1" fill={stroke} />
      {/* Jarum kompas: ujung merah (utara) + ujung krem (selatan) */}
      <path
        d="M16 8L19 16L16 16Z"
        fill="#E8604C"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <path
        d="M16 24L13 16L16 16Z"
        fill="#FBF3E7"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.1" fill={stroke} />
    </svg>
  );
}

/** Joystick — base + batang + bola stick besar, lebih jelas terbaca sebagai kontroler */
export function GamesIcon({ active, size = 22 }: IconProps) {
  const stroke = active ? ACTIVE_STROKE : INACTIVE_STROKE;
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size}>
      {/* base joystick */}
      <rect
        x="9"
        y="19"
        width="14"
        height="7"
        rx="3.5"
        stroke={stroke}
        strokeWidth={3}
        fill="#FFC857"
      />
      {/* batang stick */}
      <rect
        x="14.3"
        y="8"
        width="3.4"
        height="13"
        rx="1.7"
        stroke={stroke}
        strokeWidth={2.8}
        fill="#FFC857"
      />
      {/* kepala stick (bola besar) */}
      <circle
        cx="16"
        cy="8.5"
        r="5"
        stroke={stroke}
        strokeWidth={3}
        fill="#E8604C"
      />
    </svg>
  );
}

/** Siluet user generik (kepala + bahu) — sengaja TANPA mata/mulut (faceless) */
export function ProfileIcon({ active, size = 22 }: IconProps) {
  const stroke = active ? ACTIVE_STROKE : INACTIVE_STROKE;
  const fill = active ? "#3FA66C" : "#F2994A"; // var(--green) saat active, var(--orange) saat inactive
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size}>
      <circle
        cx="16"
        cy="11"
        r="5.5"
        stroke={stroke}
        strokeWidth={3}
        fill={fill}
      />
      <path
        d="M6 25.5C6 20.8 10.5 17.5 16 17.5C21.5 17.5 26 20.8 26 25.5"
        stroke={stroke}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
    </svg>
  );
}
