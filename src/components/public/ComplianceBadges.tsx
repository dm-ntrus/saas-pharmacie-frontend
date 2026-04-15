"use client";

import { motion } from "framer-motion";
import { Shield, Award, CheckCircle, Lock, FileCheck, Heart, Activity } from "lucide-react";

export type ComplianceBadgeType = 
  | "gdp" 
  | "gsp" 
  | "gmp" 
  | "hipaa" 
  | "iso" 
  | "who" 
  | "fda" 
  | "ema" 
  | "haipharma";

interface ComplianceBadgeProps {
  type: ComplianceBadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const BADGE_CONFIG: Record<ComplianceBadgeType, { label: string; color: string; bgColor: string }> = {
  gdp: {
    label: "GDP",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  gsp: {
    label: "GSP",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-200",
  },
  gmp: {
    label: "GMP",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50 border-cyan-200",
  },
  hipaa: {
    label: "HIPAA",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  iso: {
    label: "ISO 27001",
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200",
  },
  who: {
    label: "WHO",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  fda: {
    label: "FDA",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
  ema: {
    label: "EMA",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
  },
  haipharma: {
    label: "HAI",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
};

const SIZE_CLASSES = {
  sm: { container: "px-2 py-1", text: "text-[9px]" },
  md: { container: "px-3 py-1.5", text: "text-[10px]" },
  lg: { container: "px-4 py-2", text: "text-xs" },
};

const BADGE_ICONS: Record<ComplianceBadgeType, React.ReactNode> = {
  gdp: <Truck className="w-3 h-3" />,
  gsp: <Warehouse className="w-3 h-3" />,
  gmp: <Factory className="w-3 h-3" />,
  hipaa: <Lock className="w-3 h-3" />,
  iso: <Shield className="w-3 h-3" />,
  who: <Globe className="w-3 h-3" />,
  fda: <MedicalCross className="w-3 h-3" />,
  ema: <Award className="w-3 h-3" />,
  haipharma: <Heart className="w-3 h-3" />,
};

export function ComplianceBadge({ type, size = "md", showLabel = true, animated = false }: ComplianceBadgeProps) {
  const config = BADGE_CONFIG[type];
  const sizeClasses = SIZE_CLASSES[size];

  const BadgeContent = () => (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${config.bgColor} ${config.color} ${sizeClasses.container} ${sizeClasses.text}`}
    >
      {BADGE_ICONS[type]}
      {showLabel && <span>{config.label}</span>}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
}

export function ComplianceBadgeGroup({ 
  badges, 
  limit = 4,
  className = "" 
}: { 
  badges: ComplianceBadgeType[]; 
  limit?: number;
  className?: string;
}) {
  const visibleBadges = badges.slice(0, limit);
  const remainingCount = badges.length - limit;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {visibleBadges.map((badge) => (
        <ComplianceBadge key={badge} type={badge} size="sm" animated />
      ))}
      {remainingCount > 0 && (
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

export function MedicalComplianceStrip({ className = "" }: { className?: string }) {
  const complianceItems = [
    { icon: Shield, label: "Data Protection", color: "emerald" },
    { icon: FileCheck, label: "Audit Trail", color: "teal" },
    { icon: Lock, label: "End-to-End Encryption", color: "cyan" },
    { icon: Activity, label: "Real-Time Monitoring", color: "blue" },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 sm:gap-10 ${className}`}>
      {complianceItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
            <item.icon className={`w-4 h-4 text-${item.color}-600`} />
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function Truck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function Warehouse({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V8l9-6 9 6v13H3z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function Factory({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M5 20V8l4 4V8l4 4V4h6v16" />
      <path d="M3 20v-4h4v4" />
    </svg>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function MedicalCross({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="9" y="2" width="6" height="20" rx="1" />
      <rect x="2" y="9" width="20" height="6" rx="1" />
    </svg>
  );
}

export default ComplianceBadge;
