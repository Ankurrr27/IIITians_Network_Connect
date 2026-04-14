# IIITians Network

IIITians Network is a community website built to connect students, alumni, and campus communities across IIITs in India.

The platform brings important parts of student life into one place, including college discovery, events, placements, alumni connections, and the team behind the initiative.

## What You Can Do

- Explore IIIT colleges
- Check events and updates
- Browse placement information
- Search the alumni directory
- View the team page
- Contact the IIITians Network team

## Alumni Section

The alumni section is designed to be more trusted and useful.

- Users can submit their alumni profile through a request form
- Alumni are not shown instantly after submission
- Every request is reviewed by an admin first
- Only approved alumni appear in the public alumni directory

## Admin Features

The website also includes a protected admin area for managing content.

- Review alumni requests
- Accept or reject alumni submissions
- Manage events, team, and placement updates
- Super admin can add other admins

## Purpose

The goal of IIITians Network is to create a shared digital space for the IIIT community where students can discover opportunities, stay informed, and build stronger connections with alumni and peers.

## Live Project

Frontend: [iiitians-network-connect.vercel.app](https://iiitians-network-connect.vercel.app/)  
Backend API: [iiitians-network-connect.onrender.com](https://iiitians-network-connect.onrender.com/)

## Author

Built by Ankur.

## Release Notes

### Version 2.1.0 Platform Update

**Security & Administration**
* **Access Control:** Deployed a verified URL gateway for the admin login terminal, eliminating unauthorized public access attempts.
* **Operations Alerting:** Integrated a persistent, real-time alert banner on the dashboard to flag queued legacy requests requiring immediate moderator action.

**Interface Architecture**
* **UI Standardization:** Migrated the notification engine and asset processing module (image cropper) to a high-fidelity frosted glass rendering system. Notifications now enforce maximum contrast in all environments, and the cropper enforces strict aspect ratios (e.g., 16:7 for institutions).
* **Data Aggregation:** College entity profiles now automatically calculate and display active campus club volumes via a distinct UI metric.
* **Layout Optimization:** Adjusted viewport rendering coordinates across the Directory and Legacy modules for cleaner typographic hierarchy.

**Core Infrastructure**
* **Network Connectivity:** Resolved internal CORS preflight interruptions by explicitly accepting caching and credential directives on the backend.
* **Environment Mapping:** Corrected local development routes to properly address local server pipelines, preventing cross-environment API leakages.
