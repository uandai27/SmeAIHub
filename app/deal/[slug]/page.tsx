import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DealRoom } from "@/components/deals/deal-room";
import { deals, getDeal } from "@/lib/deals";

type DealPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: DealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deal = getDeal(slug);

  if (!deal) {
    return {
      title: "Deal not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${deal.customer.name} Founding Pilot`,
    description: `Private SmeAIHub pilot proposal prepared for ${deal.customer.name}.`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function DealPage({ params }: DealPageProps) {
  const { slug } = await params;
  const deal = getDeal(slug);

  if (!deal) {
    notFound();
  }

  return <DealRoom deal={deal} />;
}
