
import React from 'react';
import { useCourse } from '@/context/CourseContext';
import { Module, Lesson } from '@/types/course';
import { CheckCircle, Circle, PlayCircle, Clock, Lock, Calendar, BookOpen, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format, parseISO } from 'date-fns';
import { cn, formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ModuleList: React.FC = () => {
  const { 
    modules, 
    currentModule, 
    currentLesson, 
    setCurrentModule, 
    setCurrentLesson, 
    progress,
    isBookmarked,
    toggleBookmark,
    isLessonUnlocked,
    isModuleUnlocked
  } = useCourse();

  const handleLessonClick = (module: Module, lesson: Lesson) => {
    if (!isLessonUnlocked(lesson)) {
      return; // Don't allow selecting locked lessons
    }
    
    setCurrentModule(module);
    setCurrentLesson(lesson);
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Course Modules</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module) => {
          const moduleUnlocked = isModuleUnlocked(module);
          
          return (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger 
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2",
                  !moduleUnlocked && "opacity-60 cursor-not-allowed"
                )}
                disabled={!moduleUnlocked}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start">
                    <div className="mt-1 mr-2">
                      {module.completed ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : !moduleUnlocked ? (
                        <Lock size={18} className="text-gray-400" />
                      ) : (
                        <Circle size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{module.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {module.lessons.length} lessons • 
                          {module.lessons.filter(l => isLessonCompleted(l.id)).length}/{module.lessons.length} completed
                        </p>
                        
                        {!moduleUnlocked && (
                          <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Unlocks {format(parseISO(module.unlockDate), 'MMM d')}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              {moduleUnlocked && (
                <AccordionContent>
                  <div className="ml-6 space-y-2 mt-2">
                    {module.lessons.map((lesson) => {
                      const lessonUnlocked = isLessonUnlocked(lesson);
                      
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => lessonUnlocked && handleLessonClick(module, lesson)}
                          className={cn(
                            "module-item rounded-md",
                            currentLesson?.id === lesson.id ? 'active' : '',
                            !lessonUnlocked && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <div className="mr-3">
                            {isLessonCompleted(lesson.id) ? (
                              <CheckCircle size={18} className="text-green-500" />
                            ) : !lessonUnlocked ? (
                              <Lock size={18} className="text-gray-400" />
                            ) : currentLesson?.id === lesson.id ? (
                              <PlayCircle size={18} className="text-primary" />
                            ) : (
                              <Circle size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium">{lesson.title}</h4>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (lessonUnlocked) {
                                    toggleBookmark(lesson.id);
                                  }
                                }}
                                className={cn(
                                  "text-gray-400 hover:text-yellow-500",
                                  isBookmarked(lesson.id) && "text-yellow-500",
                                  !lessonUnlocked && "pointer-events-none"
                                )}
                              >
                                <BookOpen size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {lesson.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock size={14} className="mr-1" />
                                {formatTime(lesson.duration)}
                              </div>
                              
                              {lesson.hasAssessment && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                  Assessment
                                </Badge>
                              )}
                              
                              {lesson.resourceLinks && lesson.resourceLinks.length > 0 && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                                  <FileText size={12} />
                                  <span>{lesson.resourceLinks.length} Resources</span>
                                </Badge>
                              )}
                              
                              {!lessonUnlocked && (
                                <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                                  <Calendar size={12} />
                                  <span>Unlocks {format(parseISO(lesson.unlockDate), 'MMM d')}</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ModuleList;
