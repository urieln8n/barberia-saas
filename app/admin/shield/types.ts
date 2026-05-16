import type {
  ShieldAuditResult,
  ShieldCommercialCta,
  ShieldIssue,
  ShieldRecommendation,
} from "@/src/lib/audit/shield-result";

export type ReviewStatus = "pending" | "in_review" | "completed" | "cancelled";

export type ShieldAdminAudit = {
  id: string;
  score: number | null;
  created_at: string;
  report: (Partial<ShieldAuditResult> & {
    issues?: ShieldIssue[];
    recommendations?: ShieldRecommendation[];
    recommended_cta?: ShieldCommercialCta;
  }) | null;
};

export type ShieldAdminRequest = {
  id: string;
  url: string;
  status: ReviewStatus;
  notes: string | null;
  created_at: string;
  barbershop_id: string;
  barbershop: {
    id: string;
    name: string;
    slug: string | null;
    phone: string | null;
    city: string | null;
  } | null;
  latestAudit: ShieldAdminAudit | null;
};
