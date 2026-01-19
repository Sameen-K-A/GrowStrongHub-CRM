'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dummyLeads } from '@/data/leads';
import { dummyStudents } from '@/data/students';
import { format, parseISO, isToday } from 'date-fns';
import { ROUTE } from '@/data/router';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function Dashboard() {
  const router = useRouter();

  const stats = useMemo(() => {
    const totalLeads = dummyLeads.length;
    const hotLeads = dummyLeads.filter(l => l.status === 'hot').length;
    const todayFollowups = dummyLeads.filter(l => {
      if (!l.next_followup) return false;
      return isToday(parseISO(l.next_followup)) && l.status !== 'closed';
    }).length;
    const activeStudents = dummyStudents.filter(s => s.status === 'active').length;

    return { totalLeads, hotLeads, todayFollowups, activeStudents };
  }, []);

  const todayFollowups = useMemo(() => {
    return dummyLeads.filter(l => {
      if (!l.next_followup) return false;
      return isToday(parseISO(l.next_followup)) && l.status !== 'closed';
    }).slice(0, 5);
  }, []);

  const hotLeads = useMemo(() => {
    return dummyLeads.filter(l => l.status === 'hot').slice(0, 5);
  }, []);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your leads and students with ease.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push(ROUTE.LEADS)}>
            View All Leads
          </Button>
          <Button variant="outline" onClick={() => router.push(ROUTE.STUDENTS)}>
            View All Students
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          className="shadow-none border-0 bg-linear-to-r from-primary to-primary/80 text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push(ROUTE.LEADS)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium opacity-90">Total Leads</p>
              <ArrowUpRight className="h-5 w-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mt-3">{stats.totalLeads}</p>
            <p className="text-xs mt-2 opacity-80">All time leads collected</p>
          </CardContent>
        </Card>

        <Card
          className="shadow-none border cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => router.push(ROUTE.LEADS)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">Hot Leads</p>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-4xl font-bold mt-3">{stats.hotLeads}</p>
            <p className="text-xs mt-2 text-muted-foreground">Ready to convert</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">Today's Follow-ups</p>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-4xl font-bold mt-3">{stats.todayFollowups}</p>
            <p className="text-xs mt-2 text-muted-foreground">Pending calls today</p>
          </CardContent>
        </Card>

        <Card
          className="shadow-none border cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => router.push(ROUTE.STUDENTS)}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-4xl font-bold mt-3">{stats.activeStudents}</p>
            <p className="text-xs mt-2 text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-none border overflow-hidden gap-0">
          <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border/50">
            <h3 className="font-semibold">Today's Follow-ups</h3>
          </div>
          {todayFollowups.length === 0 ? (
            <div className="flex items-center justify-center min-h-20 text-muted-foreground text-sm">
              No follow-ups scheduled for today
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="py-3 px-4 font-medium">Child</TableHead>
                  <TableHead className="py-3 px-4 font-medium">Parent</TableHead>
                  <TableHead className="py-3 px-4 font-medium text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayFollowups.map((lead) => (
                  <TableRow
                    key={lead.lead_id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => router.push(`/leads/${lead.lead_id}`)}
                  >
                    <TableCell className="py-3 px-4 font-medium">{lead.child_name}</TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground">{lead.parent_name}</TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <StatusBadge status={lead.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="shadow-none border overflow-hidden gap-0">
          <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border/50">
            <h3 className="font-semibold">Hot Leads</h3>
          </div>
          {hotLeads.length === 0 ? (
            <div className="flex items-center justify-center min-h-20 text-muted-foreground text-sm">
              No hot leads yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="py-3 px-4 font-medium">Child</TableHead>
                  <TableHead className="py-3 px-4 font-medium">Source</TableHead>
                  <TableHead className="py-3 px-4 font-medium text-center">Next Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotLeads.map((lead) => (
                  <TableRow
                    key={lead.lead_id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => router.push(`/leads/${lead.lead_id}`)}
                  >
                    <TableCell className="py-3 px-4 font-medium">{lead.child_name}</TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {lead.lead_source}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      {lead.next_followup ? (
                        <span className="text-sm">{format(parseISO(lead.next_followup), 'MMM d, yyyy')}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}