import { dummyLeads } from '@/data/leads';
import { LeadDetailContent } from '@/components/leads/LeadDetailContent';

export function generateStaticParams() {
  return dummyLeads.map((lead) => ({
    id: lead.lead_id,
  }));
}

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = dummyLeads.find((l) => l.lead_id === id);

  return <LeadDetailContent lead={lead} />;
}