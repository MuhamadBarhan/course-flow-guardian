
import React, { useState, useEffect } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Assessment } from '@/types/course';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const AssessmentModal = () => {
  const { isSkipModalOpen, closeSkipModal, currentLesson, getCurrentAssessment, submitAssessment } = useCourse();
  const assessment = getCurrentAssessment();
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  
  useEffect(() => {
    // Reset state when the modal is opened
    if (isSkipModalOpen) {
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setTabSwitchWarnings(0);
    }
  }, [isSkipModalOpen]);
  
  useEffect(() => {
    if (!isSkipModalOpen) return;
    
    // Handle tab/window visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        setTabSwitchWarnings(prev => prev + 1);
        alert(`Warning: Switching tabs during the assessment is not allowed. Warning ${tabSwitchWarnings + 1}/3`);
        
        // Auto-submit after 3 warnings
        if (tabSwitchWarnings >= 2) {
          alert("You have switched tabs too many times. Your assessment will be submitted automatically.");
          handleAutoSubmit();
        }
      }
    };
    
    // Prevent copy/paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy and paste are not allowed during assessments.");
      return false;
    };
    
    // Prevent right-click
    const handleContextMenu = (e) => {
      if (!submitted) {
        e.preventDefault();
        alert("Right-clicking is disabled during the assessment.");
        return false;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isSkipModalOpen, submitted, tabSwitchWarnings]);
  
  if (!assessment || !currentLesson) {
    return null;
  }
  
  const handleAnswerChange = (questionId, selectedIndex) => {
    setAnswers({
      ...answers,
      [questionId]: selectedIndex
    });
  };
  
  const handleAutoSubmit = () => {
    // Calculate score with current answers
    const totalQuestions = assessment.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = assessment.questions
      .filter(q => answers[q.id] === q.correctOptionIndex)
      .length;
    
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    
    // Submit to context
    submitAssessment(assessment.id, calculatedScore);
  };
  
  const handleSubmit = () => {
    // Calculate score
    const totalQuestions = assessment.questions.length;
    const correctAnswers = assessment.questions.filter(
      q => answers[q.id] === q.correctOptionIndex
    ).length;
    
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    
    // Submit to context
    submitAssessment(assessment.id, calculatedScore);
  };
  
  const handleClose = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTabSwitchWarnings(0);
    closeSkipModal();
  };
  
  const isAllQuestionsAnswered = assessment.questions.every(q => answers[q.id] !== undefined);
  
  return (
    <Dialog open={isSkipModalOpen} onOpenChange={submitted ? handleClose : undefined}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => {
          if (!submitted) {
            e.preventDefault();
            alert("Please complete the assessment before closing.");
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{assessment.title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-amber-800 dark:text-amber-300">
              Do not switch tabs or copy/paste during this assessment. Anti-cheating measures are enabled.
            </span>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Complete this assessment to continue with the course. You need 80% to pass.
          </p>
          
          {assessment.questions.map((question, index) => (
            <div key={question.id} className="mb-6">
              <div className="flex items-start">
                <span className="mr-2 font-bold">{index + 1}.</span>
                <div>
                  <p className="font-medium mb-2">{question.text}</p>
                  <RadioGroup
                    value={answers[question.id]?.toString()}
                    onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                    onSelect={(e) => e.preventDefault()} // Prevent text selection
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                          {option}
                        </Label>
                        {submitted && (
                          optionIndex === question.correctOptionIndex ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : answers[question.id] === optionIndex ? (
                            <XCircle size={16} className="text-red-500" />
                          ) : null
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          ))}
          
          {submitted && (
            <div className={cn(
              "p-4 mb-4 rounded-md",
              score >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            )}>
              <p className="font-bold">Your score: {score}%</p>
              <p>{score >= 80 ? 'Congratulations! You passed the assessment.' : 'You did not pass. Please try again.'}</p>
              {score >= 80 && (
                <p className="mt-2 text-sm">You will now be moved to the next lesson.</p>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!isAllQuestionsAnswered}
              className="bg-course-primary hover:bg-course-primary-dark"
            >
              Submit
            </Button>
          ) : (
            <Button 
              onClick={handleClose}
              className={cn(
                "bg-course-primary hover:bg-course-primary-dark",
                score >= 80 ? "bg-green-600 hover:bg-green-700" : ""
              )}
            >
              {score >= 80 ? 'Continue' : 'Try Again'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
