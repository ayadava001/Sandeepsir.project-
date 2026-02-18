
import React from 'react';
import { Student } from '../types';
import { X, Award, ExternalLink, Calendar, Hash, Instagram, Youtube, Globe } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, isAdmin, onClose }) => {
  if (!isOpen) return null;

  const getLinkIcon = (title: string, url: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerUrl = url.toLowerCase();
    if (lowerTitle.includes('instagram') || lowerUrl.includes('instagram.com')) return <Instagram size={18} />;
    if (lowerTitle.includes('youtube') || lowerUrl.includes('youtube.com')) return <Youtube size={18} />;
    return <Globe size={18} />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end md:p-6 p-0 bg-black/20 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto md:rounded-3xl shadow-2xl relative animate-in slide-in-from-right duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-indigo-950 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="h-48 md:h-64 bg-gradient-to-br from-indigo-950 to-indigo-800 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-8 border-white overflow-hidden shadow-xl bg-amber-50">
              <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black text-indigo-950">{student.name}</h2>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <Award size={14} /> {student.class}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-400">
                  <Calendar size={14} /> Batch {student.year}
                </span>
              </div>
            </div>
            {!isAdmin && (
              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">Score</div>
                <div className="text-4xl font-black text-amber-500">
                  {((student.totalMarks / 500) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Achievements & Bio</h3>
              <p className="text-gray-600 leading-relaxed italic">
                "{student.bio || 'A dedicated student journey under Sir Sandeep Baghel.'}"
              </p>
              
              <div className="mt-8 space-y-4">
                 <div className="flex items-center gap-3 text-gray-600">
                    <Hash size={18} className="text-amber-500" />
                    <span className="text-sm">Roll No: <span className="font-mono bg-gray-100 px-2 rounded">{isAdmin ? student.rollNo : '••••••'}</span></span>
                 </div>
                 
                 {/* Render Student's External Links */}
                 {student.links && student.links.length > 0 && (
                   <div className="space-y-3 pt-2">
                     <p className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Connect / View Portfolio</p>
                     {student.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-indigo-600 hover:text-amber-600 font-bold transition-colors bg-indigo-50/50 p-3 rounded-xl"
                        >
                          {getLinkIcon(link.title, link.url)}
                          <span className="text-sm">{link.title}</span>
                          <ExternalLink size={14} className="ml-auto opacity-30" />
                        </a>
                     ))}
                   </div>
                 )}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-4">Academic Record</h3>
              <div className="space-y-4">
                {Object.entries(student.marks).map(([subject, mark]) => (
                  <div key={subject}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>{subject}</span>
                      <span>{mark}</span>
                    </div>
                    <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${mark}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-950">Grand Total</span>
                  <span className="text-2xl font-black text-indigo-950">{student.totalMarks} <span className="text-xs font-normal text-gray-400">/ 500</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
