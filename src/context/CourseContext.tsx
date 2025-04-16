
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Module, Lesson, AttendanceRecord, Assessment, CourseProgress, CourseMetadata, Note, Discussion, Question as CourseQuestion } from '@/types/course';
import { courseModules, attendanceRecords, assessments, courseMetadata, discussions, questions as courseQuestions } from '@/data/courseData';
import { toast } from '@/components/ui/use-toast';
import { isDateUnlocked } from '@/lib/utils';

interface CourseContextType {
  modules: Module[];
  currentModule: Module | null;
  currentLesson: Lesson | null;
  attendance: AttendanceRecord[];
  assessments: Assessment[];
  courseMetadata: CourseMetadata;
  progress: CourseProgress;
  discussions: Discussion[];
  questions: CourseQuestion[];
  isPlaying: boolean;
  currentTime: number;
  isSkipModalOpen: boolean;
  isResourcesOpen: boolean;
  isNotesOpen: boolean;
  isAITutorOpen: boolean;
  currentNote: Note | null;
  setCurrentModule: (module: Module) => void;
  setCurrentLesson: (lesson: Lesson) => void;
  markLessonCompleted: (lessonId: string) => void;
  recordAttendance: (lessonId: string, date?: Date) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  openSkipModal: () => void;
  closeSkipModal: () => void;
  toggleResources: () => void;
  toggleNotes: () => void;
  toggleAITutor: () => void;
  getCurrentAssessment: () => Assessment | null;
  submitAssessment: (assessmentId: string, score: number) => void;
  addNote: (content: string) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
  submitQuestion: (content: string) => void;
  submitAnswer: (questionId: string, content: string) => void;
  submitDiscussion: (content: string) => void;
  submitDiscussionReply: (discussionId: string, content: string) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;
  upvoteDiscussion: (discussionId: string) => void;
  isLessonUnlocked: (lesson: Lesson) => boolean;
  isModuleUnlocked: (module: Module) => boolean;
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
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [courseDiscussions, setCourseDiscussions] = useState<Discussion[]>(discussions);
  const [courseQuestionsState, setCourseQuestions] = useState<CourseQuestion[]>(courseQuestions);
  const [progress, setProgress] = useState<CourseProgress>({
    completedLessons: [],
    completedModules: [],
    lastAccessedLessonId: null,
    assessmentResults: {},
    notes: [],
    bookmarks: [],
  });

  useEffect(() => {
    // Initialize with the first module and lesson if nothing is selected
    if (!currentModule && modules.length > 0) {
      const firstUnlockedModule = modules.find(module => isModuleUnlocked(module));
      
      if (firstUnlockedModule) {
        setCurrentModule(firstUnlockedModule);
        
        // Find first unlocked lesson in this module
        const firstUnlockedLesson = firstUnlockedModule.lessons.find(lesson => 
          isLessonUnlocked(lesson)
        );
        
        if (firstUnlockedLesson) {
          setCurrentLesson(firstUnlockedLesson);
        }
      }
    }
  }, [modules]);

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
  
  const toggleResources = () => {
    setIsResourcesOpen(!isResourcesOpen);
    setIsNotesOpen(false);
    setIsAITutorOpen(false);
  };
  
  const toggleNotes = () => {
    setIsNotesOpen(!isNotesOpen);
    setIsResourcesOpen(false);
    setIsAITutorOpen(false);
  };
  
  const toggleAITutor = () => {
    setIsAITutorOpen(!isAITutorOpen);
    setIsResourcesOpen(false);
    setIsNotesOpen(false);
  };
  
  const isModuleUnlocked = (module: Module): boolean => {
    return isDateUnlocked(module.unlockDate);
  };
  
  const isLessonUnlocked = (lesson: Lesson): boolean => {
    return isDateUnlocked(lesson.unlockDate);
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
  
  const addNote = (content: string) => {
    if (!currentLesson) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      lessonId: currentLesson.id,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProgress(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    
    setCurrentNote(newNote);
    
    toast({
      title: "Note Added",
      description: "Your note has been saved.",
    });
  };
  
  const updateNote = (noteId: string, content: string) => {
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.map(note => 
        note.id === noteId 
          ? { ...note, content, updatedAt: new Date().toISOString() } 
          : note
      )
    }));
    
    toast({
      title: "Note Updated",
      description: "Your note has been updated.",
    });
  };
  
  const deleteNote = (noteId: string) => {
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
    
    setCurrentNote(null);
    
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted.",
    });
  };
  
  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarks.includes(lessonId);
      
      if (isBookmarked) {
        return {
          ...prev,
          bookmarks: prev.bookmarks.filter(id => id !== lessonId)
        };
      } else {
        return {
          ...prev,
          bookmarks: [...prev.bookmarks, lessonId]
        };
      }
    });
    
    toast({
      title: isBookmarked(lessonId) ? "Bookmark Removed" : "Bookmark Added",
      description: isBookmarked(lessonId) 
        ? "This lesson has been removed from your bookmarks." 
        : "This lesson has been added to your bookmarks.",
    });
  };
  
  const isBookmarked = (lessonId: string): boolean => {
    return progress.bookmarks.includes(lessonId);
  };
  
  const submitQuestion = (content: string) => {
    if (!currentLesson) return;
    
    const newQuestion: CourseQuestion = {
      id: `question-${Date.now()}`,
      lessonId: currentLesson.id,
      userId: "user-1", // In a real app, this would be the current user's ID
      userName: "You", // In a real app, this would be the current user's name
      content,
      createdAt: new Date().toISOString(),
      resolved: false,
      answers: []
    };
    
    setCourseQuestions(prev => [...prev, newQuestion]);
    
    toast({
      title: "Question Submitted",
      description: "Your question has been submitted. You'll be notified when it's answered.",
    });
  };
  
  const submitAnswer = (questionId: string, content: string) => {
    const newAnswer = {
      id: `answer-${Date.now()}`,
      questionId,
      userId: "user-1", // In a real app, this would be the current user's ID
      userName: "You", // In a real app, this would be the current user's name
      content,
      createdAt: new Date().toISOString(),
      isInstructor: false, // In a real app, this would depend on the user's role
      upvotes: 0
    };
    
    setCourseQuestions(prev => 
      prev.map(question => 
        question.id === questionId 
          ? { ...question, answers: [...question.answers, newAnswer] } 
          : question
      )
    );
    
    toast({
      title: "Answer Submitted",
      description: "Your answer has been submitted.",
    });
  };
  
  const submitDiscussion = (content: string) => {
    if (!currentLesson) return;
    
    const newDiscussion: Discussion = {
      id: `discussion-${Date.now()}`,
      lessonId: currentLesson.id,
      userId: "user-1", // In a real app, this would be the current user's ID
      userName: "You", // In a real app, this would be the current user's name
      content,
      createdAt: new Date().toISOString(),
      replies: [],
      upvotes: 0
    };
    
    setCourseDiscussions(prev => [...prev, newDiscussion]);
    
    toast({
      title: "Discussion Started",
      description: "Your discussion topic has been posted.",
    });
  };
  
  const submitDiscussionReply = (discussionId: string, content: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      discussionId,
      userId: "user-1", // In a real app, this would be the current user's ID
      userName: "You", // In a real app, this would be the current user's name
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0
    };
    
    setCourseDiscussions(prev => 
      prev.map(discussion => 
        discussion.id === discussionId 
          ? { ...discussion, replies: [...discussion.replies, newReply] } 
          : discussion
      )
    );
    
    toast({
      title: "Reply Posted",
      description: "Your reply has been posted.",
    });
  };
  
  const upvoteQuestion = (questionId: string) => {
    // In a real app, you would check if the user has already upvoted
    setCourseQuestions(prev => 
      prev.map(question => 
        question.id === questionId 
          ? { ...question, upvotes: (question.upvotes || 0) + 1 } 
          : question
      )
    );
  };
  
  const upvoteAnswer = (questionId: string, answerId: string) => {
    // In a real app, you would check if the user has already upvoted
    setCourseQuestions(prev => 
      prev.map(question => 
        question.id === questionId 
          ? { 
              ...question, 
              answers: question.answers.map(answer => 
                answer.id === answerId 
                  ? { ...answer, upvotes: answer.upvotes + 1 } 
                  : answer
              ) 
            } 
          : question
      )
    );
  };
  
  const upvoteDiscussion = (discussionId: string) => {
    // In a real app, you would check if the user has already upvoted
    setCourseDiscussions(prev => 
      prev.map(discussion => 
        discussion.id === discussionId 
          ? { ...discussion, upvotes: discussion.upvotes + 1 } 
          : discussion
      )
    );
  };

  const value = {
    modules,
    currentModule,
    currentLesson,
    attendance,
    assessments,
    courseMetadata,
    progress,
    discussions: courseDiscussions,
    questions: courseQuestionsState,
    isPlaying,
    currentTime,
    isSkipModalOpen,
    isResourcesOpen,
    isNotesOpen,
    isAITutorOpen,
    currentNote,
    setCurrentModule,
    setCurrentLesson,
    markLessonCompleted,
    recordAttendance,
    togglePlay,
    setCurrentTime,
    openSkipModal,
    closeSkipModal,
    toggleResources,
    toggleNotes,
    toggleAITutor,
    getCurrentAssessment,
    submitAssessment,
    addNote,
    updateNote,
    deleteNote,
    toggleBookmark,
    isBookmarked,
    submitQuestion,
    submitAnswer,
    submitDiscussion,
    submitDiscussionReply,
    upvoteQuestion,
    upvoteAnswer,
    upvoteDiscussion,
    isLessonUnlocked,
    isModuleUnlocked,
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
