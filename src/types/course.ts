
export interface Module {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  unlockDate: string; // ISO date string when this module unlocks
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  completed: boolean;
  hasAssessment: boolean;
  unlockDate: string; // ISO date string when this lesson unlocks
  resourceLinks?: Resource[];
  codingExercises?: CodingExercise[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'note' | 'code' | 'video';
  url: string;
  description?: string;
}

export interface CodingExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css';
}

export interface Assessment {
  id: string;
  lessonId: string;
  title: string;
  dueDate: string; // ISO date string
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface AttendanceRecord {
  date: string; // ISO date string
  present: boolean;
  lessonId?: string; // The lesson that was completed on this day
}

export interface CourseProgress {
  completedLessons: string[]; // Array of lesson IDs that have been completed
  completedModules: string[]; // Array of module IDs that have been completed
  lastAccessedLessonId: string | null;
  assessmentResults: {
    [assessmentId: string]: {
      score: number;
      completed: boolean;
      date: string;
    };
  };
  notes: Note[];
  bookmarks: string[]; // Array of lesson IDs that are bookmarked
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'rejected';
  score?: number;
  feedback?: string;
}

export interface Discussion {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  replies: DiscussionReply[];
  upvotes: number;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface Question {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  answers: Answer[];
  resolved: boolean;
  upvotes?: number; // Added upvotes property
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isInstructor: boolean;
  upvotes: number;
}

export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  instructorName: string;
  instructorBio: string;
  instructorImage: string;
  certificateAvailable: boolean;
  prerequisites: string[];
  targetAudience: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}
