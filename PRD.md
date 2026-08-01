# PRD — Workshop Judge Platform

## Problem

A live workshop needs a fast, fair way to collect project submissions and rank them for prizes. Spreadsheets and chat threads do not hold up under concurrent submit + judge + audience refresh.

## Users

| Role | Count | Needs |
|------|-------|-------|
| Participants | ~20 | Submit once: repo, deploy URL, screenshots |
| Judges | ~3 | Score PRD, RFC, Code (1–10 each) |
| Audience | Many | Live leaderboard, top 5 highlighted |

## Core flows

1. **Submit** — team name, GitHub repo root URL, deployed URL, screenshot URLs
2. **Judge** — enter shared PIN, pick submission, score three dimensions, identify by name
3. **Leaderboard** — auto-refresh every 10s, rank all teams, highlight top 5

## Submission artifacts

- GitHub repo with `PRD.md` and `RFC.md` at root on `main` (links derived automatically)
- Deployed application URL
- Screenshot URLs (one per line or comma-separated)

## Scoring

- Dimensions: PRD, RFC, Code — each 1–10
- Total = average of dimension averages across judges
- Tie-break: earlier submission wins

## Non-goals

- Participant or judge accounts (OAuth, email login)
- File uploads
- Submission editing after submit
- Multi-event / multi-workshop support
- Real-time websockets
