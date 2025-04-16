
import React, { useRef, useEffect, useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Play, Pause, SkipForward, Volume2, VolumeX, BookOpen, FileText, MessageSquare } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { InVideoQuestion } from '@/types/course';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const VideoPlayer = () => {
  const { 
    currentLesson, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    setCurrentTime,
    openSkipModal,
    toggleResources,
    toggleNotes,
    toggleAITutor,
    isResourcesOpen,
    isNotesOpen,
    isAITutorOpen,
    markInVideoQuestionAnswered
  } = useCourse();
  
  const videoRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  
  // Check for in-video questions
  useEffect(() => {
    if (currentLesson?.inVideoQuestions && videoRef.current && isPlaying) {
      const currentQuestions = currentLesson.inVideoQuestions.filter(
        q => Math.abs(q.timeInSeconds - currentTime) < 0.5 && !q.answered
      );
      
      if (currentQuestions.length > 0) {
        setActiveQuestion(currentQuestions[0]);
        setShowQuestionDialog(true);
        togglePlay(); // Pause the video
      }
    }
  }, [currentTime, currentLesson, isPlaying]);
  
  // Detect tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSkipModalOpen) {
        // User switched tabs during assessment
        alert("Please don't switch tabs during the assessment!");
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSkipModalOpen]);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (videoRef.current && currentLesson) {
      // Reset current time when changing lessons
      setCurrentTime(0);
      setDuration(currentLesson.duration);
    }
  }, [currentLesson, setCurrentTime]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current && !seeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      setMuted(!muted);
      videoRef.current.muted = !muted;
    }
  };
  
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setSeeking(true);
    setCurrentTime(time);
  };
  
  const handleSeekEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
    setSeeking(false);
  };
  
  const handleSkip = () => {
    // If we're at least 80% through the video, complete it
    // Otherwise, show the assessment modal
    if (currentTime >= duration * 0.8) {
      if (videoRef.current) {
        videoRef.current.currentTime = duration;
      }
    } else {
      openSkipModal();
    }
  };
  
  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null && activeQuestion) {
      // Mark as answered and resume video
      markInVideoQuestionAnswered(activeQuestion.id);
      
      // Check if answer is correct and show feedback
      const isCorrect = selectedAnswer === activeQuestion.correctOptionIndex;
      
      // Show a message based on the answer
      alert(isCorrect ? "Correct!" : "Incorrect. The correct answer was: " + 
        activeQuestion.options[activeQuestion.correctOptionIndex]);
      
      // Close dialog and continue video
      setShowQuestionDialog(false);
      setActiveQuestion(null);
      setSelectedAnswer(null);
      togglePlay(); // Resume the video
    }
  };
  
  if (!currentLesson) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-white">No lesson selected</p>
      </div>
    );
  }
  
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        src={currentLesson.videoUrl}
        className="w-full aspect-video object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setCurrentTime(duration)}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
      />
      
      <div className="bg-gray-900 text-white p-4">
        <div className="progress-bar mb-2">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlay} 
              className="bg-primary hover:bg-primary/80 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={handleSkip} 
              className="text-sm flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <SkipForward size={16} />
              <span>Skip</span>
            </button>
            
            <div className="text-sm text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleResources} 
                className={isResourcesOpen ? "bg-primary/20" : ""}
              >
                <FileText size={16} className="mr-1" />
                Resources
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleNotes} 
                className={isNotesOpen ? "bg-primary/20" : ""}
              >
                <BookOpen size={16} className="mr-1" />
                Notes
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleAITutor} 
                className={isAITutorOpen ? "bg-primary/20" : ""}
              >
                <MessageSquare size={16} className="mr-1" />
                AI Tutor
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute}>
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          onMouseUp={handleSeekEnd}
          onTouchEnd={handleSeekEnd}
          className="w-full mt-4 hidden"
        />
      </div>
      
      {/* In-video question dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Quick Question</DialogTitle>
          </DialogHeader>
          
          {activeQuestion && (
            <div className="py-4">
              <p className="font-medium mb-4">{activeQuestion.questionText}</p>
              
              <RadioGroup
                value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              >
                {activeQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={handleAnswerSubmit} 
              disabled={selectedAnswer === null}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoPlayer;
