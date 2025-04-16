
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Video, CheckSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-course-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Course Flow Guardian</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Track your course progress, manage attendance, and never miss an important lesson.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">The Smart Way to Learn</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform helps you stay on track with your learning journey by monitoring 
            attendance, providing assessments, and tracking progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-course-primary bg-opacity-10 rounded-full p-4 mb-4">
              <Video className="h-8 w-8 text-course-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Lessons</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Engaging video content with interactive controls and progress tracking
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-course-primary bg-opacity-10 rounded-full p-4 mb-4">
              <BookOpen className="h-8 w-8 text-course-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Course Modules</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Organized learning paths with clearly defined objectives and milestones
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-course-primary bg-opacity-10 rounded-full p-4 mb-4">
              <CheckSquare className="h-8 w-8 text-course-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Assessments</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Regular quizzes and tests to reinforce learning and measure progress
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="bg-course-primary bg-opacity-10 rounded-full p-4 mb-4">
              <Calendar className="h-8 w-8 text-course-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visual attendance calendar that helps you maintain consistent learning habits
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/course')} 
            className="bg-course-primary hover:bg-course-primary-dark text-lg px-8 py-4 h-auto"
          >
            Start Learning Now
          </Button>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 Course Flow Guardian. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
