import { prisma } from "./prisma";

export interface AuditLogParams {
  userId?: string | null;
  action:
    | "RADAR_SEARCH"
    | "PROFILE_VIEW"
    | "INTERACTION_LOG_CREATE"
    | "VERIFICATION_SUBMIT"
    | "VERIFICATION_APPROVE"
    | "VERIFICATION_REJECT"
    | "CONNECTOR_VOUCH"
    | "COUPON_REDEEM"
    | "COUPON_VERIFY_ATTEMPT";
  query?: string | null;
  targetProfileId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Audit Logger: Logs every access to sensitive CRM endpoints and actions
 * to prevent unauthorized insider data scraping and ensure non-repudiation.
 */
export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        query: params.query || null,
        targetProfileId: params.targetProfileId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent ? params.userAgent.slice(0, 500) : null,
      },
    });
  } catch (err) {
    // Audit failure should be logged to stderr without crashing the critical path
    console.error("[AuditLog Error]", err);
  }
}
