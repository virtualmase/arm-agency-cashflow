import { describe, expect, it, vi } from "vitest";
import { SWELL_SITEMAP_URL } from "./swellEditorial";
import { runSwellEditorialMonitor } from "./scheduled";

describe("scheduled Swell editorial monitor", () => {
  it("creates a simulated new source as a private pending-review record without any publication action", async () => {
    const createReview = vi.fn().mockResolvedValue(701);
    const notifyOwner = vi.fn().mockResolvedValue(true);
    const updateMonitorRun = vi.fn().mockResolvedValue(undefined);
    const candidateUrl = "https://swellmarketing.xyz/resources/controlled-new-version/";

    const result = await runSwellEditorialMonitor("controlled-task", {
      getMonitorByTaskUid: vi.fn().mockResolvedValue({
        enabled: true,
        sourceSitemapUrl: SWELL_SITEMAP_URL,
        lastCheckedAt: new Date("2026-08-19T09:03:11Z"),
        retentionDays: 90,
      }),
      getReviewBySourceVersion: vi.fn().mockResolvedValue(undefined),
      createReview,
      expireStaleReviews: vi.fn().mockResolvedValue(0),
      updateMonitorRun,
      notifyOwner,
      fetcher: vi.fn(async (url: string) => ({
        ok: true,
        status: 200,
        text: async () => url === SWELL_SITEMAP_URL
          ? `<urlset><url><loc>${candidateUrl}</loc><lastmod>2026-08-19</lastmod></url></urlset>`
          : "<html><head><title>Controlled source</title></head><body>Ignored source body.</body></html>",
      })),
      generateDraft: vi.fn().mockResolvedValue({
        title: "Controlled source",
        description: "Public metadata only",
        draft: {
          topic: "Controlled validation",
          buyerDecision: "Decide whether the workflow needs a human review.",
          originalAngle: "An original operations angle.",
          brief: "Private review brief with no outcome promise.",
          suggestedResearchLeads: [{ title: "NIST AI RMF", url: "https://www.nist.gov/itl/ai-risk-management-framework", why: "Verification lead." }],
          suggestedPropertyLinks: [{ label: "ARM Insights", url: "https://arm-agency.xyz/insights", reason: "Contextual destination." }],
          claimNotes: "Verify sources and obtain owner approval before publication.",
        },
      }),
    });

    expect(result).toEqual({ ok: true, scanned: 1, created: 1, expired: 0 });
    expect(createReview).toHaveBeenCalledTimes(1);
    const privateReview = createReview.mock.calls[0][0];
    expect(privateReview).toMatchObject({
      sourceUrl: candidateUrl,
      sourceLastmod: "2026-08-19",
      sourceTitle: "Controlled source",
      claimNotes: "Verify sources and obtain owner approval before publication.",
    });
    expect(privateReview).not.toHaveProperty("status");
    expect(JSON.parse(privateReview.suggestedLinks)).toEqual([{ label: "ARM Insights", url: "https://arm-agency.xyz/insights", reason: "Contextual destination." }]);
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({ title: "Swell editorial review queue: 1 new item" }));
    expect(updateMonitorRun).toHaveBeenCalledWith("controlled-task", expect.stringContaining("created 1 private review record"));
  });
});
