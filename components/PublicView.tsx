
import React, { useState, useRef, useMemo } from 'react';
import { Student, TeacherProfile, QuickLink, AppConfig, CustomSection } from '../types';
import StudentMarquee from './StudentMarquee';
import StudentDetailModal from './StudentDetailModal';
import AIChatBot from './AIChatBot';
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
  CheckCircle2
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

  // Dynamic filter lists
  const availableClasses = useMemo(() => 
    ['All Classes', ...Array.from(new Set(students.map(s => s.class)))].sort(), 
  [students]);
  
  // Fix: Explicitly cast to string[] to resolve unknown type error on localeCompare
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

  // Handle "Coming Soon" immersive page
  if (comingSoonFeature) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Background Accents */}
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

              <div className="space-y-4">
                <p className="text-xs font-black text-indigo-950 uppercase tracking-[0.2em]">What to expect:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="bg-white p-2 rounded-xl text-amber-500 shadow-sm"><MonitorPlay size={20} /></div>
                      <div><p className="text-sm font-bold text-indigo-950">4K Quality</p><p className="text-[10px] text-gray-400">Crystal clear visual explanation</p></div>
                   </div>
                   <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="bg-white p-2 rounded-xl text-amber-500 shadow-sm"><Mic2 size={20} /></div>
                      <div><p className="text-sm font-bold text-indigo-950">Interactive</p><p className="text-[10px] text-gray-400">Real-time engagement tools</p></div>
                   </div>
                </div>
              </div>

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

            {/* Feature Mockup Preview */}
            <div className="relative group">
               <div className="absolute inset-0 bg-amber-400 rounded-[3rem] rotate-3 -z-10 opacity-20 scale-105 group-hover:rotate-6 transition-transform duration-700"></div>
               <div className="bg-white border-8 border-white rounded-[3rem] shadow-2xl overflow-hidden aspect-[4/5] md:aspect-square relative">
                  {/* Mock Interface Header */}
                  <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/20 to-transparent flex justify-between items-center z-10">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><LayoutGrid size={24}/></div>
                     <div className="flex gap-2">
                        <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg animate-pulse">LIVE SOON</div>
                     </div>
                  </div>

                  {/* Feature Content Mockup */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950 text-white p-12 text-center relative">
                     <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="grid grid-cols-10 gap-2 rotate-12 scale-150">
                           {Array.from({length: 100}).map((_, i) => (
                              <div key={i} className="text-xl font-serif">∑</div>
                           ))}
                        </div>
                     </div>

                     {comingSoonFeature === 'Video Lessons' && (
                        <>
                           <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-2xl mb-8 animate-bounce">
                              <Play size={40} fill="white" />
                           </div>
                           <h4 className="text-3xl font-black mb-2">Linear Equations</h4>
                           <p className="text-gray-400 text-sm">Chapter 04 • Masterclass • 45m</p>
                           <div className="mt-12 w-full space-y-3 px-12">
                              <div className="h-1 bg-white/20 rounded-full w-full"><div className="h-full bg-amber-500 w-1/3 rounded-full"></div></div>
                              <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>12:45</span><span>45:00</span></div>
                           </div>
                        </>
                     )}

                     {comingSoonFeature === 'Doubt Clearing' && (
                        <>
                           <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center shadow-2xl mb-8">
                              <MessagesSquare size={40} />
                           </div>
                           <h4 className="text-3xl font-black mb-2">Live Q&A Queue</h4>
                           <p className="text-gray-400 text-sm">Sir {teacher.name.split(' ').pop()} will be live in 12h</p>
                           <div className="mt-12 space-y-2 w-full">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                   <div className="flex-grow h-2 bg-white/10 rounded-full"></div>
                                </div>
                              ))}
                           </div>
                        </>
                     )}

                     {comingSoonFeature === 'Study Groups' && (
                        <>
                           <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl mb-8">
                              <Users size={40} />
                           </div>
                           <h4 className="text-3xl font-black mb-2">Batch 2024-25</h4>
                           <p className="text-gray-400 text-sm">48 Active Students in your region</p>
                           <div className="flex -space-x-4 mt-12 scale-150">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-950 bg-gray-500 overflow-hidden shadow-xl">
                                  <img src={`https://picsum.photos/50/50?random=${i+20}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                           </div>
                        </>
                     )}
                  </div>
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
              Sharing stories of math breakthroughs, competitive scores, and personal growth under <span className="font-bold text-indigo-950">{teacher.name}'s</span> mentorship.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToResults}
              className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-amber-500/30 hover:bg-amber-600 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              View All Results <ChevronDown size={20} />
            </button>
            <button className="bg-white border-2 border-indigo-950 text-indigo-950 px-10 py-4 rounded-2xl font-black hover:bg-indigo-950 hover:text-white transition-all shadow-lg shadow-indigo-950/5">
              Leave Thanks
            </button>
          </div>

          <div className="flex gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-950">{teacher.yearsExp || '7+'}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Experience</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-950">{teacher.studentsCount || '5k+'}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Alumni</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-950">{teacher.successRate || '98%'}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Success</div>
            </div>
          </div>
        </div>

        <div className="relative animate-in fade-in slide-in-from-right duration-700">
          <div className="aspect-square bg-amber-400 rounded-[4rem] overflow-hidden rotate-3 shadow-2xl relative border-8 border-white group">
            <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover -rotate-3 scale-110 group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-xs font-black opacity-80 uppercase tracking-[0.2em] mb-1">Master Educator</p>
              <p className="text-3xl font-black">{teacher.name}</p>
            </div>
          </div>
          {/* Floating Desktop Quick Links */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3">
             {links.map(l => (
               <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl shadow-2xl hover:scale-110 hover:-translate-x-2 transition-all text-indigo-950 border border-amber-100 flex items-center justify-center group" title={l.title}>
                 <div className="group-hover:text-amber-500 transition-colors">{getAutoIcon(l.title, l.url)}</div>
               </a>
             ))}
          </div>
        </div>
      </section>

      {/* Featured Marquee */}
      <section className="mt-12 bg-white/50 backdrop-blur-sm py-16">
        <div className="px-6 mb-10 max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-indigo-950">Hall of Fame</h2>
            <p className="text-gray-500 font-medium">Click on a star to see their full profile</p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Award size={14} /> Featured Achievers
            </span>
          </div>
        </div>
        <StudentMarquee 
          students={students.filter(s => s.isFeatured && s.isVisible)} 
          onSelect={setSelectedStudent} 
        />
      </section>

      {/* Main Results Library & Filters */}
      <section ref={resultsLibraryRef} className="px-6 py-24 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-16 text-center space-y-4">
           <div className="inline-flex items-center gap-3 bg-indigo-950 text-white px-6 py-2 rounded-2xl shadow-xl shadow-indigo-950/20 mb-4">
              <GraduationCap size={24} className="text-amber-400" />
              <h2 className="text-xl font-black uppercase tracking-widest">Student Results Directory</h2>
           </div>
           <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore our database of academic records and milestones achieved by our dedicated students.</p>
        </div>

        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-amber-100 shadow-xl mb-12 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative w-full lg:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by student name or roll number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-indigo-950 font-bold border border-gray-100 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-grow lg:flex-grow-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-black text-indigo-950 focus:ring-2 focus:ring-amber-500 outline-none appearance-none cursor-pointer"
              >
                {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="relative flex-grow lg:flex-grow-0">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-black text-indigo-950 focus:ring-2 focus:ring-amber-500 outline-none appearance-none cursor-pointer"
              >
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 px-2">
           <h3 className="text-sm font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={16} className="text-amber-500" /> Catalog
           </h3>
           <p className="text-xs font-bold text-gray-400">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} identified
           </p>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredStudents.map(student => (
              <div 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className="bg-white p-6 rounded-[2.5rem] border border-amber-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:bg-amber-100 transition-colors"></div>
                
                <div className="relative mb-6">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border-4 border-white shadow-lg">
                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  {student.isFeatured && (
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-white">
                      <Award size={18} fill="white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow space-y-2 relative">
                  <h3 className="font-black text-indigo-950 text-xl group-hover:text-amber-600 transition-colors line-clamp-1">{student.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{student.class}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-indigo-400">Batch {student.year}</span>
                  </div>
                  
                  <div className="pt-6 flex items-center justify-between border-t border-gray-50 mt-6">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastery</span>
                       <div className="text-3xl font-black text-indigo-950">
                         {((student.totalMarks / 500) * 100).toFixed(0)}%
                       </div>
                    </div>
                    <button className="p-3 bg-amber-100 text-amber-600 rounded-2xl group-hover:bg-indigo-950 group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 bg-white/50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <Search size={40} className="opacity-10" />
            </div>
            <p className="text-xl font-black text-gray-300">No students matched your criteria</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedClass('All Classes'); setSelectedYear('All Years'); }}
              className="mt-6 bg-indigo-950 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Dynamic Custom Sections */}
      {sections.filter(s => s.isVisible).length > 0 && (
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.filter(s => s.isVisible).map(sec => (
              <div key={sec.id} className={`p-12 rounded-[3rem] shadow-sm flex flex-col justify-between transition-all hover:shadow-2xl hover:scale-[1.01] ${
                sec.theme === 'dark' ? 'bg-indigo-950 text-white shadow-indigo-950/30' : 
                sec.theme === 'amber' ? 'bg-amber-100 text-indigo-950 border border-amber-200' : 
                'bg-white text-indigo-950 border border-amber-100'
              }`}>
                <div>
                  <h3 className="text-4xl font-black mb-6">{sec.title}</h3>
                  <p className={`text-lg leading-relaxed ${sec.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{sec.content}</p>
                </div>
                <button className={`mt-10 flex items-center gap-3 font-black text-sm uppercase tracking-widest group ${sec.theme === 'dark' ? 'text-amber-400' : 'text-indigo-950'}`}>
                  Dive Deeper <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services/Core Features Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-12 rounded-[3rem] border border-amber-50 shadow-sm hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-10 group-hover:bg-amber-500 group-hover:text-white transition-all group-hover:rotate-6">
              <Play size={32} />
            </div>
            <h3 className="text-2xl font-black text-indigo-950 mb-4">Video Lessons</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Access high-quality recorded sessions covering everything from algebra to advanced calculus.</p>
            <button 
              onClick={() => setComingSoonFeature('Video Lessons')}
              className="mt-8 flex items-center gap-2 text-indigo-950 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
            >
              Watch Now <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-indigo-950 p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-950/30 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 mb-10 group-hover:bg-amber-400 group-hover:text-indigo-950 transition-all group-hover:-rotate-6">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4">Doubt Clearing</h3>
            <p className="text-gray-300 leading-relaxed font-medium">Join live interactive sessions where we break down complex problems until you master them.</p>
            <button 
              onClick={() => setComingSoonFeature('Doubt Clearing')}
              className="mt-8 flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
            >
              Schedule Now <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-amber-50 shadow-sm hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-10 group-hover:bg-amber-500 group-hover:text-white transition-all group-hover:rotate-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-black text-indigo-950 mb-4">Study Groups</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Connect with peers in organized batches to collaborate and solve mathematical challenges together.</p>
            <button 
              onClick={() => setComingSoonFeature('Study Groups')}
              className="mt-8 flex items-center gap-2 text-indigo-950 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
            >
              Join Batch <ChevronRight size={18} />
            </button>
          </div>
        </div>
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
