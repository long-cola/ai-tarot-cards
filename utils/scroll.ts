export const getScrollContainer = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return document.getElementById('root');
};

export const getScrollTop = (): number => {
  const container = getScrollContainer();
  if (container) return container.scrollTop;
  if (typeof window === 'undefined') return 0;
  return window.pageYOffset || document.documentElement.scrollTop;
};

export const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
  const container = getScrollContainer();
  if (container) {
    container.scrollTo({ top: 0, behavior });
    return;
  }
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior });
};
