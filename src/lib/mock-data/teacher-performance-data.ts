

import { Calendar } from "@/components/ui/calendar";

export type TeacherAttendance = {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    recentAbsences: { date: string, reason: string }[];
};

export type ChapterStatus = {
    subject: string;
    chapter: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
    completionDate: string | null;
};

export type ClassActivity = {
    class: string;
    lastActivity: string;
    nextTopic: string;
    chapters: ChapterStatus[];
};

export type TeacherPerformanceData = {
    id: string;
    name: string;
    attendance: TeacherAttendance;
    classActivities: ClassActivity[];
};


export const allTeacherPerformanceData: TeacherPerformanceData[] = [
    {
        id: "TCH001",
        name: "Mr. Ramesh Kumar",
        attendance: {
            totalDays: 22,
            present: 21,
            absent: 1,
            late: 2,
            recentAbsences: [{ date: "2024-07-15", reason: "Sick Leave" }],
        },
        classActivities: [
            {
                class: "Class 10 A",
                lastActivity: "Completed exercise on Quadratic Equations.",
                nextTopic: "Introduction to Trigonometry.",
                chapters: [
                    { subject: "Mathematics", chapter: "Chapter 1: Algebra Basics", status: "Completed", completionDate: "2024-07-10" },
                    { subject: "Mathematics", chapter: "Chapter 2: Geometry", status: "In Progress", completionDate: null },
                ]
            },
            {
                class: "Class 9 B",
                lastActivity: "Quiz on Linear Equations.",
                nextTopic: "Polynomials.",
                 chapters: [
                    { subject: "Mathematics", chapter: "Chapter 1: Number Systems", status: "Completed", completionDate: "2024-07-05" },
                    { subject: "Mathematics", chapter: "Chapter 2: Polynomials", status: "Not Started", completionDate: null },
                ]
            },
        ]
    },
    {
        id: "TCH002",
        name: "Mrs. Sunita Gupta",
        attendance: {
            totalDays: 22,
            present: 22,
            absent: 0,
            late: 0,
            recentAbsences: [],
        },
         classActivities: [
            {
                class: "Class 10 A",
                lastActivity: "Conducted experiment on Photosynthesis.",
                nextTopic: "Human Respiratory System.",
                chapters: [
                     { subject: "Science", chapter: "Chapter 1: Cell Biology", status: "Completed", completionDate: "2024-07-12" },
                    { subject: "Science", chapter: "Chapter 2: Forces and Motion", status: "In Progress", completionDate: null },
                ]
            }
        ]
    },
     {
        id: "TCH003",
        name: "Mrs. Das",
        attendance: {
            totalDays: 22,
            present: 22,
            absent: 0,
            late: 1,
            recentAbsences: [],
        },
        classActivities: []
    },
     {
        id: "TCH004",
        name: "Mr. Verma",
        attendance: {
            totalDays: 22,
            present: 20,
            absent: 2,
            late: 3,
            recentAbsences: [
                { date: "2024-07-10", reason: "Personal" },
                { date: "2024-07-18", reason: "Sick Leave" },
            ],
        },
        classActivities: []
    }
];
