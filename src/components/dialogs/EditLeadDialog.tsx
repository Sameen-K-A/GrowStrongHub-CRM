'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import type { Lead, LeadSource, LeadStatus } from '@/types';

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSubmit: (data: Partial<Lead>) => void;
}

const sourceOptions: { value: LeadSource; label: string }[] = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Friends', label: 'Friends' },
  { value: 'Direct', label: 'Direct' },
  { value: 'Park', label: 'Park' },
  { value: 'Beach', label: 'Beach' },
  { value: 'Mall', label: 'Mall' },
  { value: 'Referral', label: 'Referral' },
];

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' },
  { value: 'closed', label: 'Closed' },
];

export function EditLeadDialog({ open, onOpenChange, lead, onSubmit }: EditLeadDialogProps) {
  const [childName, setChildName] = useState(lead.child_name);
  const [parentName, setParentName] = useState(lead.parent_name);
  const [age, setAge] = useState(String(lead.child_age));
  const [phone, setPhone] = useState(lead.phone);
  const [location, setLocation] = useState(lead.location);
  const [source, setSource] = useState<LeadSource>(lead.lead_source);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [freeSession, setFreeSession] = useState<'yes' | 'no'>(lead.free_session);

  useEffect(() => {
    if (open) {
      setChildName(lead.child_name);
      setParentName(lead.parent_name);
      setAge(String(lead.child_age));
      setPhone(lead.phone);
      setLocation(lead.location);
      setSource(lead.lead_source);
      setStatus(lead.status);
      setFreeSession(lead.free_session);
    }
  }, [open, lead]);

  const handleSubmit = () => {
    onSubmit({
      child_name: childName,
      parent_name: parentName,
      child_age: parseInt(age) || 0,
      phone,
      location,
      lead_source: source,
      status,
      free_session: freeSession,
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
                <DialogTitle className="text-lg">Edit Lead</DialogTitle>
                <DialogDescription className="text-sm">
                  Update lead information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Select value={source} onValueChange={(value: LeadSource) => setSource(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: LeadStatus) => setStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeSession">Free Session</Label>
            <Select value={freeSession} onValueChange={(value: 'yes' | 'no') => setFreeSession(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Not Taken</SelectItem>
                <SelectItem value="yes">Completed</SelectItem>
              </SelectContent>
            </Select>
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