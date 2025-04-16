
import React, { useState } from 'react';
import { useCourse } from '@/context/CourseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { MessageSquare, ThumbsUp, Send, Reply, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const DiscussionSection = () => {
  const { currentLesson, discussions, submitDiscussion, submitDiscussionReply, upvoteDiscussion } = useCourse();
  const [newDiscussionText, setNewDiscussionText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  
  if (!currentLesson) return null;
  
  const lessonDiscussions = discussions.filter(d => d.lessonId === currentLesson.id);
  
  const handleSubmitDiscussion = () => {
    if (newDiscussionText.trim()) {
      submitDiscussion(newDiscussionText);
      setNewDiscussionText('');
      setShowNewDiscussion(false);
    }
  };
  
  const handleSubmitReply = (discussionId) => {
    if (replyText.trim()) {
      submitDiscussionReply(discussionId, replyText);
      setReplyText('');
      setReplyingToId(null);
    }
  };
  
  const handleUpvote = (discussionId) => {
    upvoteDiscussion(discussionId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <MessageSquare size={18} className="mr-2" />
          Discussion Forums
        </h3>
        <Button 
          size="sm" 
          onClick={() => setShowNewDiscussion(!showNewDiscussion)}
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Start Discussion
        </Button>
      </div>
      
      {showNewDiscussion && (
        <Card className="p-4">
          <Textarea
            placeholder="Share your thoughts or questions about this lesson..."
            value={newDiscussionText}
            onChange={(e) => setNewDiscussionText(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewDiscussion(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitDiscussion} disabled={!newDiscussionText.trim()}>
              Post Discussion
            </Button>
          </div>
        </Card>
      )}
      
      {lessonDiscussions.length === 0 ? (
        <p className="text-sm text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          No discussions for this lesson yet. Start a new discussion to connect with peers.
        </p>
      ) : (
        <div className="space-y-3">
          {lessonDiscussions.map(discussion => (
            <Card key={discussion.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <button 
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => handleUpvote(discussion.id)}
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <span className="text-sm font-medium">{discussion.upvotes}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <span className="font-medium">{discussion.userName}</span>
                      <span>•</span>
                      <span>{format(parseISO(discussion.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <p className="mt-1">{discussion.content}</p>
                    
                    <div className="mt-3 space-y-3">
                      {discussion.replies.map(reply => (
                        <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{reply.userName}</span>
                              <span>•</span>
                              <span>{format(parseISO(reply.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <button 
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex items-center"
                              >
                                <ThumbsUp size={12} className="mr-1" />
                                {reply.upvotes}
                              </button>
                            </div>
                          </div>
                          <p className="mt-1 text-sm">{reply.content}</p>
                        </div>
                      ))}
                      
                      {replyingToId === discussion.id ? (
                        <div className="mt-2 space-y-2">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="text-sm min-h-[80px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setReplyingToId(null);
                                setReplyText('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleSubmitReply(discussion.id)}
                              disabled={!replyText.trim()}
                            >
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => setReplyingToId(discussion.id)}
                        >
                          <Reply size={14} className="mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
