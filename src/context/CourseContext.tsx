
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Module, Lesson, AttendanceRecord, Assessment, CourseProgress, CourseMetadata, Note, Discussion, Question as CourseQuestion, AssessmentQuestion, InVideoQuestion } from '@/types/course';
import { courseModules, attendanceRecords, assessments, courseMetadata, discussions, questions as courseQuestions } from '@/data/courseData';
import { toast } from '@/components/ui/use-toast';
import { isDateUnlocked, safeParseISO } from '@/lib/utils';
import { isSameDay, isAfter, isBefore, subDays, addDays } from 'date-fns';

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
  markInVideoQuestionAnswered: (questionId: string) => void;
  getNextLesson: () => Lesson | null;
  downloadCertificate: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }) => {
  const [modules, setModules] = useState(courseModules);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [attendance, setAttendance] = useState(attendanceRecords);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [courseDiscussions, setCourseDiscussions] = useState(discussions);
  const [courseQuestionsState, setCourseQuestions] = useState(courseQuestions);
  const [progress, setProgress] = useState({
    completedLessons: [],
    completedModules: [],
    lastAccessedLessonId: null,
    assessmentResults: {},
    notes: [],
    bookmarks: [],
    answeredInVideoQuestions: [],
  });
  
  // Track last visit date
  const [lastVisitDate, setLastVisitDate] = useState(() => {
    const storedDate = localStorage.getItem('lastVisitDate');
    return storedDate ? new Date(storedDate) : new Date();
  });

  useEffect(() => {
    // Update last visit date in localStorage
    const today = new Date();
    localStorage.setItem('lastVisitDate', today.toISOString());
    
    // Check for absent days between last visit and today
    if (lastVisitDate) {
      markAttendanceForMissedDays(lastVisitDate, today);
    }
    
    setLastVisitDate(today);
    
    // Check for today's attendance and mark as present
    const todayStr = today.toISOString().split('T')[0];
    const alreadyMarkedToday = attendance.some(
      record => record.date === todayStr
    );
    
    if (!alreadyMarkedToday) {
      // Mark attendance for today as present
      setAttendance(prev => [...prev, {
        date: todayStr,
        present: true,
        lessonId: null // Will be updated when a lesson is completed
      }]);
    }
    
    // Initialize current module and lesson
    if (!currentModule && modules.length > 0) {
      const firstUnlockedModule = modules.find(module => isModuleUnlocked(module));
      
      if (firstUnlockedModule) {
        setCurrentModule(firstUnlockedModule);
        
        const firstUnlockedLesson = firstUnlockedModule.lessons.find(lesson => 
          isLessonUnlocked(lesson)
        );
        
        if (firstUnlockedLesson) {
          setCurrentLesson(firstUnlockedLesson);
        }
      }
    }
  }, [modules]);
  
  // Mark attendance for days when user was absent
  const markAttendanceForMissedDays = (lastVisit, today) => {
    // Set both dates to midnight for comparison
    const lastDate = new Date(lastVisit);
    lastDate.setHours(0, 0, 0, 0);
    
    const currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);
    
    // If last visit was today, no need to mark absent days
    if (isSameDay(lastDate, currentDate)) {
      return;
    }
    
    let dateToCheck = addDays(lastDate, 1);
    
    // Loop through each day between last visit and today
    while (isBefore(dateToCheck, currentDate)) {
      const dateStr = dateToCheck.toISOString().split('T')[0];
      
      // Check if we already have a record for this date
      const existingRecord = attendance.find(record => record.date === dateStr);
      
      if (!existingRecord) {
        // Mark as absent for this day
        setAttendance(prev => [...prev, {
          date: dateStr,
          present: false,
          lessonId: null
        }]);
      }
      
      dateToCheck = addDays(dateToCheck, 1);
    }
  };

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
  
  const isModuleUnlocked = (module) => {
    // Get all module indices
    const moduleIndex = modules.findIndex(m => m.id === module.id);
    
    // Module 0 (first module) is always unlocked on day 1
    if (moduleIndex === 0) {
      return true;
    }
    
    // For subsequent modules, check if previous module is completed
    // and also check if enough days have passed since course start
    const previousModulesCompleted = modules
      .slice(0, moduleIndex)
      .every(m => m.completed);
    
    // Check if moduleIndex days have passed since course start date
    const courseStartDate = safeParseISO(courseMetadata.startDate);
    if (!courseStartDate) return false;
    
    // Get today's date
    const today = new Date();
    
    // Calculate the date when this module should unlock
    // Each module unlocks on a new day
    const moduleUnlockDate = addDays(courseStartDate, moduleIndex);
    
    // Module unlocks if today is after or on the unlock date
    const daysPassed = !isBefore(today, moduleUnlockDate);
    
    // Previous absent days get unlocked when user returns
    // This is handled by ensuring all previous modules are available on return
    
    return daysPassed;
  };
  
  const isLessonUnlocked = (lesson) => {
    // Find which module this lesson belongs to
    const parentModule = modules.find(module => 
      module.lessons.some(l => l.id === lesson.id)
    );
    
    if (!parentModule) return false;
    
    // If the module is not unlocked, lessons are not unlocked
    if (!isModuleUnlocked(parentModule)) return false;
    
    // Get the lesson index in the module
    const lessonIndex = parentModule.lessons.findIndex(l => l.id === lesson.id);
    
    // First lesson is always unlocked if module is unlocked
    if (lessonIndex === 0) return true;
    
    // For subsequent lessons, previous lesson must be completed
    const previousLessonsCompleted = parentModule.lessons
      .slice(0, lessonIndex)
      .every(l => progress.completedLessons.includes(l.id));
    
    return previousLessonsCompleted;
  };

  const markLessonCompleted = (lessonId) => {
    const updatedModules = modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ),
      completed: module.lessons.every(lesson => 
        lesson.id === lessonId ? true : lesson.completed
      )
    }));
    
    setModules(updatedModules);
    
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      completedModules: updatedModules
        .filter(m => m.completed)
        .map(m => m.id)
        .filter(id => !prev.completedModules.includes(id))
    }));
    
    recordAttendance(lessonId);
    
    toast({
      title: "Lesson Completed",
      description: "Great job! You've completed this lesson.",
    });
  };

  const recordAttendance = (lessonId, date = new Date()) => {
    const dateString = date.toISOString().split('T')[0];
    
    const existingRecordIndex = attendance.findIndex(
      record => record.date === dateString
    );
    
    if (existingRecordIndex >= 0) {
      const updatedAttendance = [...attendance];
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        present: true,
        lessonId
      };
      setAttendance(updatedAttendance);
    } else {
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

  const getCurrentAssessment = () => {
    if (!currentLesson) return null;
    return assessments.find(a => a.lessonId === currentLesson.id) || null;
  };

  const submitAssessment = (assessmentId, score) => {
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
    
    // If score is 80% or higher, mark lesson as completed and move to next lesson
    if (score >= 80 && currentLesson && currentLesson.hasAssessment) {
      markLessonCompleted(currentLesson.id);
      
      // Move to next lesson
      const nextLesson = getNextLesson();
      if (nextLesson) {
        setTimeout(() => {
          setCurrentLesson(nextLesson);
        }, 1500); // Delay to allow the user to see the success message
      }
    }
    
    closeSkipModal();
    
    toast({
      title: score >= 80 ? "Assessment Passed!" : "Assessment Failed",
      description: score >= 80 
        ? `Congratulations! You scored ${score}%. Moving to next lesson.` 
        : `You scored ${score}%. You need 80% to continue. Try again.`,
      variant: score >= 80 ? "default" : "destructive",
    });
  };
  
  const getNextLesson = () => {
    if (!currentModule || !currentLesson) return null;
    
    // Find current lesson index
    const currentLessonIndex = currentModule.lessons.findIndex(
      lesson => lesson.id === currentLesson.id
    );
    
    // If there's a next lesson in this module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      return currentModule.lessons[currentLessonIndex + 1];
    }
    
    // If this is the last lesson in the module, find the next module
    const currentModuleIndex = modules.findIndex(
      module => module.id === currentModule.id
    );
    
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0 && isModuleUnlocked(nextModule)) {
        return nextModule.lessons[0];
      }
    }
    
    return null;
  };
  
  const addNote = (content) => {
    if (!currentLesson) return;
    
    const newNote = {
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
  
  const updateNote = (noteId, content) => {
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
  
  const deleteNote = (noteId) => {
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
  
  const toggleBookmark = (lessonId) => {
    setProgress(prev => {
      const isCurrentlyBookmarked = prev.bookmarks.includes(lessonId);
      
      if (isCurrentlyBookmarked) {
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
  
  const isBookmarked = (lessonId) => {
    return progress.bookmarks.includes(lessonId);
  };
  
  const submitQuestion = (content) => {
    if (!currentLesson) return;
    
    const newQuestion = {
      id: `question-${Date.now()}`,
      lessonId: currentLesson.id,
      userId: "user-1", // In a real app, this would be the current user's ID
      userName: "You", // In a real app, this would be the current user's name
      content,
      createdAt: new Date().toISOString(),
      resolved: false,
      answers: [],
      upvotes: 0
    };
    
    setCourseQuestions(prev => [...prev, newQuestion]);
    
    toast({
      title: "Question Submitted",
      description: "Your question has been submitted. You'll be notified when it's answered.",
    });
  };
  
  const submitAnswer = (questionId, content) => {
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
  
  const submitDiscussion = (content) => {
    if (!currentLesson) return;
    
    const newDiscussion = {
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
  
  const submitDiscussionReply = (discussionId, content) => {
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
  
  const upvoteQuestion = (questionId) => {
    setCourseQuestions(prev => 
      prev.map(question => 
        question.id === questionId 
          ? { ...question, upvotes: (question.upvotes || 0) + 1 } 
          : question
      )
    );
  };
  
  const upvoteAnswer = (questionId, answerId) => {
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
  
  const upvoteDiscussion = (discussionId) => {
    setCourseDiscussions(prev => 
      prev.map(discussion => 
        discussion.id === discussionId 
          ? { ...discussion, upvotes: discussion.upvotes + 1 } 
          : discussion
      )
    );
  };
  
  const markInVideoQuestionAnswered = (questionId) => {
    // Mark the question as answered in the progress
    setProgress(prev => ({
      ...prev,
      answeredInVideoQuestions: [...prev.answeredInVideoQuestions, questionId]
    }));
    
    // Also update the lessons to mark the question as answered
    if (currentLesson && currentLesson.inVideoQuestions) {
      const updatedModules = modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === currentLesson.id 
            ? { 
                ...lesson, 
                inVideoQuestions: lesson.inVideoQuestions?.map(q => 
                  q.id === questionId ? { ...q, answered: true } : q
                )
              } 
            : lesson
        )
      }));
      
      setModules(updatedModules);
    }
  };
  
  const downloadCertificate = () => {
    const allLessonsCompleted = modules.flatMap(m => m.lessons).every(
      lesson => progress.completedLessons.includes(lesson.id)
    );
    
    if (allLessonsCompleted) {
      // In a real app, this would generate and download a certificate
      toast({
        title: "Certificate Generated",
        description: "Your certificate has been generated and is downloading now.",
      });
      
      // Mock download - in a real app, this would be a real file
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,This is a certificate for completing the course';
      link.download = `${courseMetadata.title.replace(/\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "Cannot Generate Certificate",
        description: "You need to complete all lessons to receive your certificate.",
        variant: "destructive",
      });
    }
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
    markInVideoQuestionAnswered,
    getNextLesson,
    downloadCertificate
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
