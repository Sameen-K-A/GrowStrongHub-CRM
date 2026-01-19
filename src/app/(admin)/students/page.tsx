'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Student } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { StudentsTableSkeleton } from '@/components/shared/Skeletons';
import { AddStudentDialog } from '@/components/dialogs/AddStudentDialog';

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const hasFetched = useRef(false);

  const fetchStudents = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      if (data.success) setStudents(data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        student.child_name.toLowerCase().includes(searchLower) ||
        student.parent_name.toLowerCase().includes(searchLower) ||
        student.phone.includes(search);

      return matchesSearch;
    });
  }, [students, search]);

  const handleAddStudent = async (data: any) => {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      await fetchStudents(true); // Refresh with skeleton
    }
  };

  if (loading) {
    return <StudentsTableSkeleton />;
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Students"
          subtitle={`Showing ${filteredStudents.length} of ${students.length} students`}
        />
        <Button onClick={() => setIsAddStudentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card className="shadow-none border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-none border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground py-4 px-4 w-16 text-center">SL</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4">Child Name</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4">Parent Name</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4">Age</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4">Phone</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-base">No students found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => (
                  <TableRow
                    key={student.student_id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => router.push(`/students/${student.student_id}`)}
                  >
                    <TableCell className="py-4 px-4 text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className="font-medium text-foreground">{student.child_name}</span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {student.parent_name}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {student.child_age} yrs
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {student.phone}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {student.location}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddStudentDialog
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        onSubmit={handleAddStudent}
      />
    </div>
  );
}