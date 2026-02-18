
import { Student, TeacherProfile, AppConfig, QuickLink } from './types';

export const ADMIN_EMAILS = ['admin@mathportal.com', 'sandeep.baghel@edu.com', 'rajputayush0109@gmail.com'];

export const INITIAL_TEACHER: TeacherProfile = {
  name: "Sir Sandeep Baghel",
  photo: "https://picsum.photos/400/400?random=1",
  bio: "Passionate mathematics educator with 7 years of experience in mentoring students for competitive exams and boards. Believes in conceptual clarity and analytical thinking.",
  tagline: "Simplifying Math, One Concept at a Time.",
  yearsExp: "7+",
  studentsCount: "5k+",
  successRate: "98%"
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Aryan Sharma',
    rollNo: 'MS1001',
    class: 'Class 12',
    year: '2023',
    photo: 'https://picsum.photos/150/150?random=10',
    bio: 'Secured 95% in Mathematics. Grateful for Sir\'s mentorship!',
    marks: { 'Mathematics': 95, 'Physics': 92, 'Chemistry': 88 },
    totalMarks: 450,
    isFeatured: true,
    isVisible: true,
  },
  {
    id: '2',
    name: 'Priya Verma',
    rollNo: 'MS1002',
    class: 'Class 12',
    year: '2023',
    photo: 'https://picsum.photos/150/150?random=11',
    bio: 'Sir made Calculus feel like a breeze. Top scorer in the district.',
    marks: { 'Mathematics': 98, 'Physics': 90, 'Chemistry': 91 },
    totalMarks: 465,
    isFeatured: true,
    isVisible: true,
  },
  {
    id: '3',
    name: 'Rahul Mehta',
    rollNo: 'MS1003',
    class: 'Standard 10',
    year: '2021',
    photo: 'https://picsum.photos/150/150?random=12',
    bio: 'Best foundation builder. Highly recommended!',
    marks: { 'Mathematics': 100, 'Science': 95 },
    totalMarks: 480,
    isFeatured: true,
    isVisible: true,
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNo: 'MS1004',
    class: 'JEE Batch',
    year: '2022',
    photo: 'https://picsum.photos/150/150?random=13',
    bio: 'Cleared JEE Mains with a 99.5 percentile in Math.',
    marks: { 'Math Percentile': 99.5 },
    totalMarks: 300,
    isFeatured: false,
    isVisible: true,
  }
];

export const INITIAL_LINKS: QuickLink[] = [
  { id: '1', title: 'Class Schedule', url: '#' },
  { id: '2', title: 'WhatsApp Group', url: '#' },
  { id: '3', title: 'Latest Lessons', url: '#' }
];

export const APP_CONFIG: AppConfig = {
  theme: 'warm',
  adminEmails: ADMIN_EMAILS,
  aiEnabled: true,
};
