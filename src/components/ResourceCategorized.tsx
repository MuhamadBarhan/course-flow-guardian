
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Link, BookOpen, Code, FileVideo, Download, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/types/course';

const ResourceCategorized = () => {
  const { currentLesson, isResourcesOpen } = useCourse();
  
  if (!isResourcesOpen || !currentLesson?.resourceLinks?.length) return null;
  
  // Group resources by type
  const externalLinks = currentLesson.resourceLinks.filter(r => r.type === 'link');
  const notes = currentLesson.resourceLinks.filter(r => r.type === 'note');
  const codes = currentLesson.resourceLinks.filter(r => r.type === 'code');
  const pdfs = currentLesson.resourceLinks.filter(r => r.type === 'pdf');
  const videos = currentLesson.resourceLinks.filter(r => r.type === 'video');
  const projects = currentLesson.resourceLinks.filter(r => r.type === 'project');
  const assets = currentLesson.resourceLinks.filter(r => r.type === 'asset');
  const downloadables = currentLesson.resourceLinks.filter(r => r.type === 'downloadable');
  
  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={18} className="text-red-500" />;
      case 'link': return <Link size={18} className="text-blue-500" />;
      case 'note': return <BookOpen size={18} className="text-yellow-500" />;
      case 'code': return <Code size={18} className="text-green-500" />;
      case 'video': return <FileVideo size={18} className="text-purple-500" />;
      case 'project': return <Code size={18} className="text-indigo-500" />;
      case 'asset': return <Package size={18} className="text-orange-500" />;
      case 'downloadable': return <Download size={18} className="text-teal-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };
  
  const ResourceList = ({ resources }) => (
    <div className="space-y-3">
      {resources.length === 0 ? (
        <p className="text-sm text-gray-500">No resources available in this category.</p>
      ) : (
        resources.map(resource => (
          <div key={resource.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
            <div className="mt-0.5">
              {getResourceIcon(resource.type)}
            </div>
            <div className="flex-1">
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center">
                {resource.title}
                {resource.type === 'downloadable' && (
                  <Download size={14} className="ml-2 text-gray-500" />
                )}
              </a>
              {resource.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText size={18} className="mr-2" />
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 grid grid-cols-4 sm:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="external">Links</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ResourceList resources={currentLesson.resourceLinks} />
          </TabsContent>
          
          <TabsContent value="external">
            <ResourceList resources={externalLinks} />
          </TabsContent>
          
          <TabsContent value="code">
            <ResourceList resources={codes} />
          </TabsContent>
          
          <TabsContent value="notes">
            <ResourceList resources={notes} />
          </TabsContent>
          
          <TabsContent value="projects">
            <ResourceList resources={projects} />
          </TabsContent>
          
          <TabsContent value="downloads">
            <ResourceList resources={[...pdfs, ...downloadables, ...assets]} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResourceCategorized;
