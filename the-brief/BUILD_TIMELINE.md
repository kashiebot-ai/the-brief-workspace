# The Brief: Feature Build Timeline

## Current Status: March 11, 2026 (2:36 AM NZT)

---

## PHASE 1: FOUNDATION (Today - March 11) ✅ COMPLETE

### Task 1.1: Bill Timeline Visualiser ✅
**Completed: 3:00 AM**
- [x] Create BillTimeline component
- [x] Add stage progress logic
- [x] Style for desktop (horizontal) + mobile (vertical)
- [x] Add to bill detail page
- [x] Add stage tracking helpers to bills-data.ts

### Task 1.2: Submission Tracker Page ✅
**Completed: 3:45 AM**
- [x] Create /submissions page
- [x] Build filter UI (category, urgency)
- [x] Add "closing soon" section to homepage
- [x] Add stats bar with submission counts

### Task 1.3: Scraper Updates [DEFERRED]
**ETA: 1 hour**
- [ ] Add submission deadline extraction (Parliament.nz doesn't always have this)
- [ ] Add submission URL extraction
- [ ] Update sync script to handle new fields

**Note:** Submission deadlines are already being tracked via the existing scraper. The bill data in Sanity already has submissionDeadline fields populated.

---

## PHASE 2: AI SUMMARY INFRASTRUCTURE (March 12-13)

### Task 2.1: Local LLM Setup
**ETA: 2-3 hours**
- [ ] Install Ollama
- [ ] Download Llama 3.1 8B (best balance of speed/quality)
- [ ] Test PDF ingestion + summarisation
- [ ] Create summary prompt template

### Task 2.2: Report Monitor
**ETA: 2 hours**
- [ ] Create script to check Parliament.nz for new reports
- [ ] Create script to check Royal Commission site
- [ ] Set up weekly cron job

### Task 2.3: Summary Pipeline
**ETA: 2 hours**
- [ ] Create report-to-text extraction
- [ ] Build summary generation script
- [ ] Create Sanity upload workflow
- [ ] Add "pending review" status

---

## PHASE 3: POLISH & INTEGRATION (March 14-15)

### Task 3.1: UI Polish
- [ ] Animations for timeline
- [ ] Empty states
- [ ] Loading skeletons
- [ ] Mobile responsiveness check

### Task 3.2: Testing
- [ ] Test with real bill data
- [ ] Test submission flow
- [ ] Test AI summaries on sample reports

### Task 3.3: Deploy
- [ ] Merge to main
- [ ] Deploy to Vercel
- [ ] Verify all features working

---

## BLOCKERS & DEPENDENCIES

| Blocker | Status | Resolution |
|---------|--------|------------|
| Email provider | Not needed yet | Skip alerts for now |
| Content reviewer | TBD | Build "pending review" workflow |
| AI costs | Mitigated | Using local Ollama |

---

## DAILY LOG

### March 11, 2026
- 2:36 AM: Started Phase 1.1 - Bill Timeline Visualiser
- [ ] 5:00 AM: Target completion Phase 1.1
- [ ] 9:00 AM: Target completion Phase 1.2
- [ ] 12:00 PM: Target completion Phase 1.3

---

## NOTES

- Using local Llama 3.1 8B for summaries (free, private, no API costs)
- Report summaries will be marked "pending review" until you approve
- Email alerts deferred until you decide on provider
- Focus: Ship fast, iterate based on usage
