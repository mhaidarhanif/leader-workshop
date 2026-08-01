import { describe, it, expect } from 'vitest';
import { rankSubmissions } from './ranking.js';

const t1 = new Date('2026-08-01T10:00:00Z');
const t2 = new Date('2026-08-01T11:00:00Z');

describe('rankSubmissions', () => {
  it('computes averages for a single judge', () => {
    const result = rankSubmissions(
      [{ id: 'a', teamName: 'Alpha', createdAt: t1 }],
      [{ submissionId: 'a', prdScore: 8, rfcScore: 6, codeScore: 10 }],
    );

    expect(result[0].avgPrd).toBe(8);
    expect(result[0].avgRfc).toBe(6);
    expect(result[0].avgCode).toBe(10);
    expect(result[0].total).toBe(8);
    expect(result[0].isTopFive).toBe(true);
  });

  it('averages across multiple judges', () => {
    const result = rankSubmissions(
      [{ id: 'a', teamName: 'Alpha', createdAt: t1 }],
      [
        { submissionId: 'a', prdScore: 8, rfcScore: 6, codeScore: 10 },
        { submissionId: 'a', prdScore: 6, rfcScore: 8, codeScore: 8 },
      ],
    );

    expect(result[0].avgPrd).toBe(7);
    expect(result[0].avgRfc).toBe(7);
    expect(result[0].avgCode).toBe(9);
    expect(result[0].total).toBeCloseTo(7.666, 2);
  });

  it('tie-breaks by earlier created_at', () => {
    const result = rankSubmissions(
      [
        { id: 'a', teamName: 'Alpha', createdAt: t1 },
        { id: 'b', teamName: 'Beta', createdAt: t2 },
      ],
      [
        { submissionId: 'a', prdScore: 8, rfcScore: 8, codeScore: 8 },
        { submissionId: 'b', prdScore: 8, rfcScore: 8, codeScore: 8 },
      ],
    );

    expect(result[0].teamName).toBe('Alpha');
    expect(result[1].teamName).toBe('Beta');
  });

  it('ranks unscored submissions last with null total', () => {
    const result = rankSubmissions(
      [
        { id: 'a', teamName: 'Alpha', createdAt: t1 },
        { id: 'b', teamName: 'Beta', createdAt: t2 },
      ],
      [{ submissionId: 'a', prdScore: 5, rfcScore: 5, codeScore: 5 }],
    );

    expect(result[0].teamName).toBe('Alpha');
    expect(result[1].teamName).toBe('Beta');
    expect(result[1].total).toBeNull();
    expect(result[1].isTopFive).toBe(false);
  });

  it('marks top 5 only for ranked entries', () => {
    const subs = Array.from({ length: 7 }, (_, i) => ({
      id: `id-${i}`,
      teamName: `Team ${i}`,
      createdAt: new Date(t1.getTime() + i * 1000),
    }));
    const scores = subs.map((s, i) => ({
      submissionId: s.id,
      prdScore: 10 - i,
      rfcScore: 10 - i,
      codeScore: 10 - i,
    }));

    const result = rankSubmissions(subs, scores);
    const topFive = result.filter((r) => r.isTopFive);
    const rest = result.filter((r) => !r.isTopFive);

    expect(topFive).toHaveLength(5);
    expect(rest.length).toBe(2);
    expect(rest.every((r) => r.total !== null)).toBe(true);
  });
});
