import React, { useState } from 'react';
import {
  User,
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { UserRole } from '../types';
import { TELANGANA_LOCATIONS } from '../data/mockData';

interface LoginPageProps {
  initialRole?: UserRole;
  onLoginSuccess: (
    role: UserRole,
    userData: {
      name: string;
      email: string;
      secondary?: string; // department / industry / location
      tertiary?: string; // education
    }
  ) => void;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'student',
  onLoginSuccess,
  onCancel,
}) => {
  const [activeRole, setActiveRole] = useState<'student' | 'company' | 'college'>(
    initialRole === 'company' ? 'company' : initialRole === 'college' ? 'college' : 'student'
  );

  // Student Form Fields
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [studentEmail, setStudentEmail] = useState('alex.rivera@sphoorthy.ac.in');
  const [studentPassword, setStudentPassword] = useState('••••••••');
  const [studentEducation, setStudentEducation] = useState('B.Tech in Computer Science & Engineering');
  const [studentDepartment, setStudentDepartment] = useState('Department of CSE');

  // Company Form Fields
  const [companyName, setCompanyName] = useState('CloudForge Technologies');
  const [companyEmail, setCompanyEmail] = useState('recruiting@cloudforge.io');
  const [companyPassword, setCompanyPassword] = useState('••••••••');
  const [companyIndustry, setCompanyIndustry] = useState('Enterprise Cloud & SaaS');

  // College Form Fields
  const [collegeName, setCollegeName] = useState('Sphoorthy Engineering College');
  const [collegeEmail, setCollegeEmail] = useState('dean.academics@sphoorthy.ac.in');
  const [collegePassword, setCollegePassword] = useState('••••••••');
  const [collegeLocation, setCollegeLocation] = useState('Hyderabad (Sagar Road)');

  // Quick Demo Presets for SIH Jury Fast Testing
  const handleQuickDemo = (role: 'student' | 'company' | 'college') => {
    setActiveRole(role);
    if (role === 'student') {
      setStudentName('Alex Rivera');
      setStudentEmail('alex.rivera@sphoorthy.ac.in');
      setStudentEducation('B.Tech in Computer Science & Engineering');
      setStudentDepartment('Department of CSE');
    } else if (role === 'company') {
      setCompanyName('CloudForge');
      setCompanyEmail('recruiter@cloudforge.io');
      setCompanyIndustry('Cloud & Web Platforms');
    } else if (role === 'college') {
      setCollegeName('Sphoorthy Engineering College');
      setCollegeEmail('admin@sphoorthy.ac.in');
      setCollegeLocation('Hyderabad');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeRole === 'student') {
      onLoginSuccess('student', {
        name: studentName,
        email: studentEmail,
        secondary: studentDepartment,
        tertiary: studentEducation,
      });
    } else if (activeRole === 'company') {
      onLoginSuccess('company', {
        name: companyName,
        email: companyEmail,
        secondary: companyIndustry,
      });
    } else if (activeRole === 'college') {
      onLoginSuccess('college', {
        name: collegeName,
        email: collegeEmail,
        secondary: collegeLocation,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Secure Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Select Your Ecosystem Role
          </h2>
          <p className="text-xs text-slate-300">
            Strict routing preserves access permissions and stakeholder context
          </p>
        </div>

        {/* 3-Role Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveRole('student')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeRole === 'student'
                ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('company')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeRole === 'company'
                ? 'bg-white text-purple-700 shadow-xs border border-purple-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Company</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('college')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeRole === 'college'
                ? 'bg-white text-teal-700 shadow-xs border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span>College</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {/* A. STUDENT LOGIN FORM */}
          {activeRole === 'student' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
                <strong>Student Access:</strong> Discovers skill gaps, computes weighted employer matches, and recommends guided learning roadmaps.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Education Program
                </label>
                <input
                  type="text"
                  required
                  value={studentEducation}
                  onChange={(e) => setStudentEducation(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={studentDepartment}
                  onChange={(e) => setStudentDepartment(e.target.value)}
                  placeholder="e.g. Department of CSE"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* B. COMPANY / INDUSTRY LOGIN FORM */}
          {activeRole === 'company' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900">
                <strong>Industry Access:</strong> Publishes opportunities with 100% skill weight distributions and accesses candidate discovery.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={companyPassword}
                  onChange={(e) => setCompanyPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Industry Vertical
                </label>
                <input
                  type="text"
                  required
                  value={companyIndustry}
                  onChange={(e) => setCompanyIndustry(e.target.value)}
                  placeholder="e.g. Cloud Computing, FinTech, HealthTech"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Industry Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* C. COLLEGE LOGIN FORM */}
          {activeRole === 'college' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-900">
                <strong>College Access:</strong> Institutional intelligence benchmarking student coverage against industry demand signals.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official College Email
                </label>
                <input
                  type="email"
                  required
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={collegePassword}
                  onChange={(e) => setCollegePassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  College Location
                </label>
                <input
                  type="text"
                  required
                  value={collegeLocation}
                  onChange={(e) => setCollegeLocation(e.target.value)}
                  placeholder="e.g. Hyderabad / Rangareddy / Warangal"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to College Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* Quick Demo Credentials Bar for SIH Jury */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              SIH Jury 1-Click Fast Presets:
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Back to Home
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-blue-700 font-semibold border border-blue-200 rounded-lg transition-colors"
            >
              Demo: Alex (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('company')}
              className="px-2.5 py-1 text-xs bg-white hover:bg-purple-50 text-purple-700 font-semibold border border-purple-200 rounded-lg transition-colors"
            >
              Demo: CloudForge (Recruiter)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('college')}
              className="px-2.5 py-1 text-xs bg-white hover:bg-teal-50 text-teal-700 font-semibold border border-teal-200 rounded-lg transition-colors"
            >
              Demo: Sphoorthy Engg (College)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
