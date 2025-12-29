import React from 'react';
import { defaultSchema } from 'rehype-sanitize';

export const markdownSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'br',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
};

export const normalizeMarkdown = (text: string) => {
  if (!text) return '';

  const trimmed = text.trimStart();
  let cleaned = trimmed;

  if (trimmed.startsWith('```markdown\n') || trimmed.startsWith('```md\n') || trimmed.startsWith('```\n')) {
    cleaned = trimmed.replace(/^```(?:markdown|md)?\n/, '');
    cleaned = cleaned.replace(/\n```\s*$/, '');
  }

  return cleaned.replace(/<br\s*\/?>/gi, '<br />');
};

export const markdownComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-[28px] sm:leading-[30px] md:leading-[32px] tracking-[0.5px] mb-3 md:mb-4 text-[rgba(253,230,138,0.95)]">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[18px] sm:text-[19px] md:text-[20px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] tracking-[0.5px] mb-3 md:mb-4 text-[rgba(253,230,138,0.9)]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[13px] sm:text-[13.5px] md:text-[14px] font-semibold leading-[20px] md:leading-[22px] mb-2 text-[#FCD34D]">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-outside pl-5 space-y-1.5 md:space-y-2 text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px] my-3 md:my-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-outside pl-5 space-y-1.5 md:space-y-2 text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px] my-3 md:my-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-[20px] md:leading-[22px] [&>p]:m-0 [&>p]:inline">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-[#FCD34D] font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-[#E8D6FF] italic">{children}</em>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-[20px] md:leading-[22px] text-[#A38FFF] break-words mb-3 md:mb-4 text-[13px] sm:text-[13.5px] md:text-[14px] font-semibold">{children}</p>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-[#9D7FF5] pl-4 py-2 my-4 text-[#B8A5E0] italic">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-[rgba(189,161,255,0.15)] px-2 py-1 rounded text-[#E8D6FF] text-[13px]">
      {children}
    </code>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-x-auto my-4">
      <table className="w-full border-collapse text-left text-[#A38FFF] text-[13px] md:text-[14px] leading-[20px] md:leading-[22px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-white/5">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="divide-y divide-white/10">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="align-top">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2 text-[#FCD34D] font-semibold border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-2 align-top break-words whitespace-pre-line">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-6 border-[rgba(189,161,255,0.2)]" />
  ),
};
