import React, { useState } from 'react';
import {
  Sparkles,
  LogOut,
  User,
  Building2,
  GraduationCap,
  Menu,
  X,
  Compass,
  Shield,
  Layers,
  Award,
  Briefcase,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  currentUserName: string;
  activeView: string;
  onNavigate: (view: string) => void;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUserName,
  activeView,
  onNavigate,
  onRoleSwitch,
  onLogout,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define nav links per role
  const getNavLinks = () => {
    if (currentRole === 'guest') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'system', label: 'How It Works' },
        { id: 'student', label: 'Student' },
        { id: 'industry', label: 'Industry' },
        { id: 'college', label: 'College' },
      ];
    }

    // Authenticated views tailored as requested in Section 21
    return [
      { id: 'student', label: 'Student', icon: User },
      { id: 'industry', label: 'Industry', icon: Building2 },
      { id: 'college', label: 'College', icon: GraduationCap },
      { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
      { id: 'verification', label: 'Verification', icon: Award },
      { id: 'guardian', label: 'Career Path Guardian', icon: Shield },
      { id: 'system', label: 'System', icon: Cpu },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => {
              if (currentRole === 'company') onNavigate('industry');
              else if (currentRole === 'college') onNavigate('college');
              else if (currentRole === 'student') onNavigate('student');
              else onNavigate('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  SKILL-NEXUS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SIH26044
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
                Bridging Skills to Opportunities
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              const Icon = link.icon;

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Persona Badge & Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {currentRole !== 'guest' ? (
              <div className="flex items-center gap-2.5">
                {/* Active Persona Pill with Quick Role Switch Menu */}
                <div className="flex items-center gap-2 pl-3 pr-2 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5">
                    {currentRole === 'student' && <User className="w-3.5 h-3.5 text-blue-600" />}
                    {currentRole === 'company' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                    {currentRole === 'college' && <GraduationCap className="w-3.5 h-3.5 text-teal-600" />}
                    <span className="font-bold text-slate-800 truncate max-w-[130px]">
                      {currentUserName}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold ${
                        currentRole === 'student'
                          ? 'bg-blue-100 text-blue-800'
                          : currentRole === 'company'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {currentRole}
                    </span>
                  </div>

                  {/* Quick Stakeholder Jump Switcher for Jury */}
                  <select
                    value={currentRole}
                    onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
                    title="Switch Stakeholder Persona"
                    aria-label="Switch Stakeholder Persona"
                    className="bg-transparent text-[11px] font-bold text-indigo-700 cursor-pointer focus:outline-hidden hover:underline pl-1"
                  >
                    <option value="student">Student Persona</option>
                    <option value="company">Industry Persona</option>
                    <option value="college">College Persona</option>
                  </select>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Login / Select Role
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden gap-2">
            {currentRole === 'guest' && (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {currentRole !== 'guest' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-2">
              <div className="text-xs">
                <span className="text-slate-500 block">Logged in as:</span>
                <span className="font-bold text-slate-900">{currentUserName}</span>
                <span className="text-indigo-600 uppercase font-bold text-[10px] ml-1.5">
                  ({currentRole})
                </span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </button>
            );
          })}

          {currentRole !== 'guest' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Switch Role:</span>
              <div className="flex items-center gap-1">
                {(['student', 'company', 'college'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleSwitch(r);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-bold capitalize ${
                      currentRole === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
