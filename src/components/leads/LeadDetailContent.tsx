'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Plus, Pencil, MessageSquare, MapPin, Calendar, PhoneCall, UserCheck, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ROUTE } from '@/data/router';
import type { InteractionType, Lead } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { NotFoundState } from '@/components/shared/NotFoundState';
import { AddInteractionDialog } from '@/components/dialogs/AddInteractionDialog';
import { EditLeadDialog } from '@/components/dialogs/EditLeadDialog';
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

interface LeadDetailContentProps {
  lead: Lead | undefined;
  onRefresh?: () => void;
}

export function LeadDetailContent({ lead, onRefresh }: LeadDetailContentProps) {
  const router = useRouter();
  const [addInteractionOpen, setAddInteractionOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!lead) {
    return <NotFoundState type="lead" />;
  }

  const sortedLogs = [...lead.logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddInteraction = async (data: {
    type: InteractionType;
    note: string;
    nextFollowup: Date | null
  }) => {
    try {
      await fetch(`/api/leads/${lead.lead_id}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          note: data.note,
          next_followup: data.nextFollowup ? format(data.nextFollowup, 'yyyy-MM-dd') : null,
        }),
      });
      onRefresh?.();
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const handleEditLead = async (data: Partial<Lead>) => {
    try {
      await fetch(`/api/leads/${lead.lead_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      onRefresh?.();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/leads/${lead.lead_id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        router.push(ROUTE.LEADS);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const iconConfig: Record<string, { icon: typeof Phone; bg: string; color: string }> = {
    call: { icon: PhoneCall, bg: 'bg-blue-100', color: 'text-blue-600' },
    whatsapp: { icon: MessageSquare, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    visit: { icon: MapPin, bg: 'bg-purple-100', color: 'text-purple-600' },
    free_session: { icon: UserCheck, bg: 'bg-amber-100', color: 'text-amber-600' },
    follow_up: { icon: Calendar, bg: 'bg-orange-100', color: 'text-orange-600' },
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.push(ROUTE.LEADS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{lead.child_name}</h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-sm text-muted-foreground">{lead.parent_name} • {lead.phone}</p>
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
            <DropdownMenuItem onClick={() => window.open(`tel:${lead.phone}`, '_self')}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAddInteractionOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Interaction
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditLeadOpen(true)}>
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

      <div className="grid gap-4 lg:grid-cols-2">

        <Card className="shadow-none border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Details</p>
              <span className="text-xs text-muted-foreground">Created {format(parseISO(lead.created_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Child Name</span>
                <span className="font-medium">{lead.child_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{lead.child_age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parent Name</span>
                <span className="font-medium">{lead.parent_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{lead.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{lead.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{lead.lead_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lead ID</span>
                <span className="font-medium">{lead.lead_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border">
          <CardContent className="p-4">
            <p className="font-semibold mb-3">Activity</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Follow-up</span>
                <span className={`font-medium ${lead.next_followup ? 'text-primary' : ''}`}>
                  {lead.next_followup ? format(parseISO(lead.next_followup), 'MMM d, yyyy') : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Session</span>
                <span className={`font-medium ${lead.free_session === 'yes' ? 'text-emerald-600' : ''}`}>
                  {lead.free_session === 'yes' ? 'Completed' : 'Not taken'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interactions</span>
                <span className="font-medium">{lead.logs.length}</span>
              </div>
              {lead.logs.length > 0 && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-muted-foreground mb-2">Last Interaction</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded capitalize">
                        {sortedLogs[0].type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(sortedLogs[0].date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{sortedLogs[0].note}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none border">
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">All Interactions</h3>
            <span className="text-xs text-muted-foreground">{sortedLogs.length} total</span>
          </div>
          {sortedLogs.length === 0 ? (
            <div className="flex items-center justify-center min-h-32 text-muted-foreground text-sm">
              No interactions recorded yet
            </div>
          ) : (
            <div className="p-4">
              {sortedLogs.map((log, index) => {
                const isLast = index === sortedLogs.length - 1;
                const config = iconConfig[log.type] || iconConfig.call;
                const Icon = config.icon;

                return (
                  <div key={`${log.date}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${config.bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 bg-border my-2" />}
                    </div>
                    <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">{log.type.replace('_', ' ')}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(log.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddInteractionDialog
        open={addInteractionOpen}
        onOpenChange={setAddInteractionOpen}
        leadName={lead.parent_name}
        onSubmit={handleAddInteraction}
      />

      <EditLeadDialog
        open={editLeadOpen}
        onOpenChange={setEditLeadOpen}
        lead={lead}
        onSubmit={handleEditLead}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{lead.child_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLead}
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