import type { Metadata } from 'next';
import TasksScreen from '@/screens/Tasks';

export const metadata: Metadata = { title: 'Bezra, My tasks' };

export default function Page() {
  return <TasksScreen />;
}
