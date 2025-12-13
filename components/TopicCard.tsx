import React from 'react';

interface TopicCardProps {
  title: string;
  eventCount: number;
  createdAt: string;
  language: 'zh' | 'en';
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  eventCount,
  createdAt,
  language,
  onClick,
}) => {
  const isZh = language === 'zh';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div
      onClick={onClick}
      className="w-full h-[150px] flex flex-col p-6 gap-2.5 bg-[#3A3757] border border-[#443E71] rounded-2xl cursor-pointer hover:bg-[#443E71] transition-colors"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <h3 className="text-[18px] font-medium text-white leading-[27px]">
        {title}
      </h3>

      {/* Info Row */}
      <div className="flex items-center gap-6 text-[14px] text-white/60 leading-[21px]">
        <span>
          {isZh ? '事件数' : 'Events'}: {eventCount}
        </span>
        <span>
          {isZh ? '开始时间' : 'Created'}: {formatDate(createdAt)}
        </span>
      </div>

      {/* Arrow Icon - positioned at bottom right */}
      <div className="flex-1 flex items-end justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white/40"
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
  );
};
