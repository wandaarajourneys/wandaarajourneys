import { ShieldCheck, Award, Lock, Headset } from "lucide-react";

const badges = [
  { icon: Award, label: "KATO Licensed Operator", sub: "Kenya Association of Tour Operators" },
  { icon: ShieldCheck, label: "15+ Years Experience", sub: "Trusted since 2011" },
  { icon: Lock, label: "Secure Payments", sub: "Encrypted transactions" },
  { icon: Headset, label: "24/7 Support", sub: "On-trip assistance" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {badges.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center text-center gap-2 rounded-xl bg-white p-6 shadow-card">
          <badge.icon className="text-terracotta-500" size={28} aria-hidden="true" />
          <p className="font-semibold text-teal-800 text-sm">{badge.label}</p>
          <p className="text-xs text-teal-700/60">{badge.sub}</p>
        </div>
      ))}
    </div>
  );
}
