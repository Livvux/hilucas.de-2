import { ReactNode } from 'react';

interface NoticeProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: ReactNode;
}

const styles = {
  info: 'bg-blue-50 border-blue-500 dark:bg-blue-950 dark:border-blue-400',
  warning: 'bg-amber-50 border-amber-500 dark:bg-amber-950 dark:border-amber-400',
  success: 'bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-400',
  error: 'bg-red-50 border-red-500 dark:bg-red-950 dark:border-red-400',
};

export function Notice({ type = 'info', children }: NoticeProps) {
  return (
    <aside className={`p-4 border-l-4 rounded-r-lg my-6 ${styles[type]}`}>
      <div className="[&>p]:m-0">{children}</div>
    </aside>
  );
}
