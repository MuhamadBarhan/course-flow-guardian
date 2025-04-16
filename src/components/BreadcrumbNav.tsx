
import React from 'react';
import { useCourse } from '@/context/CourseContext';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

const BreadcrumbNav = () => {
  const { currentModule, currentLesson, courseMetadata } = useCourse();
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home size={16} className="mr-1" />
            <span className="sm:inline hidden">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink href="/course">
            {courseMetadata.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {currentModule && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {currentModule.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        
        {currentLesson && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLesson.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
