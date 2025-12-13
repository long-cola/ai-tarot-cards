import React from 'react';
import { TopicCard } from './TopicCard';

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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="w-full max-w-[800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[24px] font-medium text-white">
            {isZh ? '我的人生命题' : 'My Life Topics'}
          </h1>
          {quota && (
            <div className="text-[14px] text-white/60">
              {isZh ? '命题数量' : 'Topics'}: {quota.topic_quota_total - quota.topic_quota_remaining} / {quota.topic_quota_total}
            </div>
          )}
        </div>

        {/* Topics List - 严格按照设计规范 */}
        <div className="flex flex-col gap-4 w-full mb-8">
          {sortedTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4 text-[16px]">
                {isZh ? '还没有创建任何命题' : 'No topics yet'}
              </p>
              <button
                onClick={onCreateNewTopic}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors text-[16px]"
              >
                {isZh ? '创建第一个命题' : 'Create First Topic'}
              </button>
            </div>
          ) : (
            sortedTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                title={topic.title}
                eventCount={topic.event_count || 0}
                createdAt={topic.created_at}
                language={language}
                onClick={() => onTopicClick(topic.id)}
              />
            ))
          )}
        </div>

        {/* Create New Topic Button */}
        {sortedTopics.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={onCreateNewTopic}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors text-[16px]"
            >
              {isZh ? '开启新命题' : 'Create New Topic'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
