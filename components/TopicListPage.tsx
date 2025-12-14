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
  onDeleteTopic?: (topicId: string) => void;
}

export const TopicListPage: React.FC<TopicListPageProps> = ({
  topics,
  language,
  quota,
  onCreateNewTopic,
  onTopicClick,
  onDeleteTopic,
}) => {
  const isZh = language === 'zh';

  // Sort topics by created_at descending (newest first)
  const sortedTopics = [...topics].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Starry Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1041px', top: '512px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1801px', top: '8px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1337px', top: '464px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '636px', top: '1170px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1401px', top: '109px' }} />
        <div className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white" style={{ left: '1305px', top: '78px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '180px', top: '699px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '1330px', top: '185px' }} />
        <div className="absolute w-[2px] h-[2px] rounded-full bg-white" style={{ left: '743px', top: '1072px' }} />
        <div className="absolute w-[1px] h-[1px] rounded-full bg-white" style={{ left: '113px', top: '407px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '1829px', top: '377px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '647px', top: '273px' }} />
        <div className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: '294px', top: '944px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1325px', top: '1053px' }} />
        <div className="absolute w-[4px] h-[4px] rounded-full bg-white" style={{ left: '1686px', top: '359px' }} />
      </div>

      <div className="w-full mx-auto relative z-10" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[24px] font-bold leading-[29px]" style={{ color: '#E2DBFF' }}>
            {isZh ? '我的人生命题' : 'My Life Topics'}
          </h1>
          {quota && (
            <div className="text-[16px] leading-[19px]" style={{ color: 'rgba(205, 191, 238, 0.5)' }}>
              {isZh ? '命题数量: ' : 'Topics: '}{quota.topic_quota_total - quota.topic_quota_remaining} / {quota.topic_quota_total}
            </div>
          )}
        </div>

        {/* Topics List - 严格按照设计规范 */}
        <div className="flex flex-col gap-4 w-full mb-8">
          {sortedTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-4 text-[16px]" style={{ color: 'rgb(143, 136, 171)' }}>
                {isZh ? '还没有创建任何命题' : 'No topics yet'}
              </p>
              <button
                onClick={onCreateNewTopic}
                className="px-8 py-4 rounded-[12px] text-[20px] font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'rgb(221, 132, 37)', color: '#000000' }}
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
                onDelete={onDeleteTopic ? () => onDeleteTopic(topic.id) : undefined}
              />
            ))
          )}
        </div>

        {/* Create New Topic Button */}
        {sortedTopics.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={onCreateNewTopic}
              className="px-8 py-4 rounded-[12px] text-[20px] font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'rgb(221, 132, 37)', color: '#000000', width: '228px', height: '56px' }}
            >
              {isZh ? '开启新命题' : 'Create New Topic'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
