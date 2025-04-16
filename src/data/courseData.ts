
import { Module, AttendanceRecord, Assessment, CourseMetadata, Resource, Question, AssessmentQuestion } from "@/types/course";
import { addDays, subDays, format } from "date-fns";

// Helper to create dates for the course
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const startDate = subDays(today, 30);
const endDate = addDays(today, 60);

// Course metadata
export const courseMetadata: CourseMetadata = {
  id: "course-1",
  title: "Complete Web Development Masterclass",
  description: "Master modern web development from frontend to backend with this comprehensive course",
  startDate: formatDate(startDate),
  endDate: formatDate(endDate),
  instructorName: "Alex Johnson",
  instructorBio: "Senior Software Engineer with 10+ years of experience in web development and teaching",
  instructorImage: "https://randomuser.me/api/portraits/men/32.jpg",
  certificateAvailable: true,
  prerequisites: ["Basic computer skills", "Understanding of HTML", "No programming experience required"],
  targetAudience: ["Aspiring web developers", "Career switchers", "Computer science students"],
  skillLevel: "beginner"
};

export const courseModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Web Development",
    description: "Learn the basics of web development",
    completed: false,
    unlockDate: formatDate(startDate), // Available from the start
    lessons: [
      {
        id: "lesson-1-1",
        title: "HTML Fundamentals",
        description: "Understanding the building blocks of the web",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 600, // 10 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(startDate),
        resourceLinks: [
          {
            id: "resource-1-1-1",
            title: "HTML Cheat Sheet",
            type: "pdf",
            url: "https://htmlcheatsheet.com/HTML-Cheat-Sheet.pdf",
            description: "Quick reference guide for HTML tags"
          },
          {
            id: "resource-1-1-2",
            title: "W3Schools HTML Tutorial",
            type: "link",
            url: "https://www.w3schools.com/html/",
            description: "Comprehensive HTML tutorial"
          }
        ]
      },
      {
        id: "lesson-1-2",
        title: "CSS Basics",
        description: "Styling your web pages",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 720, // 12 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 2)),
        resourceLinks: [
          {
            id: "resource-1-2-1",
            title: "CSS Cheat Sheet",
            type: "pdf",
            url: "https://htmlcheatsheet.com/css/",
            description: "Quick reference guide for CSS properties"
          }
        ]
      },
      {
        id: "lesson-1-3",
        title: "JavaScript Introduction",
        description: "Making your websites interactive",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 900, // 15 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 4)),
        codingExercises: [
          {
            id: "exercise-1-3-1",
            title: "JavaScript Variables",
            description: "Practice declaring and using variables in JavaScript",
            starterCode: "// Declare a variable named 'greeting' and assign it a string value\n\n// Log the variable to the console",
            solution: "// Declare a variable named 'greeting' and assign it a string value\nlet greeting = 'Hello, World!';\n\n// Log the variable to the console\nconsole.log(greeting);",
            language: "javascript"
          }
        ]
      },
    ],
  },
  {
    id: "module-2",
    title: "Front-end Frameworks",
    description: "Dive into modern front-end frameworks",
    completed: false,
    unlockDate: formatDate(addDays(startDate, 7)), // Unlocks after one week
    lessons: [
      {
        id: "lesson-2-1",
        title: "React Fundamentals",
        description: "Building user interfaces with React",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1200, // 20 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 7)),
        codingExercises: [
          {
            id: "exercise-2-1-1",
            title: "Create a React Component",
            description: "Practice creating a simple React component",
            starterCode: "// Create a functional component named 'Greeting' that displays 'Hello, World!'\n\nfunction Greeting() {\n  // Your code here\n}\n\nexport default Greeting;",
            solution: "// Create a functional component named 'Greeting' that displays 'Hello, World!'\n\nfunction Greeting() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default Greeting;",
            language: "javascript"
          }
        ]
      },
      {
        id: "lesson-2-2",
        title: "State Management",
        description: "Managing application state in React",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 900, // 15 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 9))
      },
    ],
  },
  {
    id: "module-3",
    title: "Back-end Development",
    description: "Server-side programming and APIs",
    completed: false,
    unlockDate: formatDate(addDays(startDate, 14)), // Unlocks after two weeks
    lessons: [
      {
        id: "lesson-3-1",
        title: "Node.js Basics",
        description: "Server-side JavaScript with Node.js",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1500, // 25 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 14))
      },
      {
        id: "lesson-3-2",
        title: "RESTful APIs",
        description: "Building and consuming APIs",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1080, // 18 minutes
        completed: false,
        hasAssessment: true,
        unlockDate: formatDate(addDays(startDate, 16))
      },
    ],
  },
];

export const assessments: Assessment[] = [
  {
    id: "assessment-1",
    lessonId: "lesson-1-1",
    title: "HTML Fundamentals Quiz",
    dueDate: formatDate(addDays(startDate, 3)),
    questions: [
      {
        id: "q1",
        text: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctOptionIndex: 1,
      } as AssessmentQuestion,
      {
        id: "q2",
        text: "Which HTML element is used to define the structure of an HTML document?",
        options: ["<body>", "<structure>", "<html>", "<head>"],
        correctOptionIndex: 2,
      } as AssessmentQuestion,
    ],
  },
  {
    id: "assessment-2",
    lessonId: "lesson-1-2",
    title: "CSS Basics Quiz",
    dueDate: formatDate(addDays(startDate, 5)),
    questions: [
      {
        id: "q1",
        text: "Which property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctOptionIndex: 2,
      } as AssessmentQuestion,
      {
        id: "q2",
        text: "Which CSS property controls the spacing between elements?",
        options: ["spacing", "margin", "padding", "border"],
        correctOptionIndex: 1,
      } as AssessmentQuestion,
    ],
  },
  {
    id: "assessment-3",
    lessonId: "lesson-1-3",
    title: "JavaScript Basics Quiz",
    dueDate: formatDate(addDays(startDate, 7)),
    questions: [
      {
        id: "q1",
        text: "Which of the following is a JavaScript data type?",
        options: ["String", "Char", "Integer", "Float"],
        correctOptionIndex: 0,
      } as AssessmentQuestion,
      {
        id: "q2",
        text: "What will console.log(typeof([])) output?",
        options: ["array", "object", "list", "undefined"],
        correctOptionIndex: 1,
      } as AssessmentQuestion,
    ],
  },
];

// Generate some mock attendance data
export const generateAttendanceData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate attendance for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Randomly determine attendance (more likely to be present for recent days)
    const present = i < 7 ? Math.random() > 0.2 : Math.random() > 0.5;
    
    records.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      present,
      lessonId: present ? courseModules[Math.floor(Math.random() * courseModules.length)].lessons[0].id : undefined
    });
  }
  
  return records;
};

export const attendanceRecords = generateAttendanceData();

// Mock discussion data
export const discussions = [
  {
    id: "discussion-1",
    lessonId: "lesson-1-1",
    userId: "user-1",
    userName: "Sarah Johnson",
    content: "I'm having trouble understanding the difference between div and span. Can someone explain?",
    createdAt: formatDate(subDays(today, 5)),
    replies: [
      {
        id: "reply-1",
        discussionId: "discussion-1",
        userId: "user-2",
        userName: "Michael Lee",
        content: "Div is a block element while span is an inline element. Block elements start on a new line and take up the full width available, while inline elements only take up as much width as necessary.",
        createdAt: formatDate(subDays(today, 4)),
        upvotes: 3
      }
    ],
    upvotes: 5
  },
  {
    id: "discussion-2",
    lessonId: "lesson-1-2",
    userId: "user-3",
    userName: "Emma Roberts",
    content: "What's the best way to center a div horizontally and vertically?",
    createdAt: formatDate(subDays(today, 3)),
    replies: [],
    upvotes: 7
  }
];

// Mock Q&A data
export const questions: Question[] = [
  {
    id: "question-1",
    lessonId: "lesson-1-1",
    userId: "user-4",
    userName: "David Chen",
    content: "Why do we need the doctype declaration at the top of HTML documents?",
    createdAt: formatDate(subDays(today, 7)),
    resolved: true,
    upvotes: 0, // Add upvotes property
    answers: [
      {
        id: "answer-1",
        questionId: "question-1",
        userId: "instructor-1",
        userName: "Alex Johnson",
        content: "The DOCTYPE declaration is an instruction to the web browser about what version of HTML the page is written in. This ensures that the page is parsed the same way by different browsers. Without a DOCTYPE, browsers will use 'quirks mode' which can lead to inconsistent rendering.",
        createdAt: formatDate(subDays(today, 6)),
        isInstructor: true,
        upvotes: 12
      }
    ]
  },
  {
    id: "question-2",
    lessonId: "lesson-1-2",
    userId: "user-5",
    userName: "Lisa Wang",
    content: "How do I make my website responsive for different screen sizes?",
    createdAt: formatDate(subDays(today, 4)),
    resolved: false,
    upvotes: 0, // Add upvotes property
    answers: []
  }
];

// Database schema for reference (not used in the app)
export const databaseSchema = {
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "email", type: "varchar", isUnique: true },
        { name: "full_name", type: "varchar" },
        { name: "created_at", type: "timestamp" },
      ]
    },
    {
      name: "courses",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "title", type: "varchar" },
        { name: "description", type: "text" },
        { name: "start_date", type: "date" },
        { name: "end_date", type: "date" },
        { name: "instructor_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "created_at", type: "timestamp" },
      ]
    },
    {
      name: "modules",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "course_id", type: "uuid", isReference: true, refTable: "courses" },
        { name: "title", type: "varchar" },
        { name: "description", type: "text" },
        { name: "unlock_date", type: "date" },
        { name: "order", type: "integer" },
      ]
    },
    {
      name: "lessons",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "module_id", type: "uuid", isReference: true, refTable: "modules" },
        { name: "title", type: "varchar" },
        { name: "description", type: "text" },
        { name: "video_url", type: "varchar" },
        { name: "duration", type: "integer" },
        { name: "unlock_date", type: "date" },
        { name: "order", type: "integer" },
      ]
    },
    {
      name: "resources",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "title", type: "varchar" },
        { name: "type", type: "varchar" },
        { name: "url", type: "varchar" },
        { name: "description", type: "text" },
      ]
    },
    {
      name: "assessments",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "title", type: "varchar" },
        { name: "due_date", type: "date" },
      ]
    },
    {
      name: "questions",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "assessment_id", type: "uuid", isReference: true, refTable: "assessments" },
        { name: "text", type: "text" },
        { name: "options", type: "jsonb" },
        { name: "correct_option", type: "integer" },
      ]
    },
    {
      name: "user_progress",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "course_id", type: "uuid", isReference: true, refTable: "courses" },
        { name: "completed_lessons", type: "jsonb" },
        { name: "completed_modules", type: "jsonb" },
        { name: "last_accessed_lesson", type: "uuid" },
        { name: "assessment_results", type: "jsonb" },
      ]
    },
    {
      name: "attendance",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "course_id", type: "uuid", isReference: true, refTable: "courses" },
        { name: "date", type: "date" },
        { name: "present", type: "boolean" },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
      ]
    },
    {
      name: "notes",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "content", type: "text" },
        { name: "created_at", type: "timestamp" },
        { name: "updated_at", type: "timestamp" },
      ]
    },
    {
      name: "bookmarks",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "created_at", type: "timestamp" },
      ]
    },
    {
      name: "discussions",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "content", type: "text" },
        { name: "created_at", type: "timestamp" },
        { name: "upvotes", type: "integer" },
      ]
    },
    {
      name: "discussion_replies",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "discussion_id", type: "uuid", isReference: true, refTable: "discussions" },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "content", type: "text" },
        { name: "created_at", type: "timestamp" },
        { name: "upvotes", type: "integer" },
      ]
    },
    {
      name: "questions",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "lesson_id", type: "uuid", isReference: true, refTable: "lessons" },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "content", type: "text" },
        { name: "created_at", type: "timestamp" },
        { name: "resolved", type: "boolean" },
      ]
    },
    {
      name: "answers",
      columns: [
        { name: "id", type: "uuid", isPrimary: true },
        { name: "question_id", type: "uuid", isReference: true, refTable: "questions" },
        { name: "user_id", type: "uuid", isReference: true, refTable: "users" },
        { name: "content", type: "text" },
        { name: "created_at", type: "timestamp" },
        { name: "is_instructor", type: "boolean" },
        { name: "upvotes", type: "integer" },
      ]
    }
  ],
};
