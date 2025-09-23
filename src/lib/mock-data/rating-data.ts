

export const subjectsWithTeachers = [
    {
        subjectId: "math",
        subjectName: "Mathematics",
        teachers: [{ id: "TCH001", name: "Mr. Ramesh Kumar" }]
    },
    {
        subjectId: "science",
        subjectName: "Science",
        teachers: [{ id: "TCH002", name: "Mrs. Sunita Gupta" }]
    },
    {
        subjectId: "english",
        subjectName: "English",
        teachers: [{ id: "TCH003", name: "Mrs. Das" }]
    },
    {
        subjectId: "history",
        subjectName: "History",
        teachers: [{ id: "TCH004", name: "Mr. Verma" }]
    }
];

// Mock of what a student's ratings for the current week might look like.
// In a real DB, this would be tied to the student's ID.
// Key: teacherId, Value: { [subjectId]: rating }
export const studentRatings: Record<string, Record<string, number>> = {
    "TCH001": { "math": 4 }, // Already rated Mr. Ramesh for Math
};


export const allTeacherRatings = [
    {
        id: "TCH001",
        name: "Mr. Ramesh Kumar",
        subject: "Mathematics",
        avatar: "https://avatar.vercel.sh/Mr.%20Ramesh%20Kumar.png",
        weeklyRatings: [4.8, 4.7, 4.9, 4.6],
        monthlyAvg: 4.75,
    },
    {
        id: "TCH002",
        name: "Mrs. Sunita Gupta",
        subject: "Science",
        avatar: "https://avatar.vercel.sh/Mrs.%20Sunita%20Gupta.png",
        weeklyRatings: [4.5, 4.6, 4.4, 4.7],
        monthlyAvg: 4.55,
    },
    {
        id: "TCH003",
        name: "Mrs. Das",
        subject: "English",
        avatar: "https://avatar.vercel.sh/Mrs.%20Das.png",
        weeklyRatings: [4.9, 4.9, 4.8, 5.0],
        monthlyAvg: 4.9,
    },
    {
        id: "TCH004",
        name: "Mr. Verma",
        subject: "History",
        avatar: "https://avatar.vercel.sh/Mr.%20Verma.png",
        weeklyRatings: [4.2, 4.3, 4.1, 4.4],
        monthlyAvg: 4.25,
    },
    {
        id: "TCH005",
        name: "Mr. Sharma",
        subject: "Science",
        avatar: "https://avatar.vercel.sh/Mr.%20Sharma.png",
        weeklyRatings: [4.6, 4.7, 4.5, 4.8],
        monthlyAvg: 4.65,
    },
     {
        id: "TCH006",
        name: "Ms. Reddy",
        subject: "Mathematics",
        avatar: "https://avatar.vercel.sh/Ms.%20Reddy.png",
        weeklyRatings: [4.3, 4.4, 4.2, 4.5],
        monthlyAvg: 4.35,
    },
];
