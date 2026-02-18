
import React, { useState, useRef, useMemo } from 'react';
import { Student, TeacherProfile, QuickLink, AppConfig, CustomSection } from '../types.ts';
import StudentMarquee from './StudentMarquee.tsx';
import StudentDetailModal from './StudentDetailModal.tsx';
import AIChatBot from './AIChatBot.tsx';
import { 
  Search, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Youtube, 
  Globe,
  Filter,
  GraduationCap,
  Award,
  ChevronDown,
  LayoutGrid,
  Calendar,
  ChevronLeft,
  Sparkles,
  Bell,
  MonitorPlay,
  Mic2,
  MessagesSquare,
  CheckCircle2,
  X
} from 'lucide-react';

interface PublicViewProps {
  teacher: TeacherProfile;
  students: Student[];
  links: QuickLink[];
  sections: CustomSection[];
  config: AppConfig;
}

const PublicView: React.FC<PublicViewProps> = ({ teacher, students, links, sections, config }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  
  const resultsLibraryRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    resultsLibraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getAutoIcon = (title: string, url: string) => {
    const t = title.toLowerCase();
    const u = url.toLowerCase();
    if (u.includes('wa.me') || u.includes('whatsapp') || t.includes('whatsapp') || t.includes('chat')) return <MessageCircle size={24} />;
    if (u.includes('youtube') || u.includes('youtu.be') || t.includes('video') || t.includes('youtube')) return <Youtube size={24} />;
    if (t.includes('schedule') || t.includes('time') || t.includes('class')) return <Clock size={24} />;
    if (u.includes('drive.google') || u.includes('docs.google') || t.includes('lesson') || t.includes('file')) return <FileText size={24} />;
    return <Globe size={24} />;
  };

  const availableClasses = useMemo(() => 
    ['All Classes', ...Array.from(new Set(students.map(s => s.class)))].sort(), 
  [students]);
  
  const availableYears = useMemo(() => 
    (['All Years', ...Array.from(new Set(students.map(s => s.year)))] as string[]).sort((a, b) => b.localeCompare(a)), 
  [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (!s.isVisible) return false;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'All Classes' || s.class === selectedClass;
      const matchesYear = selectedYear === 'All Years' || s.year === selectedYear;
      return matchesSearch && matchesClass && matchesYear;
    });
  }, [students, searchQuery, selectedClass, selectedYear]);

  if (comingSoonFeature) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-50 to-white -z-10"></div>
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col min-h-screen">
          <nav className="flex justify-between items-center mb-16">
            <button 
              onClick={() => { setComingSoonFeature(null); setIsNotified(false); }}
              className="flex items-center gap-2 text-indigo-950 font-black uppercase tracking-widest text-xs hover:text-amber-600 transition-colors"
            >
              <ChevronLeft size={18} /> Exit Preview
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">∑</div>
               <span className="text-xs font-black text-indigo-950 uppercase tracking-tighter">Math Portal 2.0</span>
            </div>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center flex-grow">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
                 <Sparkles size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Early Access Preview</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-indigo-950 leading-[0.9]">
                {comingSoonFeature} <br/>
                <span className="text-amber-500 font-serif italic text-5xl md:text-6xl tracking-normal">Coming Very Soon</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
                Sir {teacher.name.split(' ').pop()} is currently recording a new series of premium content for <span className="text-indigo-950 font-bold">{comingSoonFeature}</span>.
              </p>
              <div className="pt-8 flex flex-wrap gap-4">
                 <button 
                   onClick={() => setIsNotified(true)}
                   disabled={isNotified}
                   className={`px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center gap-3 ${
                    isNotified 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-indigo-950 text-white hover:bg-amber-500 hover:-translate-y-1 shadow-indigo-900/20'
                   }`}
                 >
                    {isNotified ? (
                      <><CheckCircle2 size={24} /> You're on the list!</>
                    ) : (
                      <><Bell size={24} /> Notify me when live</>
                    )}
                 </button>
                 <button 
                   onClick={() => setComingSoonFeature(null)}
                   className="bg-white border-2 border-indigo-950 text-indigo-950 px-10 py-5 rounded-[2rem] font-black hover:bg-gray-50 transition-all"
                 >
                    Explore Portal
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="px-6 pt-12 md:pt-24 pb-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div>
            <span className="inline-block bg-amber-100 text-amber-600 px-4 py-1 rounded-full text-xs font-black tracking-widest mb-6 uppercase">
              ✨ Celebrating Student Success
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-tight">
              The Results <br/><span className="text-amber-500">Mastery</span> Library
            </h1>
            <p className="text-lg text-gray-600 mt-6 max-w-lg leading-relaxed">
              Sharing stories of math breakthroughs under <span className="font-bold text-indigo-950">{teacher.name}'s</span> mentorship. Explore our directory of achievers.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToResults}
              className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-amber-600 hover:-translate-y-1 transition-all"
            >
              Search Directory <ChevronDown size={20} className="inline ml-2" />
            </button>
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right duration-700">
          <div className="aspect-square bg-amber-400 rounded-[4rem] overflow-hidden rotate-3 shadow-2xl border-8 border-white group">
            <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover -rotate-3 transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-xs font-black opacity-80 uppercase tracking-[0.2em] mb-1">Master Educator</p>
              <p className="text-3xl font-black">{teacher.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Marquee */}
      <section className="mt-12 bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6 mb-8">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-[0.3em]">Featured Achievers</h2>
        </div>
        <StudentMarquee 
          students={students.filter(s => s.isFeatured && s.isVisible)} 
          onSelect={setSelectedStudent} 
        />
      </section>

      {/* Directory Section with Filters */}
      <section ref={resultsLibraryRef} className="px-6 py-24 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-16 space-y-8 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-amber-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-indigo-950">Student Directory</h2>
              <p className="text-gray-400 text-sm mt-1">Search and filter through all our enrolled students</p>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-2xl">
                <span className="text-amber-600 font-black text-lg">{filteredStudents.length}</span>
                <span className="text-indigo-950/50 text-xs font-bold uppercase ml-2 tracking-widest">Profiles Found</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-indigo-950 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Class Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <GraduationCap size={18} />
              </div>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-bold text-indigo-950 text-sm"
              >
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={18} />
              </div>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-bold text-indigo-950 text-sm"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in zoom-in duration-500">
            {filteredStudents.map(student => (
              <div 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className="bg-white p-6 rounded-[2.5rem] border border-amber-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className="relative mb-6">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border-4 border-white shadow-lg">
                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  {student.isFeatured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-lg">STAR</div>
                  )}
                </div>
                <h3 className="font-black text-indigo-950 text-xl group-hover:text-amber-600 transition-colors line-clamp-1">{student.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-lg">{student.class}</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-lg">Batch {student.year}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-amber-100">
            <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-amber-200" />
            </div>
            <h3 className="text-2xl font-black text-indigo-950">No results found</h3>
            <p className="text-gray-400 mt-2 max-w-sm mx-auto">We couldn't find any students matching your current search or filter criteria. Try clearing some filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedClass('All Classes'); setSelectedYear('All Years'); }}
              className="mt-8 bg-indigo-950 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      <AIChatBot />

      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          isOpen={!!selectedStudent} 
          isAdmin={false}
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

export default PublicView;
