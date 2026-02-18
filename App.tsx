
import React, { useState, useEffect } from 'react';
import { 
  Student, 
  TeacherProfile, 
  AppConfig, 
  QuickLink,
  CustomSection
} from './types.ts';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHER, 
  INITIAL_LINKS, 
  APP_CONFIG 
} from './constants.ts';
import PublicView from './components/PublicView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { supabase } from './services/supabase.ts';
import { 
  Lock, 
  User as UserIcon, 
  LogOut, 
  Heart,
  Cloud,
  CloudOff,
  RefreshCw,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
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

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsSyncing(true);
      try {
        const { data: teacherData, error: tErr } = await supabase.from('teacher_profile').select('*').single();
        if (!tErr && teacherData) setTeacher(teacherData);

        const { data: studentData, error: sErr } = await supabase.from('students').select('*').order('created_at', { ascending: false });
        if (!sErr && studentData && studentData.length > 0) setStudents(studentData);

        const { data: linkData, error: lErr } = await supabase.from('links').select('*');
        if (!lErr && linkData && linkData.length > 0) setLinks(linkData);

        const { data: sectionData, error: secErr } = await supabase.from('sections').select('*');
        if (!secErr && sectionData && sectionData.length > 0) setSections(sectionData);

        setIsDbConnected(true);
      } catch (err) {
        console.warn("Supabase connection issues. Using local storage.", err);
        setIsDbConnected(false);
      } finally {
        setIsSyncing(false);
        setIsInitializing(false);
      }
    };

    fetchData();

    // Realtime Subscriptions
    const studentChannel = supabase
      .channel('realtime-students')
      .on('postgres_changes', { event: '*', table: 'students', schema: 'public' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setStudents(prev => [payload.new as Student, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setStudents(prev => prev.map(s => s.id === payload.new.id ? payload.new as Student : s));
        } else if (payload.eventType === 'DELETE') {
          setStudents(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .subscribe();

    const teacherChannel = supabase
      .channel('realtime-teacher')
      .on('postgres_changes', { event: 'UPDATE', table: 'teacher_profile', schema: 'public' }, (payload) => {
        setTeacher(payload.new as TeacherProfile);
      })
      .subscribe();

    const linksChannel = supabase
      .channel('realtime-links')
      .on('postgres_changes', { event: '*', table: 'links', schema: 'public' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLinks(prev => [...prev, payload.new as QuickLink]);
        } else if (payload.eventType === 'UPDATE') {
          setLinks(prev => prev.map(l => l.id === payload.new.id ? payload.new as QuickLink : l));
        } else if (payload.eventType === 'DELETE') {
          setLinks(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(studentChannel);
      supabase.removeChannel(teacherChannel);
      supabase.removeChannel(linksChannel);
    };
  }, []);

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

  if (isInitializing && !isDbConnected) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4">
          <RefreshCw size={48} className="text-amber-500 animate-spin" />
          <p className="font-bold text-indigo-950 uppercase tracking-widest text-xs">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
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
                  <Cloud size={8} /> Cloud Connected (Realtime)
                </span>
              ) : (
                <span className="text-[8px] font-black text-amber-500 flex items-center gap-1 uppercase tracking-widest">
                  <CloudOff size={8} /> Local Storage Only
                </span>
              )}
            </div>
          </div>
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
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                required
              />
              <button 
                type="submit"
                className="w-full bg-indigo-950 text-white py-4 rounded-xl font-bold"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
