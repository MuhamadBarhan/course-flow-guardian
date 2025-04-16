
import React from 'react';
import { CourseProvider } from '@/context/CourseContext';
import VideoPlayer from '@/components/VideoPlayer';
import ModuleList from '@/components/ModuleList';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AssessmentModal from '@/components/AssessmentModal';
import AITutor from '@/components/AITutor';
import { useCourse } from '@/context/CourseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  CalendarDays, 
  BookOpen, 
  ListChecks, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  Users, 
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ResourcesPanel: React.FC = () => {
  const { currentLesson, isResourcesOpen } = useCourse();
  
  if (!isResourcesOpen || !currentLesson?.resourceLinks?.length) return null;
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentLesson.resourceLinks?.map(resource => (
            <div key={resource.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
              <div className="mt-0.5">
                {resource.type === 'pdf' && <FileText size={18} className="text-red-500" />}
                {resource.type === 'link' && <FileText size={18} className="text-blue-500" />}
                {resource.type === 'note' && <BookOpen size={18} className="text-yellow-500" />}
                {resource.type === 'code' && <FileText size={18} className="text-green-500" />}
                {resource.type === 'video' && <FileText size={18} className="text-purple-500" />}
              </div>
              <div className="flex-1">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {resource.title}
                </a>
                {resource.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const NotesPanel: React.FC = () => {
  const { currentLesson, isNotesOpen, progress, addNote, updateNote, deleteNote, currentNote } = useCourse();
  const [noteContent, setNoteContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentEditingNote, setCurrentEditingNote] = useState<null | string>(null);
  
  if (!isNotesOpen) return null;
  
  const lessonNotes = currentLesson 
    ? progress.notes.filter(note => note.lessonId === currentLesson.id)
    : [];
  
  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote(noteContent);
    setNoteContent('');
  };
  
  const handleUpdateNote = (noteId: string) => {
    if (!noteContent.trim()) return;
    updateNote(noteId, noteContent);
    setNoteContent('');
    setEditing(false);
    setCurrentEditingNote(null);
  };
  
  const startEditing = (note: Note) => {
    setNoteContent(note.content);
    setEditing(true);
    setCurrentEditingNote(note.id);
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
        <CardDescription>
          Add personal notes for this lesson
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add a note about this lesson..."
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end">
              {editing ? (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNoteContent('');
                      setEditing(false);
                      setCurrentEditingNote(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => currentEditingNote && handleUpdateNote(currentEditingNote)}
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={handleAddNote}>
                  Add Note
                </Button>
              )}
            </div>
          </div>
          
          {lessonNotes.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium">Your Notes</h3>
              {lessonNotes.map((note) => (
                <div key={note.id} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm">{note.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(parseISO(note.updatedAt), 'MMM d, yyyy h:mm a')}
                    </span>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => startEditing(note)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CourseContent: React.FC = () => {
  const { 
    modules, // Add modules from context
    currentLesson, 
    currentModule, 
    assessments, 
    courseMetadata,
    progress,
    discussions,
    questions,
    isResourcesOpen,
    isNotesOpen
  } = useCourse();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Video and info */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {currentModule?.title || "Course Content"}
            </h1>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                <Calendar size={14} className="mr-1" />
                <span>
                  {courseMetadata.startDate && format(parseISO(courseMetadata.startDate), 'MMM d')} - 
                  {courseMetadata.endDate && format(parseISO(courseMetadata.endDate), 'MMM d, yyyy')}
                </span>
              </Badge>
              
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200">
                {courseMetadata.skillLevel.charAt(0).toUpperCase() + courseMetadata.skillLevel.slice(1)}
              </Badge>
            </div>
          </div>
          
          {currentLesson && (
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                {currentLesson.hasAssessment && (
                  <Badge className="bg-primary/20 text-primary">Assessment Available</Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{currentLesson.description}</p>
            </div>
          )}
          
          <VideoPlayer />
          
          {isResourcesOpen && <ResourcesPanel />}
          {isNotesOpen && <NotesPanel />}
          
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules">
                <TabsList className="grid grid-cols-5 mb-4">
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
                  <TabsTrigger value="discussions" className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>Discussions</span>
                  </TabsTrigger>
                  <TabsTrigger value="qa" className="flex items-center">
                    <MessageSquare size={16} className="mr-2" />
                    <span>Q&A</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">About This Course</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {courseMetadata.description}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                        <ul className="text-sm list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          {courseMetadata.prerequisites.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Target Audience</h4>
                        <ul className="text-sm list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          {courseMetadata.targetAudience.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Instructor</h4>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={courseMetadata.instructorImage} 
                          alt={courseMetadata.instructorName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h5 className="font-medium">{courseMetadata.instructorName}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {courseMetadata.instructorBio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="assessments">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Complete each lesson's assessment to progress through the course. 
                      A passing score of 70% or higher is required to mark a lesson as complete.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assessments.map(assessment => {
                        const result = progress.assessmentResults[assessment.id];
                        
                        return (
                          <Card key={assessment.id} className="overflow-hidden">
                            <div className={`h-1 ${result?.completed ? (result.score >= 70 ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'}`}></div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm">{assessment.title}</h4>
                                  <div className="flex items-center mt-1 space-x-2">
                                    <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                                      <Calendar size={12} />
                                      <span>Due {format(parseISO(assessment.dueDate), 'MMM d')}</span>
                                    </Badge>
                                    
                                    <span className="text-xs text-gray-500">
                                      {assessment.questions.length} questions
                                    </span>
                                  </div>
                                </div>
                                
                                {result?.completed && (
                                  <Badge 
                                    className={
                                      result.score >= 70 
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                    }
                                  >
                                    {result.score}%
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
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
                                  width: `${currentModule.lessons.filter(l => progress.completedLessons.includes(l.id)).length / currentModule.lessons.length * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">
                              {currentModule.lessons.filter(l => progress.completedLessons.includes(l.id)).length}/{currentModule.lessons.length} lessons
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Overall Progress</p>
                            <div className="progress-bar">
                              <div 
                                className="progress-bar-fill" 
                                style={{ 
                                  width: `${progress.completedLessons.length / modules.flatMap(m => m.lessons).length * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">
                              {progress.completedLessons.length}/{modules.flatMap(m => m.lessons).length} lessons
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {courseMetadata.certificateAvailable && (
                        <div className="mt-4 p-3 border border-dashed rounded-md flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Award size={24} className="text-yellow-500" />
                            <div>
                              <h4 className="font-medium">Course Certificate</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Complete all lessons to earn your certificate
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline"
                            disabled={progress.completedLessons.length < modules.flatMap(m => m.lessons).length}
                          >
                            {progress.completedLessons.length < modules.flatMap(m => m.lessons).length
                              ? `${modules.flatMap(m => m.lessons).length - progress.completedLessons.length} lessons left`
                              : "Download Certificate"
                            }
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="discussions">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Discussion Forums</h3>
                      <Button size="sm">Start New Discussion</Button>
                    </div>
                    
                    {currentLesson && discussions.filter(d => d.lessonId === currentLesson.id).length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        No discussions for this lesson yet. Start a new discussion to connect with peers.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {currentLesson && discussions
                          .filter(d => d.lessonId === currentLesson.id)
                          .map(discussion => (
                            <Card key={discussion.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex flex-col items-center">
                                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                      ▲
                                    </button>
                                    <span className="text-sm font-medium">{discussion.upvotes}</span>
                                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                      ▼
                                    </button>
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                                      <span>{discussion.userName}</span>
                                      <span>•</span>
                                      <span>{format(parseISO(discussion.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    
                                    <p className="mt-1">{discussion.content}</p>
                                    
                                    <div className="mt-3 space-y-3">
                                      {discussion.replies.map(reply => (
                                        <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                          <div className="flex items-center text-sm text-gray-500 space-x-2">
                                            <span>{reply.userName}</span>
                                            <span>•</span>
                                            <span>{format(parseISO(reply.createdAt), 'MMM d, yyyy')}</span>
                                          </div>
                                          <p className="mt-1 text-sm">{reply.content}</p>
                                        </div>
                                      ))}
                                      
                                      <Button variant="outline" size="sm">Reply</Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="qa">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Questions & Answers</h3>
                      <Button size="sm">Ask a Question</Button>
                    </div>
                    
                    {currentLesson && questions.filter(q => q.lessonId === currentLesson.id).length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        No questions for this lesson yet. Ask a question to get help from instructors and peers.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {currentLesson && questions
                          .filter(q => q.lessonId === currentLesson.id)
                          .map(question => (
                            <Card key={question.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div>
                                    <Badge variant={question.resolved ? "default" : "outline"}>
                                      {question.resolved ? "Resolved" : "Open"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                                      <span>{question.userName}</span>
                                      <span>•</span>
                                      <span>{format(parseISO(question.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    
                                    <p className="mt-1">{question.content}</p>
                                    
                                    <div className="mt-3 space-y-3">
                                      {question.answers.map(answer => (
                                        <div 
                                          key={answer.id} 
                                          className={cn(
                                            "p-3 rounded-md",
                                            answer.isInstructor 
                                              ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800" 
                                              : "bg-gray-50 dark:bg-gray-800"
                                          )}
                                        >
                                          <div className="flex items-center text-sm text-gray-500 space-x-2">
                                            <span>{answer.userName}</span>
                                            {answer.isInstructor && (
                                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                Instructor
                                              </Badge>
                                            )}
                                            <span>•</span>
                                            <span>{format(parseISO(answer.createdAt), 'MMM d, yyyy')}</span>
                                          </div>
                                          <p className="mt-1 text-sm">{answer.content}</p>
                                        </div>
                                      ))}
                                      
                                      <Button variant="outline" size="sm">Answer</Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    )}
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
      <AITutor />
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

// Import the React useState hook as it's used in the NotesPanel component
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Note } from '@/types/course';
