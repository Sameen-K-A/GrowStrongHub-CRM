'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Lead, LeadStatus, LeadSource } from '@/types';
import { format, parseISO } from 'date-fns';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LeadsTableSkeleton } from '@/components/shared/Skeletons';
import { AddLeadDialog } from '@/components/dialogs/AddLeadDialog';

const statusOptions: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' },
  { value: 'closed', label: 'Closed' },
];

const sourceOptions: { value: LeadSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Friends', label: 'Friends' },
  { value: 'Direct', label: 'Direct' },
  { value: 'Park', label: 'Park' },
  { value: 'Beach', label: 'Beach' },
  { value: 'Mall', label: 'Mall' },
  { value: 'Referral', label: 'Referral' },
];

export default function Leads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const hasFetched = useRef(false);

  const fetchLeads = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      if (data.success) setLeads(data.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        lead.child_name.toLowerCase().includes(searchLower) ||
        lead.parent_name.toLowerCase().includes(searchLower) ||
        lead.phone.includes(search);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.lead_source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSourceFilter('all');
  };

  const handleAddLead = async (data: any) => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      await fetchLeads(true); // Refresh with skeleton
    }
  };

  const hasActiveFilters = search || statusFilter !== 'all' || sourceFilter !== 'all';

  if (loading) {
    return <LeadsTableSkeleton />;
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Leads"
          subtitle={`Showing ${filteredLeads.length} of ${leads.length} leads`}
        />
        <Button onClick={() => setIsAddLeadOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
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

            <div className="flex gap-3 sm:contents">
              <Select
                value={statusFilter}
                onValueChange={(value: string) => setStatusFilter(value as LeadStatus | 'all')}
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

              <Select
                value={sourceFilter}
                onValueChange={(value: string) => setSourceFilter(value as LeadSource | 'all')}
              >
                <SelectTrigger className="flex-1 sm:flex-none sm:w-[150px] h-9">
                  <SelectValue placeholder="Source" />
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
                <TableHead className="font-semibold text-foreground py-4 px-4 text-center">Source</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4 text-center">Status</TableHead>
                <TableHead className="font-semibold text-foreground py-4 px-4 text-center">Next Follow-up</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-base">No leads found</p>
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
                filteredLeads.map((lead, index) => (
                  <TableRow
                    key={lead.lead_id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => router.push(`/leads/${lead.lead_id}`)}
                  >
                    <TableCell className="py-4 px-4 text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className="font-medium text-foreground">{lead.child_name}</span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {lead.parent_name}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {lead.child_age} yrs
                    </TableCell>
                    <TableCell className="py-4 px-4 text-muted-foreground">
                      {lead.phone}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {lead.lead_source}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {lead.next_followup ? (
                        <span className="text-sm text-foreground">
                          {format(parseISO(lead.next_followup), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddLeadDialog
        open={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onSubmit={handleAddLead}
      />
    </div>
  );
}