import React, { useState } from "react";
import { CourseProvider } from "../../context/CourseContext";
import VideoPlayer from "../../components/VideoPlayer";
import ModuleList from "../../components/ModuleList";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import AssessmentModal from "../../components/AssessmentModal";
import AITutor from "../../components/AITutor";
import { useCourse } from "../../context/CourseContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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
  Award,
  Bookmark,
  CheckSquare,
  Star,
  ThumbsUp
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import ResourceCategorized from "../../components/ResourceCategorized";
import LearningObjectives from "../../components/LearningObjectives";
import DiscussionSection from "../../components/DiscussionSection";
import { Textarea } from "../../components/ui/textarea";
import { Note } from "../../types/course";

const NotesPanel = () => {
  const { currentLesson, isNotesOpen, progress, addNote, updateNote, deleteNote } = useCourse();
  const [noteContent, setNoteContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentEditingNote, setCurrentEditingNote] = useState(null);
  
  if (!isNotesOpen) return null;
  
  const lessonNotes = currentLesson 
    ? progress.notes.filter(note => note.lessonId === currentLesson.id)
    : [];
  
  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote(noteContent);
    setNoteContent('');
  };
  
  const handleUpdateNote = (noteId) => {
    if (!noteContent.trim()) return;
    updateNote(noteId, noteContent);
    setNoteContent('');
    setEditing(false);
    setCurrentEditingNote(null);
  };
  
  const startEditing = (note) => {
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
            <Textarea
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

const QuestionSection = () => {
  const { currentLesson, questions, submitQuestion, submitAnswer, upvoteQuestion, upvoteAnswer } = useCourse();
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  
  if (!currentLesson) return null;
  
  const lessonQuestions = questions.filter(q => q.lessonId === currentLesson.id);
  
  const handleSubmitQuestion = () => {
    if (newQuestionText.trim()) {
      submitQuestion(newQuestionText);
      setNewQuestionText('');
      setShowNewQuestion(false);
    }
  };
  
  const handleSubmitAnswer = (questionId) => {
    if (answerText.trim()) {
      submitAnswer(questionId, answerText);
      setAnswerText('');
      setReplyingToId(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <MessageSquare size={18} className="mr-2" />
          Questions & Answers
        </h3>
        <Button 
          size="sm" 
          onClick={() => setShowNewQuestion(!showNewQuestion)}
        >
          Ask a Question
        </Button>
      </div>
      
      {showNewQuestion && (
        <Card className="p-4">
          <Textarea
            placeholder="What's your question about this lesson?"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewQuestion(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitQuestion} disabled={!newQuestionText.trim()}>
              Submit Question
            </Button>
          </div>
        </Card>
      )}
      
      {lessonQuestions.length === 0 ? (
        <p className="text-sm text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          No questions for this lesson yet. Ask a question to get help from instructors and peers.
        </p>
      ) : (
        <div className="space-y-3">
          {lessonQuestions.map(question => (
            <Card key={question.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <Badge variant={question.resolved ? "default" : "outline"}>
                      {question.resolved ? "Resolved" : "Open"}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{question.userName}</span>
                        <span>•</span>
                        <span>{format(parseISO(question.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      
                      <button 
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => upvoteQuestion(question.id)}
                      >
                        <ThumbsUp size={14} className="mr-1" />
                        <span>{question.upvotes}</span>
                      </button>
                    </div>
                    
                    <p className="mt-1">{question.content}</p>
                    
                    <div className="mt-3 space-y-3">
                      {question.answers && question.answers.map(answer => (
                        <div 
                          key={answer.id} 
                          className={cn(
                            "p-3 rounded-md",
                            answer.isInstructor 
                              ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800" 
                              : "bg-gray-50 dark:bg-gray-800"
                          )}
                        >
                          <div className="flex items-center justify-between">
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
                            
                            <button 
                              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                              onClick={() => upvoteAnswer(question.id, answer.id)}
                            >
                              <ThumbsUp size={14} className="mr-1" />
                              <span>{answer.upvotes}</span>
                            </button>
                          </div>
                          <p className="mt-1 text-sm">{answer.content}</p>
                        </div>
                      ))}
                      
                      {replyingToId === question.id ? (
                        <div className="mt-2 space-y-2">
                          <Textarea
                            placeholder="Write your answer..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="text-sm min-h-[80px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setReplyingToId(null);
                                setAnswerText('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleSubmitAnswer(question.id)}
                              disabled={!answerText.trim()}
                            >
                              Post Answer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setReplyingToId(question.id)}
                        >
                          Answer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseContent = () => {
  const { 
    modules: coursesModules, 
    currentLesson, 
    currentModule, 
    assessments, 
    courseMetadata,
    progress,
    discussions,
    questions,
    isResourcesOpen,
    isNotesOpen,
    toggleBookmark,
    isBookmarked,
    downloadCertificate
  } = useCourse();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav />
      
      <div className="flex flex-col md:flex-row gap-6">
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
                <div>
                  <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    {currentLesson.completed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center">
                        <CheckSquare size={12} className="mr-1" />
                        Completed
                      </Badge>
                    )}
                    {currentLesson.hasAssessment && (
                      <Badge className="bg-primary/20 text-primary">
                        Assessment Available
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center p-1 h-auto"
                      onClick={() => toggleBookmark(currentLesson.id)}
                    >
                      <Bookmark 
                        size={16} 
                        className={cn(
                          isBookmarked(currentLesson.id) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-400 hover:text-yellow-400"
                        )} 
                      />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  {Math.floor(currentLesson.duration / 60)} min
                </div>
              </div>
            </div>
          )}
          
          <VideoPlayer />
          
          {currentLesson && currentLesson.description && (
            <LearningObjectives />
          )}
          
          {isResourcesOpen && <ResourceCategorized />}
          {isNotesOpen && <NotesPanel />}
          
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules">
                <TabsList className="grid grid-cols-3 sm:grid-cols-5 mb-4">
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
                      A passing score of 80% or higher is required to mark a lesson as complete and move to the next lesson.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assessments.map(assessment => {
                        const result = progress.assessmentResults[assessment.id];
                        
                        return (
                          <Card key={assessment.id} className="overflow-hidden">
                            <div className={`h-1 ${result?.completed ? (result.score >= 80 ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'}`}></div>
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
                                      result.score >= 80 
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
                                  width: `${progress.completedLessons.length / coursesModules.flatMap(m => m.lessons).length * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-right mt-1">
                              {progress.completedLessons.length}/{coursesModules.flatMap(m => m.lessons).length} lessons
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
                            disabled={progress.completedLessons.length < coursesModules.flatMap(m => m.lessons).length}
                            onClick={downloadCertificate}
                          >
                            {progress.completedLessons.length < coursesModules.flatMap(m => m.lessons).length
                              ? `${coursesModules.flatMap(m => m.lessons).length - progress.completedLessons.length} lessons left`
                              : "Download Certificate"
                            }
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="discussions">
                  <DiscussionSection />
                </TabsContent>
                
                <TabsContent value="qa">
                  <QuestionSection />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
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

const CoursePage = () => {
  return (
    <CourseProvider>
      <CourseContent />
    </CourseProvider>
  );
};

export default CoursePage;
