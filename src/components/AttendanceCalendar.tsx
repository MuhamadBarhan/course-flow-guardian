
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isToday, isSameDay, differenceInCalendarDays, addDays } from 'date-fns';
import { cn, safeParseISO, getModuleUnlockDate } from '@/lib/utils';
import { DayContent, DayContentProps } from 'react-day-picker';
import { CheckCircle, XCircle, Calendar as CalendarIcon, BookOpen, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AttendanceCalendar: React.FC = () => {
  const { attendance, assessments, courseMetadata, modules } = useCourse();
  const [month, setMonth] = useState<Date>(new Date());
  
  // Calculate attendance statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => record.present).length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  // Get course start and current day count
  const courseStartDate = safeParseISO(courseMetadata.startDate) || new Date();
  const today = new Date();
  const daysSinceCourseStart = differenceInCalendarDays(today, courseStartDate);
  
  // Custom day component for the calendar
  const CustomDay = (props: DayContentProps) => {
    const { date, ...dayProps } = props;
    
    // Ensure we have a valid date before trying to format it
    if (!date || isNaN(date.getTime())) {
      return <DayContent {...props} />;
    }
    
    try {
      const record = attendance.find(a => {
        // Ensure we have a valid date in the attendance record
        const attendanceDate = safeParseISO(a.date);
        return attendanceDate && isSameDay(attendanceDate, date);
      });
      
      // Find if there are any assessments due on this date
      const assessmentDue = assessments.find(a => {
        const dueDate = safeParseISO(a.dueDate);
        return dueDate && isSameDay(dueDate, date);
      });
      
      // Check if this is the course start or end date
      const isStartDate = courseMetadata?.startDate && 
        isSameDay(safeParseISO(courseMetadata.startDate) || new Date(), date);
      
      const isEndDate = courseMetadata?.endDate && 
        isSameDay(safeParseISO(courseMetadata.endDate) || new Date(), date);
      
      // Calculate if any module is supposed to unlock on this date
      const dayNumber = differenceInCalendarDays(date, courseStartDate);
      const moduleUnlockingToday = modules[dayNumber];
      
      let attendanceClass = "";
      let statusIcon = null;
      let tooltipContent = "";
      
      // Module unlock day styling
      if (moduleUnlockingToday && dayNumber >= 0 && dayNumber < modules.length) {
        attendanceClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
        tooltipContent = `Module unlocks: ${moduleUnlockingToday.title}`;
      }
      
      // Attendance record styling takes precedence
      if (record) {
        if (record.present) {
          attendanceClass = "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100";
          statusIcon = <CheckCircle size={12} className="absolute bottom-0 right-0 text-green-600" />;
          tooltipContent = "Present";
          
          if (record.lessonId) {
            // Find the lesson completed on this day
            const lessonModule = modules.find(m => 
              m.lessons.some(l => l.id === record.lessonId)
            );
            const lesson = lessonModule?.lessons.find(l => l.id === record.lessonId);
            
            if (lesson) {
              tooltipContent = `Present: Completed "${lesson.title}"`;
            }
          }
        } else {
          attendanceClass = "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100";
          statusIcon = <XCircle size={12} className="absolute bottom-0 right-0 text-red-600" />;
          tooltipContent = "Absent";
        }
      }
      
      // Assessment due styling
      if (assessmentDue) {
        tooltipContent = tooltipContent ? 
          `${tooltipContent} | Assessment due: ${assessmentDue.title}` : 
          `Assessment due: ${assessmentDue.title}`;
      }
      
      if (isStartDate) {
        attendanceClass = attendanceClass || "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
        tooltipContent = tooltipContent ? 
          `${tooltipContent} | Course start date` : 
          "Course start date";
      }
      
      if (isEndDate) {
        attendanceClass = attendanceClass || "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
        tooltipContent = tooltipContent ? 
          `${tooltipContent} | Course end date` : 
          "Course end date";
      }
      
      if (isToday(date)) {
        attendanceClass += " ring-2 ring-offset-1 ring-primary";
        tooltipContent = tooltipContent ? 
          `${tooltipContent} | Today` : 
          "Today";
      }
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("relative p-0 w-full h-full flex items-center justify-center", attendanceClass)}>
                <DayContent {...props} />
                {statusIcon}
              </div>
            </TooltipTrigger>
            {tooltipContent && (
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    } catch (error) {
      console.error("Error rendering day:", error);
      // Fallback to the default day content
      return <DayContent {...props} />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <CalendarIcon size={18} className="mr-2" />
            Attendance
          </span>
          <span 
            className={cn(
              "text-sm px-2 py-1 rounded-full",
              attendanceRate >= 80 ? "bg-green-100 text-green-800" :
              attendanceRate >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}
          >
            {attendanceRate}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-200 mr-1"></div>
              <span className="text-xs">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-200 mr-1"></div>
              <span className="text-xs">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
              <span className="text-xs">Module Unlock</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-200 mr-1"></div>
              <span className="text-xs">Course Start</span>
            </div>
          </div>
          
          <div className="text-center text-sm">
            <p>Course Day: {daysSinceCourseStart + 1}</p>
          </div>
        </div>
        
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={new Date()}
          components={{
            DayContent: CustomDay
          }}
          className="w-full"
          defaultMonth={new Date()}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
