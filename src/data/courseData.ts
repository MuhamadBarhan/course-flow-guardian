
import { Module, AttendanceRecord, Assessment } from "@/types/course";

export const courseModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Web Development",
    description: "Learn the basics of web development",
    completed: false,
    lessons: [
      {
        id: "lesson-1-1",
        title: "HTML Fundamentals",
        description: "Understanding the building blocks of the web",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 600, // 10 minutes
        completed: false,
        hasAssessment: true,
      },
      {
        id: "lesson-1-2",
        title: "CSS Basics",
        description: "Styling your web pages",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 720, // 12 minutes
        completed: false,
        hasAssessment: true,
      },
      {
        id: "lesson-1-3",
        title: "JavaScript Introduction",
        description: "Making your websites interactive",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 900, // 15 minutes
        completed: false,
        hasAssessment: true,
      },
    ],
  },
  {
    id: "module-2",
    title: "Front-end Frameworks",
    description: "Dive into modern front-end frameworks",
    completed: false,
    lessons: [
      {
        id: "lesson-2-1",
        title: "React Fundamentals",
        description: "Building user interfaces with React",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1200, // 20 minutes
        completed: false,
        hasAssessment: true,
      },
      {
        id: "lesson-2-2",
        title: "State Management",
        description: "Managing application state in React",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 900, // 15 minutes
        completed: false,
        hasAssessment: true,
      },
    ],
  },
  {
    id: "module-3",
    title: "Back-end Development",
    description: "Server-side programming and APIs",
    completed: false,
    lessons: [
      {
        id: "lesson-3-1",
        title: "Node.js Basics",
        description: "Server-side JavaScript with Node.js",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1500, // 25 minutes
        completed: false,
        hasAssessment: true,
      },
      {
        id: "lesson-3-2",
        title: "RESTful APIs",
        description: "Building and consuming APIs",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        duration: 1080, // 18 minutes
        completed: false,
        hasAssessment: true,
      },
    ],
  },
];

export const assessments: Assessment[] = [
  {
    id: "assessment-1",
    lessonId: "lesson-1-1",
    title: "HTML Fundamentals Quiz",
    questions: [
      {
        id: "q1",
        text: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctOptionIndex: 1,
      },
      {
        id: "q2",
        text: "Which HTML element is used to define the structure of an HTML document?",
        options: ["<body>", "<structure>", "<html>", "<head>"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "assessment-2",
    lessonId: "lesson-1-2",
    title: "CSS Basics Quiz",
    questions: [
      {
        id: "q1",
        text: "Which property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctOptionIndex: 2,
      },
      {
        id: "q2",
        text: "Which CSS property controls the spacing between elements?",
        options: ["spacing", "margin", "padding", "border"],
        correctOptionIndex: 1,
      },
    ],
  }
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
