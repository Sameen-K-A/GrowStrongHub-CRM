'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Student } from '@/types';

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onSubmit: (data: Partial<Student>) => void;
}

export function EditStudentDialog({ open, onOpenChange, student, onSubmit }: EditStudentDialogProps) {
  const [childName, setChildName] = useState(student.child_name);
  const [parentName, setParentName] = useState(student.parent_name);
  const [age, setAge] = useState(String(student.child_age));
  const [phone, setPhone] = useState(student.phone);
  const [location, setLocation] = useState(student.location);
  const [joinedDate, setJoinedDate] = useState<Date>(parseISO(student.joined_date));

  useEffect(() => {
    if (open) {
      setChildName(student.child_name);
      setParentName(student.parent_name);
      setAge(String(student.child_age));
      setPhone(student.phone);
      setLocation(student.location);
      setJoinedDate(parseISO(student.joined_date));
    }
  }, [open, student]);

  const handleSubmit = () => {
    onSubmit({
      child_name: childName,
      parent_name: parentName,
      child_age: parseInt(age) || 0,
      phone,
      location,
      joined_date: format(joinedDate, 'yyyy-MM-dd'),
    });
    onOpenChange(false);
  };

  const isValid = childName && parentName && phone;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">Edit Student</DialogTitle>
                <DialogDescription className="text-sm">
                  Update student information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childName">Child Name</Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentName">Parent Name</Label>
            <Input
              id="parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Joined Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-10 justify-start text-left font-normal rounded-md',
                    !joinedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {joinedDate ? format(joinedDate, 'MMM d, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={joinedDate}
                  onSelect={(date) => date && setJoinedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="h-10">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}