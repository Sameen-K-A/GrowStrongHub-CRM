'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { ROUTE } from '@/data/router';
import type { Student } from '@/types';

interface StudentDetailContentProps {
  student: Student | undefined;
}

export function StudentDetailContent({ student }: StudentDetailContentProps) {
  const router = useRouter();

  if (!student) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-none border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Student not found</p>
            <Button variant="outline" onClick={() => router.push(ROUTE.STUDENTS)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="flex gap-3">
          <Button>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          {student.lead_id && (
            <Button variant="outline" onClick={() => router.push(`/leads/${student.lead_id}`)}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Lead
            </Button>
          )}
        </div>
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
              {student.lead_id && (
                <TableRow>
                  <TableCell className="py-3 px-4 font-medium text-muted-foreground">Original Lead</TableCell>
                  <TableCell className="py-3 px-4">{student.lead_id}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}