import { dummyStudents } from '@/data/students';
import { StudentDetailContent } from '@/components/students/StudentDetailContent';

export function generateStaticParams() {
  return dummyStudents.map((student) => ({
    id: student.student_id,
  }));
}

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  const student = dummyStudents.find((s) => s.student_id === id);

  return <StudentDetailContent student={student} />;
}