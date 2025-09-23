

export type Topic = {
    id: string;
    title: string;
    description: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
};

export type Chapter = {
    id: string;
    name: string;
    progress: number;
    topics: Topic[];
};

export type Subject = {
    id: string;
    name: string;
    chapters: Chapter[];
};

export const subjects: Subject[] = [
    {
        id: 'math',
        name: 'Mathematics',
        chapters: [
            {
                id: 'ch1-algebra',
                name: 'Chapter 1: Algebra Basics',
                progress: 100,
                topics: [
                    { id: 't1', title: 'Variables and Expressions', description: 'Understanding the basics of variables and how they represent unknown values in equations.', status: 'Completed' },
                    { id: 't2', title: 'Solving Linear Equations', description: 'Methods for solving single-variable linear equations, including isolating the variable.', status: 'Completed' },
                    { id: 't3', title: 'Inequalities', description: 'Solving and graphing inequalities on a number line to represent a range of possible values.', status: 'Completed' },
                ]
            },
            {
                id: 'ch2-geometry',
                name: 'Chapter 2: Geometry',
                progress: 50,
                topics: [
                    { id: 't4', title: 'Lines and Angles', description: 'Exploring properties of parallel lines, perpendicular lines, and the angles they form.', status: 'Completed' },
                    { id: 't5', title: 'Triangles', description: 'Classifying triangles by sides and angles, and understanding the Triangle Sum Theorem.', status: 'In Progress' },
                    { id: 't6', title: 'Circles', description: 'Calculating circumference and area, and understanding the properties of chords and tangents.', status: 'Not Started' },
                ]
            },
            {
                id: 'ch3-calculus',
                name: 'Chapter 3: Introduction to Calculus',
                progress: 0,
                topics: [
                    { id: 't7', title: 'Limits', description: 'Grasping the foundational concept of a limit and how it describes function behavior.', status: 'Not Started' },
                    { id: 't8', title: 'Derivatives', description: 'Learning to find the instantaneous rate of change of a function.', status: 'Not Started' },
                ]
            }
        ],
    },
    {
        id: 'science',
        name: 'Science',
        chapters: [
            {
                id: 'ch1-biology',
                name: 'Chapter 1: Cell Biology',
                progress: 75,
                topics: [
                    { id: 't1', title: 'The Cell Theory', description: 'Understanding the history and three fundamental principles of cell theory.', status: 'Completed' },
                    { id: 't2', title: 'Organelles', description: 'Identifying the structure and function of major cell organelles like the nucleus and mitochondria.', status: 'Completed' },
                    { id: 't3', title: 'Cell Division', description: 'Differentiating between the processes of mitosis for growth and meiosis for reproduction.', status: 'In Progress' },
                ]
            },
            {
                id: 'ch2-physics',
                name: 'Chapter 2: Forces and Motion',
                progress: 25,
                topics: [
                    { id: 't4', title: 'Newton\'s Laws of Motion', description: 'Applying the three laws to understand how forces affect an object\'s motion.', status: 'In Progress' },
                    { id: 't5', title: 'Friction and Gravity', description: 'Analyzing the fundamental forces of friction and gravity and their real-world effects.', status: 'Not Started' },
                    { id: 't6', title: 'Work and Energy', description: 'Exploring the relationship between work, power, and the different forms of energy.', status: 'Not Started' },
                ]
            }
        ],
    },
     {
        id: 'english',
        name: 'English',
        chapters: [
            {
                id: 'ch1-grammar',
                name: 'Unit 1: Grammar Fundamentals',
                progress: 100,
                topics: [
                    { id: 't1', title: 'Parts of Speech', description: 'Identifying nouns, verbs, adjectives, adverbs, and other core components of sentences.', status: 'Completed' },
                    { id: 't2', title: 'Sentence Structure', description: 'Constructing simple, compound, and complex sentences to convey ideas effectively.', status: 'Completed' },
                ]
            },
            {
                id: 'ch2-literature',
                name: 'Unit 2: Shakespeare\'s Macbeth',
                progress: 33,
                topics: [
                    { id: 't3', title: 'Act I Analysis', description: 'Analyzing key themes, characters, and plot developments in the opening act.', status: 'In Progress' },
                    { id: 't4', title: 'Act II Analysis', description: 'Following the rising action and the pivotal events of the second act.', status: 'Not Started' },
                    { id: 't5', title: 'Symbolism in the Play', description: 'Interpreting the symbolic meaning of blood, daggers, and apparitions.', status: 'Not Started' },
                ]
            }
        ],
    }
];


export const aiInsights = {
    current: {
        topic: "Triangles",
        summary: "Based on recent homework, you are currently studying the classification and properties of triangles."
    },
    today: {
        topic: "Triangle Sum Theorem",
        summary: "Today's class likely focused on understanding that the interior angles of a triangle always add up to 180 degrees."
    },
    yesterday: {
        topic: "Lines and Angles",
        summary: "Yesterday's quiz covered the properties of parallel and perpendicular lines, which is foundational for geometry."
    }
};
