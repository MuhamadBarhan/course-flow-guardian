
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Assessment, Question } from '@/types/course';
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
import { CheckCircle, XCircle } from 'lucide-react';

const AssessmentModal: React.FC = () => {
  const { isSkipModalOpen, closeSkipModal, currentLesson, getCurrentAssessment, submitAssessment } = useCourse();
  const assessment = getCurrentAssessment();
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  if (!assessment || !currentLesson) {
    return null;
  }
  
  const handleAnswerChange = (questionId: string, selectedIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: selectedIndex
    });
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
    closeSkipModal();
  };
  
  const isAllQuestionsAnswered = assessment.questions.every(q => answers[q.id] !== undefined);
  
  return (
    <Dialog open={isSkipModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{assessment.title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Complete this assessment to continue with the course.
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
            <div className={`p-4 mb-4 rounded-md ${score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-bold">Your score: {score}%</p>
              <p>{score >= 70 ? 'Congratulations! You passed the assessment.' : 'You did not pass. Please try again.'}</p>
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
              className="bg-course-primary hover:bg-course-primary-dark"
            >
              {score >= 70 ? 'Continue' : 'Try Again'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
