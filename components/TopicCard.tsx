import React from 'react';

interface TopicCardProps {
  title: string;
  eventCount: number;
  createdAt: string;
  language: 'zh' | 'en';
  onClick: () => void;
  onDelete?: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  eventCount,
  createdAt,
  language,
  onClick,
  onDelete,
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
      className="w-full min-h-[110px] sm:min-h-[125px] md:h-[137px] flex flex-col p-4 sm:p-5 md:p-6 rounded-[12px] md:rounded-[16px] cursor-pointer transition-colors border"
      style={{
        backgroundColor: 'rgba(40, 36, 70, 0.8)',
        borderColor: '#443E71',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(58, 55, 87, 0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(40, 36, 70, 0.8)';
      }}
    >
      {/* Title */}
      <div onClick={onClick} className="flex-1">
        <h3 className="text-[17px] sm:text-[18px] md:text-[20px] font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] mb-4 sm:mb-5 md:mb-6" style={{ color: '#E2DBFF' }}>
          {title}
        </h3>

        {/* Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 md:gap-12 text-[12px] sm:text-[13px] md:text-[14px] leading-[15px] sm:leading-[16px] md:leading-[17px]" style={{ color: '#8F88AB' }}>
          <span>
            {isZh ? '事件数：' : 'Events: '}{eventCount}
          </span>
          <span className="truncate">
            {isZh ? '开始时间：' : 'Created: '}{formatDate(createdAt)}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="sm:ml-auto hover:opacity-70 transition-opacity p-1"
              style={{ color: '#70648D' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
