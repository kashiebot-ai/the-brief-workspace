# MP Tracking Database — The Brief Project

**Parliament:** 54th New Zealand Parliament  
**Term:** 5 December 2023 – 16 November 2026 (latest)  
**Last Updated:** 2026-03-01  
**Total MPs:** 123 (overhang from Te Pāti Māori)

---

## Party Breakdown

| Party | Seats | Status | Leader |
|-------|-------|--------|--------|
| **National** | 49 | Government | Christopher Luxon (PM) |
| **Labour** | 34 | Opposition | Chris Hipkins (LoO) |
| **Green** | 15 | Opposition | Marama Davidson / Chlöe Swarbrick |
| **ACT** | 11 | Government (coalition) | David Seymour |
| **NZ First** | 8 | Government (coalition) | Winston Peters |
| **Te Pāti Māori** | 6 | Opposition | Rawiri Waititi / Debbie Ngarewa-Packer |

---

## Database Schema

### Core MP Record Structure

```typescript
interface MP {
  id: string                    // Unique identifier (parliament.nz ID if available)
  name: {
    full: string
    first: string
    last: string
  }
  party: Party
  electorate: {
    name: string | null         // null for list MPs
    type: 'general' | 'maori' | 'list'
    region?: string
  }
  contact: {
    email: string
    phone?: string
    parliamentOffice?: string
    electorateOffice?: string
  }
  social: {
    twitter?: string
    facebook?: string
    instagram?: string
    bluesky?: string
  }
  roles: {
    isMinister: boolean
    isSpeaker: boolean
    portfolios?: string[]
    selectCommittees: string[]
    caucusRole?: string         // e.g., "Chief Whip", "Deputy Leader"
  }
  demographics: {
    gender?: string
    ethnicity?: string[]
    yearOfBirth?: number
    regionOfBirth?: string
  }
  tenure: {
    firstElected: number        // Year first elected to Parliament
    totalTerms: number
    previousElectorate?: string
  }
  tracking: {
    billsSponsored: string[]    // Bill IDs
    speechesKey: string[]       // Key speech topics
    questionsAsked: number      // Oral questions in current term
    billsVoted: {               // Key votes tracked
      billId: string
      vote: 'for' | 'against' | 'abstain' | 'absent'
    }[]
    attendanceRate?: number
    travelExpenses?: number     // Annual disclosure
    donationsReceived?: number  // Electoral Commission data
  }
  issues: {
    priority: string[]          // Top 3-5 stated priorities
    votingRecord: {            // Calculated from votes
      economic: 'left' | 'centre' | 'right'
      social: 'progressive' | 'moderate' | 'conservative'
      environmental: number     // 0-100 score
    }
  }
  media: {
    mentionsLast30Days: number
    recentArticles: string[]
    controversyScore: number    // 0-10 (automated tracking)
  }
  notes: string
}
```

---

## Key MPs by Category

### Government Front Bench (National)

| Name | Role | Key Portfolios |
|------|------|----------------|
| Christopher Luxon | Prime Minister | National Security, Intelligence |
| Nicola Willis | Deputy PM | Finance, Social Investment, Economic Growth |
| Chris Bishop | Leader of the House | Housing, Infrastructure, RMA Reform |
| Erica Stanford | Minister | Education |
| Shane Reti | Minister | Health |
| Mark Mitchell | Minister | Police, Corrections, Emergency Management |
| Paul Goldsmith | Minister | Justice, Arts |
| Judith Collins | Minister | Defence, Space, Science |
| Louise Upston | Minister | Social Development, Employment |
| Todd McClay | Minister | Trade, Agriculture |
| Simeon Brown | Minister | Transport, Local Government |
| Matt Doocey | Minister | Mental Health, Youth |

### ACT Ministers

| Name | Role | Key Portfolios |
|------|------|----------------|
| David Seymour | Associate Minister | Education, Regulation |
| Brooke van Velden | Minister | Workplace Relations, Safety |

### NZ First Ministers

| Name | Role | Key Portfolios |
|------|------|----------------|
| Winston Peters | Minister of Foreign Affairs | Foreign Affairs, Racing |
| Shane Jones | Minister | Regional Development, Resources |
| Casey Costello | Minister | Customs, Seniors |

### Opposition Front Bench (Labour)

| Name | Role | Key Portfolios |
|------|------|----------------|
| Chris Hipkins | Leader of the Opposition | — |
| Carmel Sepuloni | Deputy Leader | Social Development (shadow) |
| Grant Robertson | — | Finance (shadow) |
| Megan Woods | — | Housing (shadow) |
| Ayesha Verrall | — | Health (shadow) |
| Willow-Jean Prime | — | Education (shadow) |
| Peeni Henare | — | Māori Development (shadow) |

### Green Party Co-Leaders & Key MPs

| Name | Role | Focus Areas |
|------|------|-------------|
| Marama Davidson | Co-Leader | Climate, Social Justice |
| Chlöe Swarbrick | Co-Leader | Climate, Housing, Young People |
| Julie Anne Genter | MP | Transport, Urban Design |
| Ricardo Menéndez March | MP | Immigration, Welfare |
| Teanau Tuiono | MP | Pacific Peoples, Environment |

### Te Pāti Māori Leadership

| Name | Role | Focus Areas |
|------|------|-------------|
| Rawiri Waititi | Co-Leader | Indigenous Rights, Co-governance |
| Debbie Ngarewa-Packer | Co-Leader | Health, Social Justice |
| Hana-Rawhiti Maipi-Clarke | MP | Youth, Climate, Tikanga |

---

## Critical Electorates to Watch

### Marginal Seats (2023 majority under 1000)

| Electorate | Winner | Margin | Party | Note |
|------------|--------|--------|-------|------|
| Tāmaki Makaurau | Takutai Tarsh Kemp (deceased) | 4 votes | Te Pāti Māori | By-election pending |
| Nelson | Rachel Boyack | 29 votes | Labour | Very marginal |
| Tauranga | Sam Uffindell | 247 votes | National | Previously held by Simon Bridges |
| Northland | Grant McCallum | 487 votes | National | NZ First target seat |
| Hamilton East | Ryan Hamilton | 535 votes | National | University electorate |
| Mt Albert | Helen White | 666 votes | Labour | Jacinda Ardern's old seat |

### Māori Electorates (All 7 held by Te Pāti Māori)

| Electorate | MP | Note |
|------------|-----|------|
| Te Tai Tokerau | Mariameno Kapa-Kingi | |
| Tāmaki Makaurau | Vacant (Kemp deceased) | By-election required |
| Hauraki-Waikato | Hana-Rawhiti Maipi-Clarke | Youngest MP |
| Waiariki | Rawiri Waititi | Co-leader |
| Ikaroa-Rāwhiti | Cushla Tangaere-Manuel | |
| Te Tai Hauāuru | Debbie Ngarewa-Packer | Co-leader |
| Te Tai Tonga | Tākuta Ferris | |

---

## Select Committees (Key Tracking Areas)

| Committee | Chair (Party) | Key Bills Under Review |
|-----------|---------------|------------------------|
| Finance & Expenditure | Stuart Smith (N) | Budget measures |
| Economic Development | Jamie Arbuckle (NZF) | Regional development |
| Education & Workforce | James McDowall (ACT) | Charter schools |
| Environment | David MacLeod (N) | RMA replacement |
| Foreign Affairs | Tim van de Molen (N) | Foreign policy |
| Governance & Administration | Rachel Boyack (L) | Parliamentary matters |
| Health | Sam Uffindell (N) | Health reforms |
| Justice | Neru Leavasa (L) | Criminal justice |
| Māori Affairs | Tākuta Ferris (TPM) | Treaty issues |
| Primary Production | Mark Cameron (ACT) | Agriculture |
| Social Services | Angie Warren-Clark (L) | Welfare reform |
| Transport & Infrastructure | Nancy Lu (N) | Transport projects |

---

## Data Sources for Tracking

### Official Sources
1. **Parliament.nz** — Voting records, speeches, questions
2. **TheyWorkForYou NZ** — Aggregated activity data
3. **Electoral Commission** — Donations, expenses
4. **Beehive.govt.nz** — Ministerial releases

### Media Monitoring
1. **Stuff / NZ Herald / RNZ** — Major outlet coverage
2. **Newsroom / The Spinoff** — Political analysis
3. **Twitter/X feeds** — Direct MP statements

### Third-Party Analysis
1. **Public Address** — Policy analysis
2. **The Kākā** — Political newsletter
3. **Thomas Coughlan (Herald)** — Parliamentary reporting

---

## Tracking Priorities for 2024-2026

### High Priority MPs
- All Ministers (policy decisions)
- All Select Committee chairs (gatekeepers)
- Marginal electorate MPs (election dynamics)
- Potential leadership contenders

### Key Metrics to Track
1. **Voting attendance** — Who shows up for votes
2. **Question time participation** — Who holds Government accountable
3. **Bill sponsorship** — Who's driving legislative change
4. **Select Committee attendance** — Who does the detailed work
5. **Expense claims** — Transparency and moderation
6. **Media engagement** — Who's shaping the narrative
7. **Social media activity** — Direct communication trends

### Alert Triggers
- Any MP misses >20% of votes in a month
- Any MP claims >$50k in travel expenses
- Any MP switches parties
- Any MP faces investigation
- Any MP makes controversial public statements

---

## Data Collection Automation

### Feeds to Monitor
```
RSS/Atom:
- Parliament.nz Bills feed
- Beehive press releases
- Electoral Commission disclosures

APIs:
- Twitter/X API (MP accounts)
- Parliament API (if available)

Scraping:
- TheyWorkForYou voting records
- Select Committee minutes
- Hansard transcripts
```

### Update Frequency
- **Daily:** News mentions, social media
- **Weekly:** Voting records, questions
- **Monthly:** Expense reports, donations
- **Quarterly:** Full profile reviews

---

## Next Steps for Implementation

1. **Create structured database** (PostgreSQL or SQLite)
2. **Build scraping scripts** for automated data collection
3. **Set up monitoring alerts** for key metrics
4. **Create dashboard** for visualising MP activity
5. **Integrate with The Brief** content management

---

*Database created for The Brief project — tracking political accountability in Aotearoa New Zealand.*
