'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { InteractionType } from '@/types';

interface AddInteractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  onSubmit: (data: { type: InteractionType; note: string; nextFollowup: Date | null }) => void;
}

const interactionTypes: { value: InteractionType; label: string }[] = [
  { value: 'call', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp Message' },
  { value: 'visit', label: 'Center Visit' },
  { value: 'free_session', label: 'Free Session' },
  { value: 'follow_up', label: 'Follow Up' },
];

export function AddInteractionDialog({ open, onOpenChange, leadName, onSubmit }: AddInteractionDialogProps) {
  const [type, setType] = useState<InteractionType>('call');
  const [note, setNote] = useState('');
  const [nextFollowup, setNextFollowup] = useState<Date | undefined>(undefined);

  const handleSubmit = () => {
    onSubmit({ type, note, nextFollowup: nextFollowup || null });
    setType('call');
    setNote('');
    setNextFollowup(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">Add Interaction</DialogTitle>
                <DialogDescription className="text-sm">
                  Log a new interaction with {leadName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Interaction Type</Label>
            <Select value={type} onValueChange={(value: InteractionType) => setType(value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {interactionTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="note"
              placeholder="What happened during this interaction?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-28 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Next Follow-up Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-11 justify-start text-left font-normal rounded-md',
                    !nextFollowup && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextFollowup ? format(nextFollowup, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={nextFollowup}
                  onSelect={setNextFollowup}
                  initialFocus
                  disabled={(date: Date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!note.trim()} className="h-10">
            Add Interaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}