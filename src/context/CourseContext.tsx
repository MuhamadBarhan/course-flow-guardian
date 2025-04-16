
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Module, Lesson, AttendanceRecord, Assessment, CourseProgress } from '@/types/course';
import { courseModules, attendanceRecords, assessments } from '@/data/courseData';
import { toast } from '@/components/ui/use-toast';

interface CourseContextType {
  modules: Module[];
  currentModule: Module | null;
  currentLesson: Lesson | null;
  attendance: AttendanceRecord[];
  assessments: Assessment[];
  progress: CourseProgress;
  isPlaying: boolean;
  currentTime: number;
  isSkipModalOpen: boolean;
  setCurrentModule: (module: Module) => void;
  setCurrentLesson: (lesson: Lesson) => void;
  markLessonCompleted: (lessonId: string) => void;
  recordAttendance: (lessonId: string, date?: Date) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  openSkipModal: () => void;
  closeSkipModal: () => void;
  getCurrentAssessment: () => Assessment | null;
  submitAssessment: (assessmentId: string, score: number) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>(courseModules);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(attendanceRecords);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [progress, setProgress] = useState<CourseProgress>({
    completedLessons: [],
    completedModules: [],
    lastAccessedLessonId: null,
    assessmentResults: {},
  });

  useEffect(() => {
    // Initialize with the first module and lesson if nothing is selected
    if (!currentModule && modules.length > 0) {
      setCurrentModule(modules[0]);
      if (modules[0].lessons.length > 0) {
        setCurrentLesson(modules[0].lessons[0]);
      }
    }
  }, [modules, currentModule]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const openSkipModal = () => {
    setIsSkipModalOpen(true);
    setIsPlaying(false);
  };

  const closeSkipModal = () => {
    setIsSkipModalOpen(false);
  };

  const markLessonCompleted = (lessonId: string) => {
    const updatedModules = modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ),
      // Check if all lessons in the module are completed
      completed: module.lessons.every(lesson => 
        lesson.id === lessonId ? true : lesson.completed
      )
    }));
    
    setModules(updatedModules);
    
    // Update progress
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      completedModules: updatedModules
        .filter(m => m.completed)
        .map(m => m.id)
        .filter(id => !prev.completedModules.includes(id))
    }));
    
    // Record attendance for today
    recordAttendance(lessonId);
    
    toast({
      title: "Lesson Completed",
      description: "Great job! You've completed this lesson.",
    });
  };

  const recordAttendance = (lessonId: string, date = new Date()) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Check if there's already an attendance record for this date
    const existingRecordIndex = attendance.findIndex(
      record => record.date === dateString
    );
    
    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedAttendance = [...attendance];
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        present: true,
        lessonId
      };
      setAttendance(updatedAttendance);
    } else {
      // Add new record
      setAttendance([
        ...attendance,
        {
          date: dateString,
          present: true,
          lessonId
        }
      ]);
    }
  };

  const getCurrentAssessment = (): Assessment | null => {
    if (!currentLesson) return null;
    return assessments.find(a => a.lessonId === currentLesson.id) || null;
  };

  const submitAssessment = (assessmentId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      assessmentResults: {
        ...prev.assessmentResults,
        [assessmentId]: {
          score,
          completed: true,
          date: new Date().toISOString()
        }
      }
    }));
    
    // If the assessment is passed and the current lesson has it, mark the lesson as completed
    if (score >= 70 && currentLesson && currentLesson.hasAssessment) {
      markLessonCompleted(currentLesson.id);
    }
    
    closeSkipModal();
    
    toast({
      title: score >= 70 ? "Assessment Passed!" : "Assessment Failed",
      description: score >= 70 
        ? `Congratulations! You scored ${score}%.` 
        : `You scored ${score}%. Try again to continue.`,
      variant: score >= 70 ? "default" : "destructive",
    });
  };

  const value = {
    modules,
    currentModule,
    currentLesson,
    attendance,
    assessments,
    progress,
    isPlaying,
    currentTime,
    isSkipModalOpen,
    setCurrentModule,
    setCurrentLesson,
    markLessonCompleted,
    recordAttendance,
    togglePlay,
    setCurrentTime,
    openSkipModal,
    closeSkipModal,
    getCurrentAssessment,
    submitAssessment,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
