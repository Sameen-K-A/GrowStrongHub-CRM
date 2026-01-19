'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function AddStudentDialog({ open, onOpenChange, onSubmit }: AddStudentDialogProps) {
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [joinedDate, setJoinedDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    onSubmit({
      child_name: childName,
      parent_name: parentName,
      child_age: parseInt(age) || 0,
      phone,
      location,
      joined_date: format(joinedDate, 'yyyy-MM-dd'),
    });

    // Reset form
    setChildName('');
    setParentName('');
    setAge('');
    setPhone('');
    setLocation('');
    setJoinedDate(new Date());
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
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">Add New Student</DialogTitle>
                <DialogDescription className="text-sm">
                  Enroll a new student to the program
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
                placeholder="Child's Name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentName">Parent Name</Label>
            <Input
              id="parentName"
              placeholder="Parent's Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+91 00000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Area/Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2 w-full">
            <Label>Joined Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full rounded-md h-10 justify-start text-left font-normal',
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
            Add Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}