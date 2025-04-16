
export interface Module {
  id: string;
  title: string;
  description: string;
  completed: boolean;
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
}

export interface Assessment {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
}

export interface Question {
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
}
