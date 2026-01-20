'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Pencil, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { ROUTE } from '@/data/router';
import type { Student } from '@/types';
import { NotFoundState } from '@/components/shared/NotFoundState';
import { EditStudentDialog } from '@/components/dialogs/EditStudentDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StudentDetailContentProps {
  student: Student | undefined;
  onRefresh?: () => void;
}

export function StudentDetailContent({ student, onRefresh }: StudentDetailContentProps) {
  const router = useRouter();
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!student) {
    return <NotFoundState type="student" />;
  }

  const handleEditStudent = async (data: Partial<Student>) => {
    try {
      await fetch(`/api/students/${student.student_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      onRefresh?.();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/students/${student.student_id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        router.push(ROUTE.STUDENTS);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.push(ROUTE.STUDENTS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{student.child_name}</h1>
            <p className="text-sm text-muted-foreground">{student.parent_name} • {student.phone}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Actions
              <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => window.open(`tel:${student.phone}`, '_self')}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditStudentOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="shadow-none border overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Student Information</h3>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground w-1/3">Child Name</TableCell>
                <TableCell className="py-3 px-4">{student.child_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Age</TableCell>
                <TableCell className="py-3 px-4">{student.child_age} years</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Parent Name</TableCell>
                <TableCell className="py-3 px-4">{student.parent_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Phone</TableCell>
                <TableCell className="py-3 px-4">{student.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Location</TableCell>
                <TableCell className="py-3 px-4">{student.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Student ID</TableCell>
                <TableCell className="py-3 px-4">{student.student_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3 px-4 font-medium text-muted-foreground">Joined Date</TableCell>
                <TableCell className="py-3 px-4">{format(parseISO(student.joined_date), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditStudentDialog
        open={editStudentOpen}
        onOpenChange={setEditStudentOpen}
        student={student}
        onSubmit={handleEditStudent}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{student.child_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}