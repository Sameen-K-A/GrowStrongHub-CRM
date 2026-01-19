'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { LeadDetailContent } from '@/components/leads/LeadDetailContent';
import { DetailPageSkeleton } from '@/components/shared/Skeletons';
import type { Lead } from '@/types';

export default function LeadDetailPage() {
  const params = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchLead = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await fetch(`/api/leads/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setLead(data.data);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current || !params.id) return;
    hasFetched.current = true;
    fetchLead();
  }, [params.id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  return <LeadDetailContent lead={lead || undefined} onRefresh={() => fetchLead(true)} />;
}