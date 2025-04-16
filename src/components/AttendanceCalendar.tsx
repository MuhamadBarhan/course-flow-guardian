
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const AttendanceCalendar: React.FC = () => {
  const { attendance } = useCourse();
  const [month, setMonth] = useState<Date>(new Date());
  
  // Calculate attendance statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => record.present).length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  // Custom day rendering
  const renderDay = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const record = attendance.find(a => 
      isSameDay(parseISO(a.date), day)
    );
    
    let className = "calendar-day";
    
    if (record) {
      className += record.present ? " present" : " absent";
    }
    
    if (isToday(day)) {
      className += " today";
    }
    
    return (
      <div className={className}>
        {format(day, 'd')}
      </div>
    );
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
              <div className="w-4 h-4 rounded-full bg-attendance-present mr-2"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-attendance-absent mr-2"></div>
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
            Day: renderDay
          }}
          className="pointer-events-auto"
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
