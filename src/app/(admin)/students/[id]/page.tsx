'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { StudentDetailContent } from '@/components/students/StudentDetailContent';
import { DetailPageSkeleton } from '@/components/shared/Skeletons';
import type { Student } from '@/types';

export default function StudentDetailPage() {
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchStudent = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await fetch(`/api/students/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setStudent(data.data);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current || !params.id) return;
    hasFetched.current = true;
    fetchStudent();
  }, [params.id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  return <StudentDetailContent student={student || undefined} onRefresh={() => fetchStudent(true)} />;
}