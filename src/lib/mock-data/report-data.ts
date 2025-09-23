

import { subDays, format, eachDayOfInterval } from 'date-fns';

export type SubjectPerformance = {
    name: string;
    marks: number;
    grade: string;
    remarks: string;
};

export type Homework = {
    subject: string;
    task: string;
    dueDate: string;
    status: 'Submitted' | 'Pending' | 'Overdue' | 'Graded';
};

export type AttendanceRecord = {
    date: string;
    status: 'Present' | 'Absent' | 'Holiday';
    reason?: string;
};

export type StudentReport = {
    id: string;
    name:string;
    rollNumber: number;
    class: string;
    overallGrade: string;
    overallScore: number;
    rank: string;
    attendance: number;
    subjects: SubjectPerformance[];
    homework: Homework[];
    attendanceDetails: AttendanceRecord[];
};

export type StudentFee = {
  studentId: string;
  studentName: string;
  className: string;
  invoices: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: "Paid" | "Pending" | "Overdue";
    paidOn?: string;
  }[];
};

export type ClassData = {
    id: string;
    name: string;
    students: StudentReport[];
}

const generateFullYearAttendance = (): AttendanceRecord[] => {
    const today = new Date();
    const oneYearAgo = subDays(today, 365);
    const dateInterval = eachDayOfInterval({ start: oneYearAgo, end: today });
    
    return dateInterval.map(date => {
        const day = date.getDay();
        const record: AttendanceRecord = {
            date: format(date, 'yyyy-MM-dd'),
            status: 'Present',
        };

        // Sunday is holiday
        if (day === 0) {
            record.status = 'Holiday';
            record.reason = 'Sunday';
            return record;
        }
        
        // Randomly make some days absent
        const random = Math.random();
        if (random < 0.05) { // 5% chance of being absent
            record.status = 'Absent';
            record.reason = 'Sick leave';
        }

        return record;
    }).reverse(); // Show most recent first
};


const generateStudent = (id: string, name: string, roll: number, className: string): StudentReport => {
    const subjects: SubjectPerformance[] = [
        { name: "Mathematics", marks: Math.floor(Math.random() * 40) + 60, grade: "A", remarks: "Excellent performance." },
        { name: "Science", marks: Math.floor(Math.random() * 40) + 55, grade: "B", remarks: "Good, but can improve." },
        { name: "English", marks: Math.floor(Math.random() * 40) + 60, grade: "A", remarks: "Very creative." },
        { name: "History", marks: Math.floor(Math.random() * 40) + 50, grade: "B+", remarks: "Needs more attention to dates." },
        { name: "Geography", marks: Math.floor(Math.random() * 40) + 58, grade: "A-", remarks: "Good map work." },
    ];
    const totalMarks = subjects.reduce((acc, s) => acc + s.marks, 0);
    const overallScore = Math.round((totalMarks / (subjects.length * 100)) * 100);

    const homework: Homework[] = [
        { subject: 'Mathematics', task: 'Complete exercise 5.2 on Algebra', dueDate: '2024-08-10', status: 'Pending' },
        { subject: 'English', task: 'Essay on "My Summer Vacation"', dueDate: '2024-08-05', status: 'Submitted' },
        { subject: 'Science', task: 'Lab report for photosynthesis experiment', dueDate: '2024-08-02', status: 'Graded' },
    ];
    
    const attendanceDetails = generateFullYearAttendance();
    const presentDays = attendanceDetails.filter(r => r.status === 'Present').length;
    const workingDays = attendanceDetails.filter(r => r.status !== 'Holiday').length;
    const attendancePercentage = Math.round((presentDays / workingDays) * 100);

    return {
        id,
        name,
        rollNumber: roll,
        class: className,
        overallGrade: overallScore > 90 ? "A+" : overallScore > 80 ? "A" : "B+",
        overallScore,
        rank: `${roll}/${Math.floor(Math.random()*5) + 25}`,
        attendance: attendancePercentage,
        subjects,
        homework,
        attendanceDetails
    };
};

export const classes: ClassData[] = [
    {
        id: '10-a',
        name: 'Class 10 A',
        students: [
            generateStudent('stu-10a-1', 'Anjali Sharma', 1, 'Class 10 A'),
            generateStudent('stu-10a-2', 'Ravi Kumar', 2, 'Class 10 A'),
            generateStudent('stu-10a-3', 'Priya Patel', 3, 'Class 10 A'),
            generateStudent('stu-10a-4', 'Amit Singh', 4, 'Class 10 A'),
            generateStudent('stu-10a-5', 'Sunita Rao', 5, 'Class 10 A'),
        ]
    },
    {
        id: '9-b',
        name: 'Class 9 B',
        students: [
            generateStudent('stu-9b-1', 'Rohan Verma', 1, 'Class 9 B'),
            generateStudent('stu-9b-2', 'Meena Kumari', 2, 'Class 9 B'),
            generateStudent('stu-9b-3', 'Sanjay Gupta', 3, 'Class 9 B'),
            generateStudent('stu-9b-4', 'Kavita Reddy', 4, 'Class 9 B'),
        ]
    }
];

export const mockStudentFees: StudentFee[] = [
  { studentId: 'S001', studentName: 'Ravi Kumar', className: '10 A', invoices: [
    { id: 'INV1001', description: 'Term 1 Tuition', amount: 15000, dueDate: '2024-07-15', status: 'Paid', paidOn: '2024-07-10' },
    { id: 'INV1002', description: 'Bus Fee - July', amount: 2500, dueDate: '2024-07-10', status: 'Pending' },
  ]},
  { studentId: 'S002', studentName: 'Priya Sharma', className: '9 B', invoices: [
    { id: 'INV2001', description: 'Term 1 Tuition', amount: 14000, dueDate: '2024-07-15', status: 'Pending' },
    { id: 'INV2002', description: 'Sports Fee', amount: 1500, dueDate: '2024-07-20', status: 'Paid', paidOn: '2024-07-18' },
     { id: 'INV2003', description: 'Lab Fee', amount: 1000, dueDate: '2024-06-20', status: 'Overdue' },
  ]},
   { studentId: 'S003', studentName: 'Amit Singh', className: '10 A', invoices: [
    { id: 'INV3001', description: 'Term 1 Tuition', amount: 15000, dueDate: '2024-07-15', status: 'Paid', paidOn: '2024-07-14' },
  ]},
];
