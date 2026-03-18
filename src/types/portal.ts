/**
 * portal.ts
 * Canonical lifecycle types for the BKT Advisory authenticated portal.
 *
 * These types are intentionally decoupled from the public-facing Estimator so
 * that the portal can evolve independently. Mapper comments on each interface
 * show how estimator output (FormData + QuoteData from src/types.ts) can be
 * promoted into a portal record when a quote is first persisted.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Quote Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lifecycle states for a client-facing quote document.
 *
 * State machine (happy path):
 *   draft → scoping → quoted → sent → accepted
 *
 * Divergence paths:
 *   sent → revision_requested → quoted → sent  (revision loop)
 *   sent → declined
 *   sent → expired  (time-based auto-transition)
 */
export type QuoteStatus =
  | "draft"               // Created but not yet reviewed internally
  | "scoping"             // Actively gathering scope details
  | "quoted"              // Pricing calculated; ready to send
  | "sent"                // Delivered to client
  | "revision_requested"  // Client asked for changes
  | "accepted"            // Client confirmed
  | "declined"            // Client passed
  | "expired";            // Passed validity window with no response

// ─────────────────────────────────────────────────────────────────────────────
// Opportunity Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lifecycle states for a sales opportunity linked to one or more quotes.
 *
 * State machine (happy path):
 *   discovery → solutioning → proposal_prepared → proposal_sent → negotiation → closed_won
 *
 * Divergence paths:
 *   Any stage → closed_lost
 */
export type OpportunityStatus =
  | "discovery"           // Initial qualification; understanding the client need
  | "solutioning"         // Architecting the solution; choosing tech stack
  | "proposal_prepared"   // Full proposal document ready internally
  | "proposal_sent"       // Proposal delivered to client
  | "negotiation"         // Commercial or scope negotiation underway
  | "closed_won"          // Deal confirmed
  | "closed_lost";        // Deal did not proceed

// ─────────────────────────────────────────────────────────────────────────────
// Project Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lifecycle states for an active delivery project.
 *
 * State machine (happy path):
 *   intake → discovery → scoping → design_in_progress → build_in_progress
 *         → awaiting_client → uat → completed → archived
 *
 * Divergence paths:
 *   Any active stage → blocked  (unresolved dependency / risk)
 *   blocked → prior active stage  (unblocked transition)
 *   completed → archived  (retention/close-out)
 */
export type ProjectStatus =
  | "intake"              // Signed; onboarding artifacts being collected
  | "discovery"           // Workshops and requirements gathering in progress
  | "scoping"             // Scope-of-work being finalised
  | "design_in_progress"  // Solution architecture and UX design underway
  | "build_in_progress"   // Active development sprint
  | "awaiting_client"     // BKT deliverable sent; waiting on client input/approval
  | "blocked"             // Progress halted due to external dependency or risk
  | "uat"                 // Client user-acceptance testing
  | "completed"           // All deliverables accepted; project closed
  | "archived";           // Historical record; no active work

// ─────────────────────────────────────────────────────────────────────────────
// Activity Event Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Discrete event types recorded in the activity log for any portal entity.
 * Events are append-only and form a full audit trail.
 */
export type ActivityEventType =
  | "quote_generated"           // Estimator output promoted to a QuoteRecord
  | "quote_sent"                // Quote delivered to client
  | "quote_revised"             // New version generated after revision_requested
  | "quote_accepted"            // Client acceptance recorded
  | "project_created"           // ProjectRecord instantiated from accepted quote
  | "discovery_completed"       // Discovery phase signed off
  | "scope_approved"            // Scope of work approved by client
  | "design_started"            // Design phase commenced
  | "build_started"             // Development phase commenced
  | "client_feedback_requested" // BKT requested client review or decision
  | "client_feedback_received"  // Client response received
  | "blocked"                   // Block event recorded with reason
  | "unblocked"                 // Block resolved; work resumed
  | "uat_started"               // UAT phase commenced
  | "completed"                 // Project or milestone marked complete
  | "archived";                 // Record moved to archive

// ─────────────────────────────────────────────────────────────────────────────
// Canonical Interfaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A portal quote record derived from (or created independently of) estimator
 * output. Represents one version of a priced proposal for a client.
 *
 * Estimator → QuoteRecord mapper:
 *   FormData.firstName + lastName   → clientName
 *   FormData.companyName            → clientCompany
 *   FormData.workEmail              → clientEmail
 *   FormData.projectType            → projectType
 *   FormData.projectDescription     → projectDescription
 *   FormData.valueStatement         → valueStatement
 *   QuoteData.totalCost             → totalCost
 *   QuoteData.estimatedWeeks        → estimatedWeeks
 *   QuoteData.finalHourlyRate       → hourlyRate
 *   QuoteData.adjustedHours         → adjustedHours
 *   FormData.selectedCRMs           → selectedCRMs
 *   FormData.selectedIntegrations   → selectedIntegrations
 *   FormData.deliveryTeam           → deliveryTeam
 *   FormData.powerUps               → powerUps
 *   Date.now()                      → createdAt
 *   "draft"                         → status (initial)
 */
export interface QuoteRecord {
  /** Unique portal identifier (UUID) */
  id: string;

  /** Reference to the parent opportunity, if one exists */
  opportunityId: string | null;

  /** Current lifecycle state */
  status: QuoteStatus;

  /** Version number; increments on each revision */
  version: number;

  /** Human-readable label, e.g. "Q-2025-001" */
  quoteNumber: string;

  // ── Client context ───────────────────────────────────────────────────────
  clientName: string;
  clientCompany: string;
  clientEmail: string;

  // ── Project context ──────────────────────────────────────────────────────
  /** Maps from FormData.projectType */
  projectType: string;
  /** Maps from FormData.projectDescription */
  projectDescription: string;
  /** Maps from FormData.valueStatement */
  valueStatement: string;

  // ── Pricing (sourced from QuoteData) ─────────────────────────────────────
  /** Maps from QuoteData.totalCost */
  totalCost: number;
  /** Maps from QuoteData.estimatedWeeks */
  estimatedWeeks: number;
  /** Maps from QuoteData.finalHourlyRate */
  hourlyRate: number;
  /** Maps from QuoteData.adjustedHours */
  adjustedHours: number;

  // ── Stack selections (sourced from FormData arrays) ───────────────────────
  selectedCRMs: string[];
  selectedIntegrations: string[];
  deliveryTeam: string;
  powerUps: string[];

  // ── Metadata ─────────────────────────────────────────────────────────────
  /** ISO 8601 timestamp */
  createdAt: string;
  /** ISO 8601 timestamp */
  updatedAt: string;
  /** ISO 8601 timestamp; null until status === "sent" */
  sentAt: string | null;
  /** ISO 8601 timestamp; null until status === "accepted" | "declined" */
  respondedAt: string | null;
  /** ISO 8601 expiry date; null if no expiry set */
  expiresAt: string | null;

  /** Internal notes visible only to BKT team */
  internalNotes: string;
}

/**
 * A sales opportunity that may own one or more QuoteRecords and eventually
 * produce a ProjectRecord on close-won.
 *
 * Estimator → OpportunityRecord mapper:
 *   FormData.companyName   → clientCompany
 *   FormData.workEmail     → contactEmail
 *   FormData.projectType   → projectType
 *   QuoteData.totalCost    → estimatedValue (initial)
 *   "discovery"            → status (initial)
 */
export interface OpportunityRecord {
  /** Unique portal identifier (UUID) */
  id: string;

  /** Current lifecycle state */
  status: OpportunityStatus;

  /** Human-readable label, e.g. "OPP-2025-007" */
  opportunityNumber: string;

  // ── Client context ───────────────────────────────────────────────────────
  clientCompany: string;
  contactName: string;
  contactEmail: string;

  // ── Opportunity details ───────────────────────────────────────────────────
  projectType: string;
  /** Short summary of the business need */
  summary: string;

  /** Maps from QuoteData.totalCost at time of first quote */
  estimatedValue: number;

  /** IDs of all quotes linked to this opportunity */
  quoteIds: string[];

  /** ID of the project created on close-won; null until then */
  projectId: string | null;

  // ── Metadata ─────────────────────────────────────────────────────────────
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;

  /** BKT account owner / sales rep */
  owner: string;

  internalNotes: string;
}

/**
 * A delivery project created when an opportunity reaches closed_won.
 *
 * Estimator → ProjectRecord mapper:
 *   OpportunityRecord.id             → opportunityId
 *   QuoteRecord.id                   → quoteId
 *   FormData.companyName             → clientCompany
 *   FormData.workEmail               → clientEmail
 *   QuoteData.estimatedWeeks         → estimatedWeeks
 *   QuoteData.totalCost              → contractValue
 *   FormData.selectedCRMs            → techStack.crms
 *   FormData.selectedIntegrations    → techStack.integrations
 *   FormData.selectedAITools         → techStack.aiTools
 *   FormData.deliveryTeam            → deliveryTeam
 *   "intake"                         → status (initial)
 */
export interface ProjectRecord {
  /** Unique portal identifier (UUID) */
  id: string;

  /** Reference to the winning opportunity */
  opportunityId: string;

  /** Reference to the accepted quote */
  quoteId: string;

  /** Current lifecycle state */
  status: ProjectStatus;

  /** Human-readable label, e.g. "PRJ-2025-003" */
  projectNumber: string;

  /** Display name agreed with the client */
  projectName: string;

  // ── Client context ───────────────────────────────────────────────────────
  clientCompany: string;
  clientEmail: string;

  // ── Schedule & value ─────────────────────────────────────────────────────
  /** Maps from QuoteData.estimatedWeeks */
  estimatedWeeks: number;
  /** ISO 8601 date */
  startDate: string | null;
  /** ISO 8601 date; derived from startDate + estimatedWeeks */
  targetEndDate: string | null;
  /** ISO 8601 date; actual completion */
  actualEndDate: string | null;
  /** Maps from QuoteData.totalCost */
  contractValue: number;

  // ── Tech stack ────────────────────────────────────────────────────────────
  techStack: {
    /** Maps from FormData.selectedCRMs */
    crms: string[];
    /** Maps from FormData.selectedClouds */
    clouds: string[];
    /** Maps from FormData.selectedIntegrations */
    integrations: string[];
    /** Maps from FormData.selectedAITools */
    aiTools: string[];
  };

  /** Maps from FormData.deliveryTeam */
  deliveryTeam: string;

  // ── Metadata ─────────────────────────────────────────────────────────────
  createdAt: string;
  updatedAt: string;

  /** Human-readable reason if status === "blocked" */
  blockedReason: string | null;

  internalNotes: string;
}

/**
 * An immutable audit-log event attached to a quote, opportunity, or project.
 * Events are append-only; never update or delete.
 */
export interface ActivityEvent {
  /** Unique event identifier (UUID) */
  id: string;

  /** The entity this event belongs to */
  entityType: "quote" | "opportunity" | "project";

  /** ID of the quote, opportunity, or project */
  entityId: string;

  /** Discriminated event kind */
  type: ActivityEventType;

  /** ISO 8601 timestamp of when the event occurred */
  occurredAt: string;

  /** Portal user who triggered the event; "system" for automated transitions */
  actor: string;

  /** Free-form human-readable detail or reason */
  detail: string;

  /**
   * Optional structured payload specific to the event type.
   * e.g. for "blocked": { reason: "Awaiting client SSO credentials" }
   *      for "quote_revised": { previousVersion: 1, newVersion: 2 }
   */
  metadata: Record<string, unknown>;
}
