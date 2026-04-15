export function PillIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="5" fill="currentColor" opacity="0.15" />
      <path d="M2 12C2 7.58 6.48 4 12 4C17.52 4 22 7.58 22 12C22 16.42 17.52 20 12 20C6.48 20 2 16.42 2 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M2 12H22" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function CapsuleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BottleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6H17L19 22H5L7 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 6C7 6 8 8 12 8C16 8 17 6 17 6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function PrescriptionIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SyringeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M19 3L14 8M14 8L9 13M14 8L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="11" width="14" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 11 14)" />
      <path d="M6 20L4 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MicroscopeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M10 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DNAIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M8 3C8 3 8 9 16 9C16 9 16 15 8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 9C16 9 16 15 8 15C8 15 8 21 16 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 6H16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M8 18H16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function HeartPulseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 4 14 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 12H7L9 9L12 15L15 11L17 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StethoscopeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PharmacyCrossIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="4" y="10" width="16" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function TestTubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M10 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3V6L6 14V20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20V14L15 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15C9 17 11 18 12 18C13 18 15 17 16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function QRCodeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17" y="17" width="4" height="4" fill="currentColor" opacity="0.3" />
      <rect x="14" y="14" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

export function ShieldCheckMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WarningMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L22 21H2L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

export function CalendarMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
      <rect x="11" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function MedicineChestIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="8" width="18" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="4" width="2" height="6" rx="1" fill="currentColor" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="15" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="14" y="15" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function ActivityIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TruckMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M1 8H15V17H1V8Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 12H19L22 16V17H15V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function FileCheckMedIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13L11 15L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PHARMA_ICON_MAP = {
  pill: PillIcon,
  capsule: CapsuleIcon,
  bottle: BottleIcon,
  prescription: PrescriptionIcon,
  syringe: SyringeIcon,
  microscope: MicroscopeIcon,
  dna: DNAIcon,
  heart: HeartPulseIcon,
  stethoscope: StethoscopeIcon,
  pharmacy: PharmacyCrossIcon,
  testtube: TestTubeIcon,
  qrcode: QRCodeIcon,
  shield: ShieldCheckMedIcon,
  warning: WarningMedIcon,
  calendar: CalendarMedIcon,
  medicinechest: MedicineChestIcon,
  activity: ActivityIcon,
  lock: LockMedIcon,
  truck: TruckMedIcon,
  filecheck: FileCheckMedIcon,
} as const;

export type PharmaIconName = keyof typeof PHARMA_ICON_MAP;

export function PharmaIcon({ 
  name, 
  className = "w-6 h-6",
}: { 
  name: PharmaIconName;
  className?: string;
}) {
  const IconComponent = PHARMA_ICON_MAP[name];
  return <IconComponent className={className} />;
}

export default PharmaIcon;
