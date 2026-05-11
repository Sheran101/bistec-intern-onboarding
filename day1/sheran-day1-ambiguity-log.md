# LearnLanka — Ambiguity Hunt Log

## Brief reference
- "Students must be able to search for tutors by subject, grade, language, and price band."
- "Tutors must be able to publish availability slots, accept or decline bookings, and cancel with at least 12 hours notice."

## Findings

| # | Quote | Why ambiguous | Clarification question | Priority |
|---|-------|---------------|------------------------|----------|
| 1 | "price band" | Price ranges are not defined | What are the tutor price ranges? | H |
| 2 | "grade" | Supported grade levels are unclear | Which school grades should the platform support? | M |
| 3 | "1-hour session" | Breaks or overtime handling is unclear | Can tutors extend sessions beyond 1 hour? | M |
| 4 | "cancel with at least 12 hours notice" | Student cancellation policy is missing | Can students cancel bookings? | H |
| 5 | "weekly via bank transfer" | Payout day is not specified | On which day should tutor payments be processed? | M |
| 6 | "one-line comment" | Maximum character limit is unclear | What is the maximum comment length? | L |
| 7 | "99.5% monthly uptime" | Maintenance windows are not mentioned | Will planned maintenance affect uptime calculation? | H |
| 8 | "200 simultaneous video sessions" | Expected future scaling is unclear | Should the system support more than 200 sessions later? | M |
| 9 | "deletion request flow" | Data deletion time period is unclear | How long should deletion requests take to complete? | H |
| 10 | "support Sinhala, Tamil, and English" | Translation responsibility is unclear | Who will provide translations for UI content? | M |

## Results Summary

| Metric | Target | Achieved |
|--------|--------|----------|
| Items found | 10+ | 10 |
| High-priority items | 3+ | 4 |
| Items convertible to test cases | 5+ | 7 |

## Top 3 questions to ask the founders
- 1. Can students also cancel bookings and what are the cancellation rules?
- 2. What are the exact tutor price ranges for filtering?
- 3. How should deletion requests under PDPA be handled?

## Reflection
- The biggest challenge was identifying missing business rules from short requirements.
- The cancellation policy question is most likely to affect the architecture because it impacts booking workflows, payment handling, and notifications.