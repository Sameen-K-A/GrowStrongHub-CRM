'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dummyStudents } from '@/data/students';
import type { StudentStatus } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';

const statusOptions: { value: StudentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
];

export default function Students() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');

  const filteredStudents = useMemo(() => {
    return dummyStudents.filter((student) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        student.child_name.toLowerCase().includes(searchLower) ||
        student.parent_name.toLowerCase().includes(searchLower) ||
        student.phone.includes(search);

      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  const hasActiveFilters = search || statusFilter !== 'all';

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Students"
        subtitle={`Showing ${filteredStudents.length} of ${dummyStudents.length} students`}
      />

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

            <div className="flex gap-3 sm:contents">
              <Select
                value={statusFilter}
                onValueChange={(value: string) => setStatusFilter(value as StudentStatus | 'all')}
              >
                <SelectTrigger className="flex-1 sm:flex-none sm:w-[150px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground h-9 px-3"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
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
                <TableHead className="font-semibold text-foreground py-4 px-4 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-base">No students found</p>
                      {hasActiveFilters && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-2 text-primary"
                        >
                          Clear all filters
                        </Button>
                      )}
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
                    <TableCell className="py-4 px-4 text-center">
                      <StatusBadge status={student.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}