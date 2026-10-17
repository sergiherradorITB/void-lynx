import React from "react";

export type RoleType = "TOP" | "JGL" | "MID" | "ADC" | "SUPP";

interface RoleBadgeProps {
  role: RoleType;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ROLE_CONFIG: Record<
  RoleType,
  {
    name: string;
    lane: string;
    color: string;
    bgColor: string;
    borderColor: string;
    svg: React.ReactNode;
  }
> = {
  TOP: {
    name: "TOP",
    lane: "Top Lane",
    color: "text-amber-400",
    bgColor: "bg-amber-950/70",
    borderColor: "border-amber-600/40",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Shield with upper-left point */}
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 7v7" />
        <path d="M8.5 10.5l3.5-3.5 3.5 3.5" />
      </svg>
    ),
  },
  JGL: {
    name: "JGL",
    lane: "Jungle",
    color: "text-emerald-400",
    bgColor: "bg-emerald-950/70",
    borderColor: "border-emerald-600/40",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Monster claw / Tree beast mark */}
        <path d="M4 14l3-6 5 4 4-8 4 6" />
        <path d="M5 19h14" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  MID: {
    name: "MID",
    lane: "Mid Lane",
    color: "text-cyan-400",
    bgColor: "bg-cyan-950/70",
    borderColor: "border-cyan-600/40",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Diamond / Central cross */}
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
      </svg>
    ),
  },
  ADC: {
    name: "ADC",
    lane: "Bot / Marksman",
    color: "text-purple-400",
    bgColor: "bg-purple-950/70",
    borderColor: "border-purple-600/40",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Crosshair / Precision bow */}
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  SUPP: {
    name: "SUPP",
    lane: "Support",
    color: "text-rose-400",
    bgColor: "bg-rose-950/70",
    borderColor: "border-rose-600/40",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Heart / Guardian Wings / Ward */}
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
};

export function RoleBadge({
  role,
  showLabel = true,
  size = "md",
  className = "",
}: RoleBadgeProps) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.MID;
  const sizeClasses = {
    sm: "h-5 text-[10px] gap-1 px-1.5",
    md: "h-6 text-xs gap-1.5 px-2",
    lg: "h-8 text-sm gap-2 px-3 font-bold",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-bold border ${cfg.bgColor} ${cfg.borderColor} ${cfg.color} ${sizeClasses} ${className}`}
      title={cfg.lane}
    >
      <span className={`${iconSizes} shrink-0`}>{cfg.svg}</span>
      {showLabel && <span>{cfg.name}</span>}
    </span>
  );
}

export function RoleIconOnly({
  role,
  size = "md",
  className = "",
}: {
  role: RoleType;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.MID;
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <span className={`inline-flex shrink-0 ${cfg.color} ${iconSizes} ${className}`} title={cfg.lane}>
      {cfg.svg}
    </span>
  );
}
