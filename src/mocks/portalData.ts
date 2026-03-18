/**
 * portalData.ts
 * Realistic mock data for the BKT Advisory portal lifecycle types.
 *
 * These fixtures are intentionally consistent with each other: the opportunity
 * owns the quote, and the project was created when the opportunity closed_won.
 * The activity log narrates the full journey from estimator submission through
 * to project kick-off.
 *
 * Import pattern:
 *   import { mockQuotes, mockOpportunities, mockProjects, mockActivity }
 *     from '@/mocks/portalData';
 */

import type {
  QuoteRecord,
  OpportunityRecord,
  ProjectRecord,
  ActivityEvent,
} from "../types/portal";

// ─────────────────────────────────────────────────────────────────────────────
// Quote mock data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mock quotes array.
 *
 * Mapper note — when the estimator fires `onGenerateQuote(quoteData)`, the
 * portal would call something like:
 *
 *   const record: QuoteRecord = {
 *     id: crypto.randomUUID(),
 *     opportunityId: null,           // linked later when opp is created
 *     status: "draft",
 *     version: 1,
 *     quoteNumber: generateQuoteNumber(),
 *     clientName:  `${quoteData.formData.firstName} ${quoteData.formData.lastName}`,
 *     clientCompany: quoteData.formData.companyName,
 *     clientEmail:   quoteData.formData.workEmail,
 *     projectType:   quoteData.formData.projectType,
 *     projectDescription: quoteData.formData.projectDescription,
 *     valueStatement:     quoteData.formData.valueStatement ?? "",
 *     totalCost:      quoteData.totalCost,
 *     estimatedWeeks: quoteData.estimatedWeeks,
 *     hourlyRate:     quoteData.finalHourlyRate,
 *     adjustedHours:  quoteData.adjustedHours,
 *     selectedCRMs:          quoteData.formData.selectedCRMs,
 *     selectedIntegrations:  quoteData.formData.selectedIntegrations,
 *     deliveryTeam:   quoteData.formData.deliveryTeam,
 *     powerUps:       quoteData.formData.powerUps,
 *     createdAt:   new Date().toISOString(),
 *     updatedAt:   new Date().toISOString(),
 *     sentAt:      null,
 *     respondedAt: null,
 *     expiresAt:   null,
 *     internalNotes: "",
 *   };
 */
export const mockQuotes: QuoteRecord[] = [
  {
    id: "q-001",
    opportunityId: "opp-001",
    status: "accepted",
    version: 2,
    quoteNumber: "Q-2025-001",
    clientName: "Marcus Webb",
    clientCompany: "Apex Solutions Group",
    clientEmail: "m.webb@apexsolutions.io",
    projectType: "custom",
    projectDescription:
      "Full Salesforce Sales Cloud implementation with GoHighLevel integration for outbound marketing automation. Includes custom CPQ configuration and an AI-powered lead-scoring agent.",
    valueStatement:
      "This solution will unify Apex's fragmented sales pipeline into a single source of truth, reducing manual data entry by an estimated 60% and shortening the average deal cycle from 45 days to under 30.",
    totalCost: 87500,
    estimatedWeeks: 14,
    hourlyRate: 175,
    adjustedHours: 500,
    selectedCRMs: ["Salesforce", "GoHighLevel"],
    selectedIntegrations: ["Zapier", "Slack", "DocuSign"],
    deliveryTeam: "nearshore",
    powerUps: ["ai_copilot", "priority_support"],
    createdAt: "2025-03-01T09:15:00.000Z",
    updatedAt: "2025-03-12T14:30:00.000Z",
    sentAt: "2025-03-05T11:00:00.000Z",
    respondedAt: "2025-03-12T14:30:00.000Z",
    expiresAt: "2025-04-05T00:00:00.000Z",
    internalNotes:
      "Client requested a revised scope on 2025-03-08 to add CPQ module. Version 2 sent on 2025-03-10.",
  },
  {
    id: "q-002",
    opportunityId: "opp-002",
    status: "sent",
    version: 1,
    quoteNumber: "Q-2025-002",
    clientName: "Priya Nair",
    clientCompany: "Luminary Health Partners",
    clientEmail: "priya.nair@luminaryhealth.com",
    projectType: "custom",
    projectDescription:
      "HubSpot CRM implementation for a multi-location healthcare network. Requires HIPAA-aligned data handling, Outlook / Microsoft 365 integration, and custom patient-journey automation workflows.",
    valueStatement:
      "Centralising patient communications will improve appointment adherence by an estimated 25% and give the care team a unified view of every interaction.",
    totalCost: 54000,
    estimatedWeeks: 10,
    hourlyRate: 160,
    adjustedHours: 337,
    selectedCRMs: ["HubSpot"],
    selectedIntegrations: ["Microsoft 365", "Twilio", "Zapier"],
    deliveryTeam: "nearshore",
    powerUps: ["compliance_pack"],
    createdAt: "2025-03-10T08:00:00.000Z",
    updatedAt: "2025-03-10T08:00:00.000Z",
    sentAt: "2025-03-10T10:00:00.000Z",
    respondedAt: null,
    expiresAt: "2025-04-10T00:00:00.000Z",
    internalNotes: "Follow up scheduled for 2025-03-17.",
  },
  {
    id: "q-003",
    opportunityId: null,
    status: "draft",
    version: 1,
    quoteNumber: "Q-2025-003",
    clientName: "Jordan Steele",
    clientCompany: "Pinnacle Realty Group",
    clientEmail: "j.steele@pinnaclerealty.com",
    projectType: "custom",
    projectDescription:
      "Zoho CRM setup for a regional real estate firm. Needs property-listing pipeline, automated follow-up sequences, and a client-portal integration.",
    valueStatement:
      "A structured CRM will allow Pinnacle's agents to track every lead from first inquiry to closing, reducing lost opportunities and manual follow-up overhead.",
    totalCost: 28000,
    estimatedWeeks: 6,
    hourlyRate: 145,
    adjustedHours: 193,
    selectedCRMs: ["Zoho"],
    selectedIntegrations: ["Google Workspace", "DocuSign"],
    deliveryTeam: "offshore",
    powerUps: [],
    createdAt: "2025-03-15T16:45:00.000Z",
    updatedAt: "2025-03-15T16:45:00.000Z",
    sentAt: null,
    respondedAt: null,
    expiresAt: null,
    internalNotes: "Pending internal review before sending.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Opportunity mock data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mock opportunities array.
 *
 * Mapper note — an OpportunityRecord is typically created at the same time as
 * the first QuoteRecord, or manually by a BKT team member after a discovery
 * call. The estimator's FormData drives the initial field population:
 *
 *   status:         "discovery"
 *   clientCompany:  formData.companyName
 *   contactName:    `${formData.firstName} ${formData.lastName}`
 *   contactEmail:   formData.workEmail
 *   projectType:    formData.projectType
 *   estimatedValue: quoteData.totalCost
 *   quoteIds:       [newQuote.id]
 */
export const mockOpportunities: OpportunityRecord[] = [
  {
    id: "opp-001",
    status: "closed_won",
    opportunityNumber: "OPP-2025-001",
    clientCompany: "Apex Solutions Group",
    contactName: "Marcus Webb",
    contactEmail: "m.webb@apexsolutions.io",
    projectType: "custom",
    summary:
      "Salesforce + GoHighLevel implementation with CPQ and AI lead scoring for a mid-market B2B SaaS company.",
    estimatedValue: 87500,
    quoteIds: ["q-001"],
    projectId: "prj-001",
    createdAt: "2025-03-01T09:15:00.000Z",
    updatedAt: "2025-03-12T14:30:00.000Z",
    closedAt: "2025-03-12T14:30:00.000Z",
    owner: "Sarah Burkhardt",
    internalNotes:
      "Fast close. Champion is the VP of RevOps. Legal review waived for contracts under $100k.",
  },
  {
    id: "opp-002",
    status: "proposal_sent",
    opportunityNumber: "OPP-2025-002",
    clientCompany: "Luminary Health Partners",
    contactName: "Priya Nair",
    contactEmail: "priya.nair@luminaryhealth.com",
    projectType: "custom",
    summary:
      "HubSpot CRM for a multi-location healthcare network with HIPAA compliance requirements.",
    estimatedValue: 54000,
    quoteIds: ["q-002"],
    projectId: null,
    createdAt: "2025-03-10T08:00:00.000Z",
    updatedAt: "2025-03-10T10:00:00.000Z",
    closedAt: null,
    owner: "Sarah Burkhardt",
    internalNotes:
      "Decision committee meets bi-weekly. Next meeting 2025-03-24. Legal may need BAA.",
  },
  {
    id: "opp-003",
    status: "discovery",
    opportunityNumber: "OPP-2025-003",
    clientCompany: "Pinnacle Realty Group",
    contactName: "Jordan Steele",
    contactEmail: "j.steele@pinnaclerealty.com",
    projectType: "custom",
    summary: "Zoho CRM setup for regional real estate firm. Early stage.",
    estimatedValue: 28000,
    quoteIds: ["q-003"],
    projectId: null,
    createdAt: "2025-03-15T16:45:00.000Z",
    updatedAt: "2025-03-15T16:45:00.000Z",
    closedAt: null,
    owner: "Sarah Burkhardt",
    internalNotes: "Came in via website estimator. Quote in draft.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Project mock data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mock projects array.
 *
 * Mapper note — a ProjectRecord is created when an OpportunityRecord
 * transitions to closed_won (and the linked QuoteRecord is accepted):
 *
 *   status:          "intake"
 *   opportunityId:   opportunity.id
 *   quoteId:         acceptedQuote.id
 *   clientCompany:   opportunity.clientCompany
 *   clientEmail:     opportunity.contactEmail
 *   estimatedWeeks:  acceptedQuote.estimatedWeeks
 *   contractValue:   acceptedQuote.totalCost
 *   techStack.crms:         acceptedQuote.selectedCRMs
 *   techStack.integrations: acceptedQuote.selectedIntegrations
 *   deliveryTeam:    acceptedQuote.deliveryTeam
 */
export const mockProjects: ProjectRecord[] = [
  {
    id: "prj-001",
    opportunityId: "opp-001",
    quoteId: "q-001",
    status: "build_in_progress",
    projectNumber: "PRJ-2025-001",
    projectName: "Apex Solutions — Salesforce RevOps Platform",
    clientCompany: "Apex Solutions Group",
    clientEmail: "m.webb@apexsolutions.io",
    estimatedWeeks: 14,
    startDate: "2025-03-17T00:00:00.000Z",
    targetEndDate: "2025-06-23T00:00:00.000Z",
    actualEndDate: null,
    contractValue: 87500,
    techStack: {
      crms: ["Salesforce", "GoHighLevel"],
      clouds: ["Sales Cloud", "CPQ"],
      integrations: ["Zapier", "Slack", "DocuSign"],
      aiTools: ["Agentforce"],
    },
    deliveryTeam: "nearshore",
    createdAt: "2025-03-13T09:00:00.000Z",
    updatedAt: "2025-03-17T09:00:00.000Z",
    blockedReason: null,
    internalNotes: "Sprint 1 kicked off 2025-03-17. Discovery doc approved.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Activity event mock data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mock activity log — narrates the lifecycle of the Apex Solutions opportunity
 * from initial estimator submission through to project build kick-off.
 *
 * Events are ordered chronologically (oldest first).
 */
export const mockActivity: ActivityEvent[] = [
  // ── Quote journey ──────────────────────────────────────────────────────
  {
    id: "evt-001",
    entityType: "quote",
    entityId: "q-001",
    type: "quote_generated",
    occurredAt: "2025-03-01T09:15:00.000Z",
    actor: "system",
    detail: "Estimator output promoted to draft quote Q-2025-001 (v1).",
    metadata: {
      totalCost: 72000,
      estimatedWeeks: 12,
      estimatorVersion: "1.4.0",
    },
  },
  {
    id: "evt-002",
    entityType: "quote",
    entityId: "q-001",
    type: "quote_sent",
    occurredAt: "2025-03-05T11:00:00.000Z",
    actor: "sarah.burkhardt@bktadvisory.com",
    detail: "Quote v1 sent to m.webb@apexsolutions.io.",
    metadata: { channel: "email", sentVia: "HubSpot Sequence" },
  },
  {
    id: "evt-003",
    entityType: "quote",
    entityId: "q-001",
    type: "quote_revised",
    occurredAt: "2025-03-10T10:00:00.000Z",
    actor: "sarah.burkhardt@bktadvisory.com",
    detail:
      "Client requested addition of CPQ module. Revised to v2. New total: $87,500.",
    metadata: { previousVersion: 1, newVersion: 2, deltaValue: 15500 },
  },
  {
    id: "evt-004",
    entityType: "quote",
    entityId: "q-001",
    type: "quote_sent",
    occurredAt: "2025-03-10T14:00:00.000Z",
    actor: "sarah.burkhardt@bktadvisory.com",
    detail: "Revised quote v2 sent to m.webb@apexsolutions.io.",
    metadata: { channel: "email" },
  },
  {
    id: "evt-005",
    entityType: "quote",
    entityId: "q-001",
    type: "quote_accepted",
    occurredAt: "2025-03-12T14:30:00.000Z",
    actor: "system",
    detail: "Client accepted quote Q-2025-001 v2 via portal signature.",
    metadata: { signatureMethod: "portal", ipAddress: "203.0.113.42" },
  },

  // ── Opportunity journey ────────────────────────────────────────────────
  {
    id: "evt-006",
    entityType: "opportunity",
    entityId: "opp-001",
    type: "project_created",
    occurredAt: "2025-03-13T09:00:00.000Z",
    actor: "sarah.burkhardt@bktadvisory.com",
    detail: "Opportunity closed_won. Project PRJ-2025-001 created.",
    metadata: { projectId: "prj-001" },
  },

  // ── Project journey ────────────────────────────────────────────────────
  {
    id: "evt-007",
    entityType: "project",
    entityId: "prj-001",
    type: "discovery_completed",
    occurredAt: "2025-03-21T17:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail: "Discovery workshop completed. Requirements document approved by client.",
    metadata: { deliverable: "requirements-v1.pdf" },
  },
  {
    id: "evt-008",
    entityType: "project",
    entityId: "prj-001",
    type: "scope_approved",
    occurredAt: "2025-03-24T12:00:00.000Z",
    actor: "sarah.burkhardt@bktadvisory.com",
    detail: "Scope of work signed off by Marcus Webb.",
    metadata: { documentRef: "SOW-APX-001" },
  },
  {
    id: "evt-009",
    entityType: "project",
    entityId: "prj-001",
    type: "design_started",
    occurredAt: "2025-03-25T09:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail: "Solution architecture and data model design commenced.",
    metadata: { sprintNumber: 1 },
  },
  {
    id: "evt-010",
    entityType: "project",
    entityId: "prj-001",
    type: "client_feedback_requested",
    occurredAt: "2025-04-01T16:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail:
      "Architecture diagram shared with client for review and sign-off before build start.",
    metadata: { artifactUrl: "/portal/prj-001/artifacts/arch-v1" },
  },
  {
    id: "evt-011",
    entityType: "project",
    entityId: "prj-001",
    type: "client_feedback_received",
    occurredAt: "2025-04-03T11:30:00.000Z",
    actor: "system",
    detail: "Client approved architecture diagram with minor comments.",
    metadata: { feedbackChannel: "portal_comment" },
  },
  {
    id: "evt-012",
    entityType: "project",
    entityId: "prj-001",
    type: "build_started",
    occurredAt: "2025-04-07T09:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail: "Development sprint 1 commenced. Build phase underway.",
    metadata: { sprintNumber: 2 },
  },
  {
    id: "evt-013",
    entityType: "project",
    entityId: "prj-001",
    type: "blocked",
    occurredAt: "2025-04-14T15:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail:
      "Blocked: awaiting client IT team to provision Salesforce connected-app credentials.",
    metadata: { reason: "Awaiting client SSO / connected-app credentials" },
  },
  {
    id: "evt-014",
    entityType: "project",
    entityId: "prj-001",
    type: "unblocked",
    occurredAt: "2025-04-16T10:00:00.000Z",
    actor: "delivery.team@bktadvisory.com",
    detail: "Salesforce credentials received. Build resumed.",
    metadata: {},
  },
];
