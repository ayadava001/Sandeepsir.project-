
import React from 'react';
import { Student } from '../types';

interface StudentMarqueeProps {
  students: Student[];
  onSelect: (student: Student) => void;
}

const StudentMarquee: React.FC<StudentMarqueeProps> = ({ students, onSelect }) => {
  const visibleStudents = students.filter(s => s.isVisible);
  // Duplicate for seamless scroll
  const displayList = [...visibleStudents, ...visibleStudents, ...visibleStudents];

  return (
    <div className="relative overflow-hidden w-full bg-white/30 py-8 border-y border-amber-100 mb-16">
      <div className="animate-scroll whitespace-nowrap">
        {displayList.map((student, idx) => (
          <div 
            key={`${student.id}-${idx}`}
            onClick={() => onSelect(student)}
            className="inline-block group cursor-pointer px-4"
          >
            <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300">
                <img 
                  src={student.photo} 
                  alt={student.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {student.isFeatured && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                  STAR
                </div>
              )}
            </div>
            <p className="text-center mt-3 text-sm font-bold text-indigo-950 opacity-0 group-hover:opacity-100 transition-opacity">
              {student.name}
            </p>
          </div>
        ))}
      </div>
      
      {/* Decorative overlays for fade effect */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-amber-50/100 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-amber-50/100 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default StudentMarquee;
