
import React from 'react';
import { useCourse } from '@/context/CourseContext';
import { Module, Lesson } from '@/types/course';
import { CheckCircle, Circle, PlayCircle, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatTime } from '@/lib/utils';

const ModuleList: React.FC = () => {
  const { 
    modules, 
    currentModule, 
    currentLesson, 
    setCurrentModule, 
    setCurrentLesson, 
    progress 
  } = useCourse();

  const handleLessonClick = (module: Module, lesson: Lesson) => {
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
        {modules.map((module) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start">
                  <div className="mt-1 mr-2">
                    {module.completed ? 
                      <CheckCircle size={18} className="text-green-500" /> : 
                      <Circle size={18} className="text-gray-400" />
                    }
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {module.lessons.length} lessons • 
                      {module.lessons.filter(l => isLessonCompleted(l.id)).length}/{module.lessons.length} completed
                    </p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-6 space-y-2 mt-2">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`module-item ${currentLesson?.id === lesson.id ? 'active' : ''}`}
                    onClick={() => handleLessonClick(module, lesson)}
                  >
                    <div className="mr-3">
                      {isLessonCompleted(lesson.id) ? 
                        <CheckCircle size={18} className="text-green-500" /> : 
                        currentLesson?.id === lesson.id ?
                          <PlayCircle size={18} className="text-course-primary" /> :
                          <Circle size={18} className="text-gray-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{lesson.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lesson.description}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {formatTime(lesson.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ModuleList;
