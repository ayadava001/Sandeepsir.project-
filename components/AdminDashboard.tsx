
import React, { useState, useRef } from 'react';
import { 
  Student, 
  TeacherProfile, 
  QuickLink, 
  AppConfig,
  CustomSection
} from '../types';
import { supabase, cloudSync } from '../services/supabase';
import { 
  UserPlus, 
  Upload, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Save, 
  Settings,
  Plus,
  Image as ImageIcon,
  ChevronLeft,
  X,
  Layers,
  Camera,
  AlertTriangle,
  Link as LinkIcon,
  Globe,
  MessageCircle,
  Clock as ClockIcon,
  Youtube,
  CloudUpload,
  Database,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  teacher: TeacherProfile;
  setTeacher: (t: TeacherProfile) => void;
  students: Student[];
  setStudents: (s: Student[]) => void;
  links: QuickLink[];
  setLinks: (l: QuickLink[]) => void;
  sections: CustomSection[];
  setSections: (s: CustomSection[]) => void;
  config: AppConfig;
  setConfig: (c: AppConfig) => void;
  isDbConnected: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  teacher, setTeacher, students, setStudents, links, setLinks, sections, setSections, config, setConfig, isDbConnected 
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'profile' | 'links' | 'sections'>('students');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete_student' | 'delete_link' | 'delete_section' | 'discard_student_edit';
    payload: any;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning';
  } | null>(null);

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', class: '', year: '2024', photo: '', isVisible: true, isFeatured: false, marks: { 'Mathematics': 0 }, links: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const editStudentFileInputRef = useRef<HTMLInputElement>(null);

  const getAutoIcon = (title: string, url: string) => {
    const t = title.toLowerCase();
    const u = url.toLowerCase();
    if (u.includes('wa.me') || u.includes('whatsapp') || t.includes('whatsapp') || t.includes('chat')) return <MessageCircle size={20} />;
    if (u.includes('youtube') || u.includes('youtu.be') || t.includes('video') || t.includes('youtube')) return <Youtube size={20} />;
    if (t.includes('schedule') || t.includes('time') || t.includes('class')) return <ClockIcon size={20} />;
    if (u.includes('drive.google') || u.includes('docs.google') || t.includes('lesson') || t.includes('file')) return <FileText size={20} />;
    return <Globe size={20} />;
  };

  const handlePushToCloud = async () => {
    setIsPushing(true);
    try {
      await cloudSync.saveTeacher(teacher);
      await cloudSync.saveStudents(students);
      await cloudSync.saveLinks(links);
      await cloudSync.saveSections(sections);
      alert("Successfully pushed all local data to Supabase!");
    } catch (err) {
      alert("Push failed. Ensure tables are created in Supabase dashboard.");
    } finally {
      setIsPushing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.class) return;
    
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name!,
      rollNo: `ROLL-${Math.floor(Math.random() * 9000 + 1000)}`,
      class: newStudent.class!,
      year: newStudent.year!,
      photo: newStudent.photo || 'https://picsum.photos/150/150',
      bio: newStudent.bio || '',
      marks: newStudent.marks || { 'Mathematics': 0 },
      totalMarks: (Object.values(newStudent.marks || {}) as number[]).reduce((a, b) => a + (b || 0), 0),
      isFeatured: newStudent.isFeatured || false,
      isVisible: true,
      links: newStudent.links || []
    };

    const updated = [student, ...students];
    setStudents(updated);
    cloudSync.saveStudents(updated);
    setNewStudent({ name: '', class: '', year: '2024', photo: '', marks: { 'Mathematics': 0 }, links: [] });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const updatedTotal = (Object.values(editingStudent.marks) as number[]).reduce((a, b) => a + (b || 0), 0);
    const updatedStudent = { ...editingStudent, totalMarks: updatedTotal };
    const updatedList = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updatedList);
    cloudSync.saveStudents(updatedList);
    setEditingStudent(null);
  };

  const handleExecutePending = () => {
    if (!pendingAction) return;

    let updated;
    switch (pendingAction.type) {
      case 'delete_student':
        updated = students.filter(s => s.id !== pendingAction.payload);
        setStudents(updated);
        cloudSync.saveStudents(updated);
        break;
      case 'delete_link':
        updated = links.filter(l => l.id !== pendingAction.payload);
        setLinks(updated);
        cloudSync.saveLinks(updated);
        break;
      case 'delete_section':
        updated = sections.filter(s => s.id !== pendingAction.payload);
        setSections(updated);
        cloudSync.saveSections(updated);
        break;
      case 'discard_student_edit':
        setEditingStudent(null);
        break;
    }
    setPendingAction(null);
  };

  const toggleVisibility = (id: string) => {
    const updated = students.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
    setStudents(updated);
    cloudSync.saveStudents(updated);
  };

  const toggleFeatured = (id: string) => {
    const updated = students.map(s => s.id === id ? { ...s, isFeatured: !s.isFeatured } : s);
    setStudents(updated);
    cloudSync.saveStudents(updated);
  };

  const updateStudentMark = (subject: string, value: number) => {
    if (!editingStudent) return;
    setEditingStudent({
      ...editingStudent,
      marks: { ...editingStudent.marks, [subject]: value }
    });
  };

  const addSubject = () => {
    if (!editingStudent) return;
    const subject = prompt('Enter subject name:');
    if (subject) {
      setEditingStudent({
        ...editingStudent,
        marks: { ...editingStudent.marks, [subject]: 0 }
      });
    }
  };

  const removeSubject = (subject: string) => {
    if (!editingStudent) return;
    const newMarks = { ...editingStudent.marks };
    delete newMarks[subject];
    setEditingStudent({ ...editingStudent, marks: newMarks });
  };

  const addStudentLink = () => {
    if (!editingStudent) return;
    const currentLinks = editingStudent.links || [];
    setEditingStudent({
      ...editingStudent,
      links: [...currentLinks, { title: 'Social Page', url: 'https://instagram.com/' }]
    });
  };

  const updateStudentLink = (index: number, field: 'title' | 'url', value: string) => {
    if (!editingStudent || !editingStudent.links) return;
    const newLinks = [...editingStudent.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditingStudent({ ...editingStudent, links: newLinks });
  };

  const removeStudentLink = (index: number) => {
    if (!editingStudent || !editingStudent.links) return;
    setEditingStudent({
      ...editingStudent,
      links: editingStudent.links.filter((_, i) => i !== index)
    });
  };

  const handleAddSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Portal Highlight',
      content: 'Click edit to change this content...',
      theme: 'light',
      isVisible: true
    };
    const updated = [...sections, newSection];
    setSections(updated);
    cloudSync.saveSections(updated);
  };

  const updateSection = (id: string, updates: Partial<CustomSection>) => {
    const updated = sections.map(s => s.id === id ? { ...s, ...updates } : s);
    setSections(updated);
    cloudSync.saveSections(updated);
  };

  const openLinkModal = (link: QuickLink | null = null) => {
    setEditingLink(link || { id: '', title: '', url: '' });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    let updated;
    if (editingLink.id) {
      updated = links.map(l => l.id === editingLink.id ? editingLink : l);
    } else {
      updated = [...links, { ...editingLink, id: Date.now().toString() }];
    }
    setLinks(updated);
    cloudSync.saveLinks(updated);
    setIsLinkModalOpen(false);
    setEditingLink(null);
  };

  const handleSaveTeacher = async () => {
    setTeacher(teacher);
    await cloudSync.saveTeacher(teacher);
    alert('Profile saved to cloud!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-indigo-950">Teacher Dashboard</h2>
          <p className="text-gray-500">Welcome back, Sir. Manage your portal and students below.</p>
        </div>
        {!editingStudent && (
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handlePushToCloud}
              disabled={isPushing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg ${
                isDbConnected 
                ? 'bg-amber-500 text-white hover:bg-amber-600' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPushing ? <RefreshCw size={18} className="animate-spin" /> : <CloudUpload size={18} />}
              Push to Cloud
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
              <FileText size={18} /> Export CSV
            </button>
            <label className="flex items-center gap-2 bg-indigo-950 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-900 transition-all shadow-lg">
              <Upload size={18} /> Bulk Upload
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </div>
        )}
      </div>

      {!editingStudent && (
        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('students')} className={`pb-4 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'students' ? 'border-b-2 border-amber-500 text-indigo-950' : 'text-gray-400 hover:text-indigo-950'}`}>Directory</button>
          <button onClick={() => setActiveTab('profile')} className={`pb-4 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'profile' ? 'border-b-2 border-amber-500 text-indigo-950' : 'text-gray-400 hover:text-indigo-950'}`}>Profile</button>
          <button onClick={() => setActiveTab('sections')} className={`pb-4 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'sections' ? 'border-b-2 border-amber-500 text-indigo-950' : 'text-gray-400 hover:text-indigo-950'}`}>Components</button>
          <button onClick={() => setActiveTab('links')} className={`pb-4 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'links' ? 'border-b-2 border-amber-500 text-indigo-950' : 'text-gray-400 hover:text-indigo-950'}`}>Links</button>
        </div>
      )}

      {editingStudent ? (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-amber-100 shadow-xl max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => setPendingAction({ type: 'discard_student_edit', payload: null, title: 'Discard Edits?', message: 'All unsaved changes will be lost.', confirmText: 'Discard Changes', variant: 'warning' })} className="flex items-center gap-2 text-indigo-950 font-bold mb-8 hover:text-amber-600 transition-colors"><ChevronLeft size={20} /> Back to List</button>
          <h3 className="text-3xl font-black text-indigo-950 mb-8">Editing Profile: {editingStudent.name}</h3>
          <form onSubmit={handleUpdateStudent} className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex flex-col items-center p-6 bg-amber-50 rounded-3xl border border-amber-100 relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg mb-4 border-4 border-white bg-white">
                  {editingStudent.photo ? <img src={editingStudent.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>}
                </div>
                <button type="button" onClick={() => editStudentFileInputRef.current?.click()} className="bg-indigo-950 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-900 shadow-md flex items-center gap-2"><Camera size={14} /> Change Photo</button>
                <input type="file" ref={editStudentFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => setEditingStudent({...editingStudent, photo: base64}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Name</label><input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} required /></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Roll No</label><input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={editingStudent.rollNo} onChange={e => setEditingStudent({...editingStudent, rollNo: e.target.value})} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Class</label><input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={editingStudent.class} onChange={e => setEditingStudent({...editingStudent, class: e.target.value})} required /></div>
                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Year</label><input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={editingStudent.year} onChange={e => setEditingStudent({...editingStudent, year: e.target.value})} required /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Bio</label><textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm h-32" value={editingStudent.bio} onChange={e => setEditingStudent({...editingStudent, bio: e.target.value})} /></div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-6">
                <div className="flex justify-between items-center mb-6"><h4 className="font-black text-indigo-950 flex items-center gap-2"><LinkIcon size={18} className="text-amber-500" /> Student Links</h4><button type="button" onClick={addStudentLink} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"><Plus size={18} /></button></div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {editingStudent.links?.map((link, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-2xl space-y-3 relative group">
                      <button type="button" onClick={() => removeStudentLink(index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                      <input className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500" value={link.title} onChange={e => updateStudentLink(index, 'title', e.target.value)} placeholder="Title (e.g. IG)" />
                      <input className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500" value={link.url} onChange={e => updateStudentLink(index, 'url', e.target.value)} placeholder="https://..." />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6"><h4 className="font-black text-indigo-950">Academic Scores</h4><button type="button" onClick={addSubject} className="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"><Plus size={18} /></button></div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {Object.entries(editingStudent.marks).map(([subject, mark]) => (
                    <div key={subject} className="flex items-center gap-4 group">
                      <div className="flex-grow"><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{subject}</label><div className="flex items-center gap-2"><input type="number" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500" value={mark} onChange={e => updateStudentMark(subject, parseInt(e.target.value) || 0)} /><button type="button" onClick={() => removeSubject(subject)} className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><X size={16} /></button></div></div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Aggregate Score</span><span className="text-2xl font-black text-indigo-950">{(Object.values(editingStudent.marks) as number[]).reduce((a, b) => a + (b || 0), 0)}</span></div>
              </div>
              <div className="flex gap-4"><button type="submit" className="flex-grow bg-amber-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all hover:-translate-y-1">Apply Changes</button><button type="button" onClick={() => setPendingAction({ type: 'discard_student_edit', payload: null, title: 'Discard Changes?', message: 'Are you sure you want to stop editing? Unsaved data will be lost.', confirmText: 'Yes, Discard', variant: 'warning' })} className="flex-grow bg-indigo-950 text-white py-4 rounded-2xl font-black hover:bg-indigo-900 transition-all">Discard</button></div>
            </div>
          </form>
        </div>
      ) : activeTab === 'students' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 sticky top-24">
              <h3 className="text-xl font-bold text-indigo-950 mb-6 flex items-center gap-2"><UserPlus size={20} className="text-amber-500" /> New Entry</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 group cursor-pointer hover:bg-amber-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm mb-2">{newStudent.photo ? <img src={newStudent.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>}</div>
                  <span className="text-[10px] font-bold text-indigo-950 uppercase tracking-widest">Upload Photo</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => setNewStudent({...newStudent, photo: base64}))} />
                </div>
                <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Name..." value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required />
                <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Class..." value={newStudent.class} onChange={e => setNewStudent({...newStudent, class: e.target.value})} required />
                <div className="flex gap-4">
                  <input className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={newStudent.year} onChange={e => setNewStudent({...newStudent, year: e.target.value})} placeholder="Year" />
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newStudent.isFeatured} onChange={e => setNewStudent({...newStudent, isFeatured: e.target.checked})} className="w-4 h-4 rounded text-amber-500" /><span className="text-xs font-bold text-indigo-950">Star?</span></label>
                </div>
                <button type="submit" className="w-full bg-indigo-950 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-900 transition-all mt-4">Create Record</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {students.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-amber-200 transition-all group">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-50 bg-gray-50 shadow-inner"><img src={s.photo} alt={s.name} className="w-full h-full object-cover" /></div><div><h4 className="font-bold text-indigo-950">{s.name}</h4><p className="text-xs text-gray-400 font-medium">{s.class} • Batch {s.year}</p></div></div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => toggleFeatured(s.id)} className={`p-2 rounded-lg ${s.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400'}`}><Star size={18} fill={s.isFeatured ? 'currentColor' : 'none'} /></button><button onClick={() => toggleVisibility(s.id)} className={`p-2 rounded-lg ${s.isVisible ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-400'}`}>{s.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}</button><button onClick={() => setEditingStudent(s)} className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Edit3 size={18} /></button><button onClick={() => setPendingAction({ type: 'delete_student', payload: s.id, title: 'Delete Student?', message: `Are you sure you want to remove ${s.name}? This cannot be undone.`, confirmText: 'Confirm Delete', variant: 'danger' })} className="p-2 bg-gray-50 text-gray-400 rounded-lg"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'profile' ? (
        <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-amber-100">
          <h3 className="text-xl font-bold text-indigo-950 mb-8">Portal Profile</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-3xl"><div className="w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-xl relative group border-4 border-white"><img src={teacher.photo} className="w-full h-full object-cover" /><button onClick={() => profileFileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></button><input type="file" ref={profileFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => setTeacher({...teacher, photo: base64}))} /></div></div>
            <input className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold" value={teacher.name} onChange={e => setTeacher({...teacher, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4"><input className="px-4 py-2 border border-gray-200 rounded-xl text-sm" value={teacher.tagline} onChange={e => setTeacher({...teacher, tagline: e.target.value})} placeholder="Tagline" /><input className="px-4 py-2 border border-gray-200 rounded-xl text-sm" value={teacher.yearsExp} onChange={e => setTeacher({...teacher, yearsExp: e.target.value})} placeholder="Experience" /></div>
            <div className="grid grid-cols-2 gap-4"><input className="px-4 py-2 border border-gray-200 rounded-xl text-sm" value={teacher.studentsCount} onChange={e => setTeacher({...teacher, studentsCount: e.target.value})} placeholder="Students count" /><input className="px-4 py-2 border border-gray-200 rounded-xl text-sm" value={teacher.successRate} onChange={e => setTeacher({...teacher, successRate: e.target.value})} placeholder="Success rate" /></div>
            <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" value={teacher.bio} onChange={e => setTeacher({...teacher, bio: e.target.value})} />
            <button onClick={handleSaveTeacher} className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20"><Save size={18} className="inline mr-2" /> Update Profile</button>
          </div>
        </div>
      ) : activeTab === 'sections' ? (
        <div className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-indigo-950">Content Blocks</h3><button onClick={handleAddSection} className="bg-indigo-950 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={18} /> Add Component</button></div>
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map(sec => (
              <div key={sec.id} className="bg-white p-8 rounded-[2rem] border border-amber-100 shadow-sm space-y-4 group">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateSection(sec.id, { theme: 'light' })} 
                      className={`w-5 h-5 rounded-full border border-gray-200 ${sec.theme === 'light' ? 'ring-2 ring-indigo-950 ring-offset-2' : ''} bg-white transition-all`}
                    ></button>
                    <button 
                      onClick={() => updateSection(sec.id, { theme: 'amber' })} 
                      className={`w-5 h-5 rounded-full border border-gray-200 ${sec.theme === 'amber' ? 'ring-2 ring-indigo-950 ring-offset-2' : ''} bg-amber-100 transition-all`}
                    ></button>
                    <button 
                      onClick={() => updateSection(sec.id, { theme: 'dark' })} 
                      className={`w-5 h-5 rounded-full border border-gray-200 ${sec.theme === 'dark' ? 'ring-2 ring-indigo-950 ring-offset-2' : ''} bg-indigo-950 transition-all`}
                    ></button>
                  </div>
                  <button onClick={() => setPendingAction({ type: 'delete_section', payload: sec.id, title: 'Delete Component?', message: `Delete the component "${sec.title}"?`, confirmText: 'Delete', variant: 'danger' })} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={sec.title} onChange={e => updateSection(sec.id, { title: e.target.value })} />
                <textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm h-24" value={sec.content} onChange={e => updateSection(sec.id, { content: e.target.value })} />
                <button onClick={() => updateSection(sec.id, { isVisible: !sec.isVisible })} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${sec.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {sec.isVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="flex justify-between items-center mb-6"><div><h3 className="text-xl font-bold text-indigo-950">Quick Navigation Links</h3><p className="text-xs text-gray-400">Manage touchable public shortcuts</p></div><button onClick={() => openLinkModal()} className="flex items-center gap-2 bg-indigo-950 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-950/20"><Plus size={18} /> New Link</button></div>
          <div className="space-y-3">
            {links.map(link => (
              <div key={link.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:border-amber-200 transition-all group">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-grow cursor-pointer">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600 transition-transform group-hover:scale-110">{getAutoIcon(link.title, link.url)}</div>
                    <div><h4 className="font-bold text-indigo-950 text-sm group-hover:text-amber-600 transition-colors">{link.title}</h4><p className="text-[10px] text-indigo-400 font-mono truncate max-w-[200px] md:max-w-xs">{link.url}</p></div>
                </a>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.preventDefault(); openLinkModal(link); }} className="p-2 text-gray-400 hover:text-indigo-950 hover:bg-indigo-50 rounded-lg"><Edit3 size={18} /></button><button onClick={(e) => { e.preventDefault(); setPendingAction({ type: 'delete_link', payload: link.id, title: 'Delete Link?', message: `Remove the link "${link.title}"?`, confirmText: 'Remove', variant: 'danger' }); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {pendingAction && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-indigo-950/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${pendingAction.variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mb-4`}>
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-indigo-950 mb-2">{pendingAction.title}</h3>
              <p className="text-sm text-gray-500 mb-8">{pendingAction.message}</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setPendingAction(null)} className="flex-grow py-3 bg-gray-100 rounded-xl font-bold text-indigo-950 hover:bg-gray-200 transition-all">Cancel</button>
                <button 
                  onClick={handleExecutePending} 
                  className={`flex-grow py-3 ${pendingAction.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'} rounded-xl font-bold text-white shadow-lg transition-all`}
                >
                  {pendingAction.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINK MODAL */}
      {isLinkModalOpen && editingLink && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-indigo-950/60 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setIsLinkModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-indigo-950"><X size={24} /></button>
            <h3 className="text-2xl font-black text-indigo-950 mb-6">{editingLink.id ? 'Edit Link' : 'Add New Link'}</h3>
            <form onSubmit={handleSaveLink} className="space-y-6">
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Link Title</label><input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500" value={editingLink.title} onChange={e => setEditingLink({...editingLink, title: e.target.value})} placeholder="e.g. Schedule, Batch Link, etc." required /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">URL / Address</label><input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500" value={editingLink.url} onChange={e => setEditingLink({...editingLink, url: e.target.value})} placeholder="https://..." required /></div>
              <button type="submit" className="w-full bg-amber-500 text-white py-4 rounded-xl font-black text-sm hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all">{editingLink.id ? 'Save Changes' : 'Add Link'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
