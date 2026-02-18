
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Student, 
  TeacherProfile, 
  AppConfig, 
  QuickLink,
  CustomSection
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHER, 
  INITIAL_LINKS, 
  APP_CONFIG 
} from './constants';
import PublicView from './components/PublicView';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './services/supabase';
import { 
  Menu, 
  X, 
  Lock, 
  User as UserIcon, 
  LogOut, 
  Heart,
  ChevronRight,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('teacher');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [sections, setSections] = useState<CustomSection[]>(() => {
    const saved = localStorage.getItem('sections');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AppConfig>(APP_CONFIG);

  // Initial Database Fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsSyncing(true);
      try {
        // Fetch Teacher
        const { data: teacherData, error: tErr } = await supabase.from('teacher_profile').select('*').single();
        if (!tErr && teacherData) setTeacher(teacherData);

        // Fetch Students
        const { data: studentData, error: sErr } = await supabase.from('students').select('*');
        if (!sErr && studentData && studentData.length > 0) setStudents(studentData);

        // Fetch Links
        const { data: linkData, error: lErr } = await supabase.from('links').select('*');
        if (!lErr && linkData && linkData.length > 0) setLinks(linkData);

        // Fetch Sections
        const { data: sectionData, error: secErr } = await supabase.from('sections').select('*');
        if (!secErr && sectionData && sectionData.length > 0) setSections(sectionData);

        setIsDbConnected(true);
      } catch (err) {
        console.warn("Supabase connection issues. Using local storage.", err);
        setIsDbConnected(false);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchData();
  }, []);

  // Sync to LocalStorage (Fallback)
  useEffect(() => {
    localStorage.setItem('teacher', JSON.stringify(teacher));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('links', JSON.stringify(links));
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [teacher, students, links, sections]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.adminEmails.includes(adminEmail)) {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      alert("Unauthorized email address.");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-2 rounded-lg">
            <span className="text-white font-bold text-xl">∑</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-950">Math Portal</h1>
            <div className="flex items-center gap-1">
              {isDbConnected ? (
                <span className="text-[8px] font-black text-green-500 flex items-center gap-1 uppercase tracking-widest">
                  <Cloud size={8} /> Cloud Connected
                </span>
              ) : (
                <span className="text-[8px] font-black text-amber-500 flex items-center gap-1 uppercase tracking-widest">
                  <CloudOff size={8} /> Local Storage Only
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-amber-600 transition-colors">Lessons</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Results</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Tutorials</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Guestbook</a>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-indigo-950 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-900 transition-all shadow-md"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-2 border-2 border-indigo-950 text-indigo-950 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-950 hover:text-white transition-all"
            >
              <Lock size={16} /> Admin
            </button>
          )}
          <button className="p-2 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors relative">
             <UserIcon size={20} className="text-amber-700" />
             {isSyncing && (
               <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20 rounded-full animate-spin">
                 <RefreshCw size={12} className="text-amber-700" />
               </div>
             )}
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {isAdmin ? (
          <AdminDashboard 
            teacher={teacher} 
            setTeacher={setTeacher}
            students={students} 
            setStudents={setStudents}
            links={links}
            setLinks={setLinks}
            sections={sections}
            setSections={setSections}
            config={config}
            setConfig={setConfig}
            isDbConnected={isDbConnected}
          />
        ) : (
          <PublicView 
            teacher={teacher} 
            students={students} 
            links={links} 
            sections={sections}
            config={config}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <span className="text-white font-bold text-md">∑</span>
              </div>
              <h1 className="text-lg font-bold text-indigo-950">Math Portal</h1>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">Empowering the next generation of problem solvers through quality mathematical education.</p>
          </div>
          
          <div className="flex gap-12">
            <div>
              <h4 className="font-bold mb-4 text-indigo-950">Platform</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-amber-600">Home</a></li>
                <li><a href="#" className="hover:text-amber-600">Courses</a></li>
                <li><a href="#" className="hover:text-amber-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-indigo-950">Links</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                {links.map(l => (
                  <li key={l.id}><a href={l.url} className="hover:text-amber-600">{l.title}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-400">
          Made with <Heart size={14} className="inline text-amber-500 mx-1 fill-amber-500" /> by the Math Portal Team
        </div>
      </footer>

      {/* Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <button 
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-950"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <div className="inline-block bg-amber-100 p-4 rounded-full mb-4">
                <Lock size={32} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-950">Admin Access</h2>
              <p className="text-gray-500 text-sm mt-2">Please enter your authorized email to manage the portal.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. admin@mathportal.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-950 text-white py-4 rounded-xl font-bold hover:bg-indigo-900 transition-all shadow-lg"
              >
                Sign in as Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
