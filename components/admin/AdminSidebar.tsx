"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Image as ImageIcon,
  Calendar,
  Users,
  Video,
  Music,
  MapPin,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Printer,
  FileText,
  UserCheck,
  Database,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: "PLATFORM_ADMIN" | "MANDAL_ADMIN";
  mandalName?: string;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  role,
  mandalName = "Mandal Admin",
  onLogout,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, role: "ALL" },
    { id: "submissions", label: "Pending Submissions", icon: FileText, role: "PLATFORM_ADMIN" },
    { id: "mandals", label: "All Mandals", icon: Globe, role: "PLATFORM_ADMIN" },
    { id: "credentials", label: "Admin Credentials", icon: UserCheck, role: "PLATFORM_ADMIN" },
    { id: "donations", label: "Donations & Receipts", icon: Sparkles, role: "ALL" },
    { id: "hero", label: "Hero & Video", icon: Video, role: "MANDAL_ADMIN" },
    { id: "invitation", label: "Invitation Text", icon: FileText, role: "MANDAL_ADMIN" },
    { id: "pdf_card", label: "PDF Card Print", icon: Printer, role: "MANDAL_ADMIN" },
    { id: "gallery", label: "Gallery & Media", icon: ImageIcon, role: "MANDAL_ADMIN" },
    { id: "timeline", label: "Timeline Schedule", icon: Calendar, role: "MANDAL_ADMIN" },
    { id: "committee", label: "Committee & Members", icon: Users, role: "MANDAL_ADMIN" },
    { id: "music", label: "Music & Audio", icon: Music, role: "MANDAL_ADMIN" },
    { id: "map", label: "Map & Contact", icon: MapPin, role: "MANDAL_ADMIN" },
    { id: "theme", label: "Theme Selector", icon: Palette, role: "MANDAL_ADMIN" },
    { id: "analytics", label: "Analytics", icon: BarChart3, role: "ALL" },
    { id: "profile", label: "Profile", icon: UserCheck, role: "ALL" },
    { id: "settings", label: "Settings", icon: Settings, role: "ALL" },
  ];

  const filteredItems = menuItems.filter(
    (item) => item.role === "ALL" || item.role === role
  );

  return (
    <aside className="w-64 shrink-0 border-r border-[#e8a93b]/20 bg-[#170508] p-5 flex flex-col justify-between min-h-screen text-[#fef9eb]">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#e8a93b]/20">
          <Image
            src="/branding/adviks-logo.png"
            alt="Adviks SoftTech"
            width={44}
            height={44}
            priority
            unoptimized
            className="rounded-xl object-contain bg-white/95 p-1 border border-[#e8a93b]/40 shadow-sm"
          />
          <div>
            <h2 className="font-display font-bold text-sm text-[#f3d089] tracking-wide">
              ADVIKS SOFTTECH
            </h2>
            <p className="text-[11px] text-[#fef9eb]/60 font-medium truncate max-w-[120px]">
              {role === "PLATFORM_ADMIN" ? "Platform Super Admin" : mandalName}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                suppressHydrationWarning
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#e8a93b] to-[#d96a2b] text-[#1c0609] font-bold shadow-md shadow-[#e8a93b]/20"
                    : "text-[#fef9eb]/75 hover:bg-[#e8a93b]/10 hover:text-[#f3d089]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {role === "PLATFORM_ADMIN" && (
            <Link
              href="/admin/database"
              suppressHydrationWarning
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#f3d089] hover:bg-[#e8a93b]/10 transition-all"
            >
              <Database className="w-4 h-4 text-[#e8a93b] shrink-0" />
              <span>Database Health</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-6 border-t border-[#e8a93b]/20">
        <div className="mb-3 rounded-xl border border-[#e8a93b]/20 bg-black/40 p-3 text-[11px] text-[#f3d089] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e8a93b] shrink-0" />
          <span>Powered by Adviks SoftTech</span>
        </div>
        <button
          type="button"
          suppressHydrationWarning
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 hover:bg-red-950/60 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
