import React from 'react';
import { Button, Card } from './ui';

interface Topic {
  id: string;
  title: string;
  baseline_cards?: any[];
  baseline_reading?: string;
  created_at: string;
  event_count?: number;
}

interface TopicListPageProps {
  topics: Topic[];
  language: 'zh' | 'en';
  quota: {
    topic_quota_total: number;
    topic_quota_remaining: number;
  } | null;
  onCreateNewTopic: () => void;
  onTopicClick: (topicId: string) => void;
}

export const TopicListPage: React.FC<TopicListPageProps> = ({
  topics,
  language,
  quota,
  onCreateNewTopic,
  onTopicClick,
}) => {
  const isZh = language === 'zh';

  // Sort topics by created_at descending (newest first)
  const sortedTopics = [...topics].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-white">
            {isZh ? '我的人生命题' : 'My Life Topics'}
          </h1>
          {quota && (
            <div className="text-sm text-white/60">
              {isZh ? '命题数量' : 'Topics'}: {quota.topic_quota_total - quota.topic_quota_remaining} / {quota.topic_quota_total}
            </div>
          )}
        </div>

        {/* Topics List */}
        <div className="space-y-4 mb-8">
          {sortedTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">
                {isZh ? '还没有创建任何命题' : 'No topics yet'}
              </p>
              <Button variant="primary" size="md" onClick={onCreateNewTopic}>
                {isZh ? '创建第一个命题' : 'Create First Topic'}
              </Button>
            </div>
          ) : (
            sortedTopics.map((topic) => (
              <Card
                key={topic.id}
                onClick={() => onTopicClick(topic.id)}
                className="p-6 cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-3">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-6 text-sm text-white/60">
                      <span>
                        {isZh ? '事件数' : 'Events'}: {topic.event_count || 0}
                      </span>
                      <span>
                        {isZh ? '开始时间' : 'Created'}: {formatDate(topic.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-white/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Create New Topic Button */}
        {sortedTopics.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onCreateNewTopic}
            >
              {isZh ? '开启新命题' : 'Create New Topic'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
