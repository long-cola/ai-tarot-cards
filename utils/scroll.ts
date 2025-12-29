export const getScrollContainer = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return document.getElementById('root');
};

const isScrollable = (element: HTMLElement | null) => {
  if (!element) return false;
  return element.scrollHeight - element.clientHeight > 1;
};

export const getScrollTop = (): number => {
  if (typeof window === 'undefined') return 0;

  const container = getScrollContainer();
  const containerTop = container?.scrollTop ?? 0;
  const windowTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  if (container && isScrollable(container)) {
    return Math.max(containerTop, windowTop);
  }

  return windowTop || containerTop;
};

export const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
  if (typeof window === 'undefined') return;

  const container = getScrollContainer();
  if (container) {
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({ top: 0, behavior });
    }
    container.scrollTop = 0;
  }

  window.scrollTo({ top: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};
