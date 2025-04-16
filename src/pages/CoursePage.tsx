
import React from 'react';
import { CourseProvider } from '@/context/CourseContext';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleList from '@/components/ModuleList';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AssessmentModal from '@/components/AssessmentModal';
import { useCourse } from '@/context/CourseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, CalendarDays, BookOpen, ListChecks } from 'lucide-react';

const CourseContent: React.FC = () => {
  const { currentLesson, currentModule } = useCourse();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Video and info */}
        <div className="w-full md:w-2/3 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentModule?.title || "Course Content"}
          </h1>
          
          {currentLesson && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{currentLesson.description}</p>
            </div>
          )}
          
          <VideoPlayer />
          
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="modules" className="flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    <span>Modules</span>
                  </TabsTrigger>
                  <TabsTrigger value="assessments" className="flex items-center">
                    <ListChecks size={16} className="mr-2" />
                    <span>Assessments</span>
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex items-center">
                    <GraduationCap size={16} className="mr-2" />
                    <span>Progress</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">About This Course</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This course covers all the essential aspects of web development from frontend to backend.
                      Each module builds on the previous one, creating a comprehensive learning journey.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="assessments">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Complete each lesson's assessment to progress through the course. 
                      A passing score of 70% or higher is required to mark a lesson as complete.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentModule?.lessons.map(lesson => (
                        <Card key={lesson.id} className="overflow-hidden">
                          <div className={`h-1 ${lesson.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm">{lesson.title}</h4>
                            <p className="text-xs text-gray-500">{lesson.hasAssessment ? 'Has assessment' : 'No assessment'}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="progress">
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Your Progress</h3>
                      
                      {currentModule && (
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Current Module</p>
                            <div className="progress-bar">
                              <div 
                                className="progress-bar-fill" 
                                style={{ 
                                  width: `${currentModule.lessons.filter(l => l.completed).length / currentModule.lessons.length * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">
                              {currentModule.lessons.filter(l => l.completed).length}/{currentModule.lessons.length} lessons
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Overall Progress</p>
                            <div className="progress-bar">
                              <div 
                                className="progress-bar-fill" 
                                style={{ 
                                  width: `${currentModule.lessons.filter(l => l.completed).length / currentModule.lessons.length * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Modules & Attendance */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="hidden md:block">
            <div className="flex items-center mb-4">
              <CalendarDays size={20} className="mr-2" />
              <h2 className="text-xl font-bold">My Learning</h2>
            </div>
          </div>
          
          <ModuleList />
          <AttendanceCalendar />
        </div>
      </div>
      
      <AssessmentModal />
    </div>
  );
};

const CoursePage: React.FC = () => {
  return (
    <CourseProvider>
      <CourseContent />
    </CourseProvider>
  );
};

export default CoursePage;
