# LearnLanka — User Story Set v0.1

## Story 1: Search Tutors

**As a** Student  
**I want** to search tutors by subject, grade, language, and price band  
**So that** I can find a suitable tutor  

### Acceptance Criteria
- **Given** the student searches for tutors **when** filters are selected **then** matching tutors should appear  
- **Given** no tutors are available **when** the search is made **then** a message should display  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [x] Estimable
- [x] Small
- [x] Testable

---

## Story 2: Book a Session

**As a** Student  
**I want** to book a 1-hour session  
**So that** I can learn from a tutor online  

### Acceptance Criteria
- **Given** slots are available **when** the student books a session **then** the booking should be confirmed  
- **Given** a slot is unavailable **when** booking is attempted **then** an error message should appear  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [x] Estimable
- [ ] Small
- [x] Testable

---

## Story 3: Make Payments

**As a** Student  
**I want** to pay using card or eZ Cash  
**So that** I can confirm my booking  

### Acceptance Criteria
- **Given** payment details are correct **when** payment is processed **then** the booking should be successful  
- **Given** payment fails **when** the transaction is processed **then** a failure message should appear  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [x] Estimable
- [x] Small
- [x] Testable

---

## Story 4: Publish Availability

**As a** Tutor  
**I want** to publish available time slots  
**So that** students can book sessions with me  

### Acceptance Criteria
- **Given** the tutor adds a slot **when** it is saved **then** it should appear on the schedule  
- **Given** a slot is removed **when** the action is confirmed **then** it should no longer appear  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [x] Estimable
- [x] Small
- [x] Testable

---

## Story 5: Accept or Decline Bookings

**As a** Tutor  
**I want** to accept or decline booking requests  
**So that** I can manage my schedule  

### Acceptance Criteria
- **Given** a booking request exists **when** the tutor accepts it **then** the booking status should update  
- **Given** a booking request exists **when** the tutor declines it **then** the booking should be rejected  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [x] Estimable
- [x] Small
- [x] Testable

---

## Story 6: Weekly Tutor Payments

**As a** Operations Admin  
**I want** tutors to receive weekly payments  
**So that** tutor earnings can be managed properly  

### Acceptance Criteria
- **Given** completed sessions exist **when** payouts are processed **then** tutor payments should be calculated  
- **Given** payment transfer fails **when** payouts are processed **then** the admin should receive a notification  

### INVEST self-check
- [x] Independent
- [x] Negotiable
- [x] Valuable
- [ ] Estimable
- [ ] Small
- [x] Testable