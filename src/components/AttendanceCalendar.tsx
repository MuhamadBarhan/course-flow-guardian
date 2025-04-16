
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayContent, DayContentProps } from 'react-day-picker';

const AttendanceCalendar: React.FC = () => {
  const { attendance } = useCourse();
  const [month, setMonth] = useState<Date>(new Date());
  
  // Calculate attendance statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => record.present).length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
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
        try {
          const attendanceDate = parseISO(a.date);
          return isSameDay(attendanceDate, date);
        } catch (error) {
          console.error("Invalid date in attendance record:", a.date);
          return false;
        }
      });
      
      let attendanceClass = "";
      
      if (record) {
        attendanceClass = record.present ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
      }
      
      if (isToday(date)) {
        attendanceClass += " ring-2 ring-offset-2 ring-primary";
      }
      
      return (
        <div className={cn("p-0 w-full h-full flex items-center justify-center", attendanceClass)}>
          <DayContent {...props} />
        </div>
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
          <span>Attendance</span>
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
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-200 mr-2"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-200 mr-2"></div>
              <span className="text-sm">Absent</span>
            </div>
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
