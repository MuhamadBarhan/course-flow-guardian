
import React from 'react';
import { useCourse } from '@/context/CourseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Target } from 'lucide-react';

const LearningObjectives = () => {
  const { currentLesson } = useCourse();
  
  if (!currentLesson || !currentLesson.learningObjectives || currentLesson.learningObjectives.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Target size={18} className="mr-2 text-primary" />
          Learning Objectives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {currentLesson.learningObjectives.map((objective, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 size={16} className="mr-2 mt-1 text-green-500" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LearningObjectives;
