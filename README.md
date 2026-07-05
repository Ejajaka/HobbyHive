# HobbyHive

A skill-sharing and freelance marketplace that connects **freelancers** offering creative skills (painting, photography, and more) with **recruiters** looking to hire talent — plus a learning track for people who want to pick up a new skill from scratch.

🔗 **Live demo:** [singular-kringle-5f87fe.netlify.app/homepage](https://singular-kringle-5f87fe.netlify.app/homepage)

## Overview

HobbyHive is a two-sided platform:

- **Freelancers** can build a profile, showcase their work, browse gigs, and get discovered by recruiters.
- **Recruiters** can browse freelancer profiles, post activity, and manage their own dashboard.
- Anyone can explore **skill courses** (e.g. painting, photography) and track progress toward becoming an instructor.

## Features

-  Authentication flow — sign up, sign in, forgot/reset password
-  Freelancer home page and public profile pages
-  Recruiter dashboard, activity page, and profile page
-  **SkillGig** — gig discovery for freelance work
-  **SkillSwap** — trade/exchange skills with other users
-  Skill course pages (e.g. painting, photography) with a path to becoming an instructor
-  Wishlist and "My Courses" tracking
-  Success stories, About Us, Help Center, Community Guidelines, and Terms & Conditions pages
- Separate loading/landing states for freelancers vs. recruiters

## Tech Stack

- HTML, CSS, JavaScript (vanilla)
- `js/auth.js` — handles client-side authentication logic
- Deployed on **Netlify**

## Project Structure

```
hobbyhive-project/
├── pages/                 # General/public pages
│   ├── homepage.html
│   ├── aboutus.html
│   ├── aboutus after logginin.html
│   ├── success stories.html
│   └── success stories after logging in.html
├── auth/                  # Authentication flow
│   ├── sign-in.html
│   ├── sign-up.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   ├── loading_freelancer.html
│   ├── loading_recruiter.html
│   └── js/
│       └── auth.js
├── freelancer/            # Freelancer-facing pages
│   ├── freelancer home page.html
│   └── freelancers profile page.html
├── recruiter/             # Recruiter-facing pages
│   ├── recruiter dashboard.html
│   ├── recruiter activitypage.html
│   ├── recruiter profile page.html
│   ├── aboutus after loggining recruiter.html
│   └── success stories after logging in recruiter.html
├── courses/                # Skill courses & gig features
│   ├── skillgig.html
│   ├── skillswap.html
│   ├── skill course page.html
│   ├── content-painting.html
│   ├── content-photography.html
│   ├── howToBecomeInstructor.html
│   ├── mycourse.html
│   └── wishlist.html
├── legal/                  # Policy & support pages
│   ├── community guidelines.html
│   ├── helpcenter.html
│   └── terms and conditions.html
└── website.txt
```

> **Note:** All page-to-page links use CDN assets (Tailwind, Pexels images) or absolute Netlify routes, except within `auth/`, where `sign-in.html`, `sign-up.html`, `forgot-password.html`, and `reset-password.html` reference each other and `js/auth.js` via relative paths — that's why those stay grouped together in one folder.

## Getting Started

This is a static HTML/CSS/JS project — no build step required.

1. Clone the repo:
   ```bash
   git clone https://github.com/Ejajaka/HobbyHive.git
   cd HobbyHive
   ```
2. Open `homepage.html` directly in your browser, or serve the folder with a simple local server:
   ```bash
   npx serve .
   ```

