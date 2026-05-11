\# LearnLanka — Requirements Document



\## 1. Problem Statement

\- One paragraph describing the user problem in your own words

\- LearnLanka is a colombo-based startup that connects O/L and A/L students with vetted tutors for one-to-one online sessions. Currently student struggle to find the tutors by their needs. such as subject, grade, language(Sinhala, Tamil, English) and price range. While the tutors needs a reliable way to manage bookings, publish slots and manage payments. 



\## 2. Personas

\- Three personas (Student, Tutor, Operations Admin) with goals and frustrations



\- Students 

* Goals: 
* Find qualified tutors online.
* book sessions based on availability. 
* learn using preferred language.



* Frustrations: 
* Finding trustworthy tutors.
* Complicated payment process.  
* difficult to compare tutors 



\- Tutor 

* Goals: 
* Publish available slots online.
* Earn weekly payouts without delays.
* Build reputation through rating. 

&#x20;

* Frustrations:
* Delayed payments.
* Finding new students for sessions. 



\- Operating Admins 

* Goals: 
* Manage Payment with Students and Tutors. 
* Ensure Tutor and student standards.



* Frustrations:
* tracking failed Payouts.



\## 3. Functional Requirements

\- Numbered list, grouped by persona, each requirement testable



Student Requirements 

* FR - 01 
* Students must be able to search tutors by subject , language, grade level, price band



* FR - 02 
* Students must be able to book a 1 hour session from available tutors



* FR - 03 
* Students must be able to pay for sessions using via card or eZ-cash.



* FR - 04
* Student must be able to rate tutors from 1-5 stars and leave one line comment after the session. 



* FR - 05 
* Students must receive booking confirmation notification after payment.



Tutor Requirements 

* FR - 06 
* Tutors must be able to publish, update and delete available slots. 



* FR - 07 
* Tutors must be able to accepts or decline booking requests. 



* FR - 08 
* Tutorials must be able to cancel booking only at least 12 hours before the session start time. 



* FR - 09 
* Tutors must receive weekly payouts via bank transfer. 



* FR - 10
* Tutors must be able to rate the students from 1-5 stars and leave one line comment after the session. 



Operational Admin

* FR - 11 
* Operational Admins must be able to view all the booking and payments. 



* FR - 12
* Operation Admins must be able to verify all the tutor verification status.



\## 4. Non-Functional Requirements

\- Table with columns: Category, Metric, Target, How we'll measure it



* Performance - Tutor search response time - Under 800ms at 95th percentile - Azure application insights monitoring 
* Availability - Booking endpoint uptime - 99.5%monthly uptime - uptime monitoring dashboard 
* Scalability - Concurrent video session - Support 200 simultaneous sessions - Load testing reports 
* Privacy - Consent Collection - 100% consent captured before account creation - Audit log verification 
* Security - Payment data - No card data stored on LearnLanka servers - Security Audit 





\## 5. Assumptions

\- Numbered list of every assumption you made because the brief was silent

\- Students and Tutors must create account before making or accepting bookings.

\- Session pricing was determined by tutors according to the predefined price bands.

\- Notification will sent through email or SMS. 

\- Ratings will only be submitted after the tutor session. 

\- All users will use Sri Lankan Standard time



\## 6. Out of Scope

\- What you are explicitly NOT building in this version

* Group tutoring sessions 
* Real time message system between student and tutor 
* Session recording
* Session reminder
* Online quiz and assignments support