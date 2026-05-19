# Maharlika Republic - Infrastructure & Deployment Topology

This document outlines the deployment strategy for the Maharlika Republic e-commerce platform, adhering to the Tier 4 requirements of the Master Prompt.

## 🌐 Tier 4: Deployment Topology & Infrastructure Setup

### 1. Global Edge Layer (Frontend)
- **Platform**: Vercel Edge Network or Cloudflare Pages.
- **Why**: Hosts the Next.js static UI shell and serverless API routes over regional CDN Edge Points.
- **Routing**: Traffic is routed directly through Manila/Davao nodes to achieve a Time-To-First-Byte (TTFB) under 50ms.
- **Caching**: Next.js App Router aggressively caches static assets and leverages Incremental Static Regeneration (ISR) for product pages.

### 2. Application Layer (Backend & Workers)
- **Platform**: AWS ECS (Fargate) or Railway.
- **Logic**: Runs containerized Express/Node.js logic (if separated from Next.js) and background document execution frameworks for receipt processing.
- **Scaling**: Configured to auto-scale based on real-time traffic spikes (CPU/Memory thresholds).

### 3. Database Layer (The "Nucleic" Model)
- **Platform**: Managed PostgreSQL (e.g., Supabase, Neon, or AWS RDS).
- **Topology**: Multi-Zone deployment with active automated daily backups and read replicas.
- **Reliability Target**: Enterprise-grade 99.99% system uptime window during high-volume product drop configurations.

### 4. Search Engine Layer
- **Platform**: Meilisearch Cloud or Self-hosted Meilisearch on AWS EC2/DigitalOcean.
- **Function**: In-memory edge search engine to filter multi-brand items as the user types with a strict latency threshold of under 35ms.

### 5. Asynchronous Event Broker & Storage
- **Event Broker**: Upstash (Kafka/Redis) or AWS SQS to handle the checkout webhook events asynchronously.
- **Storage**: AWS S3 or Supabase Storage for storing generated PDF invoices with immutable tracking URLs.
- **Email Delivery**: SendGrid or Postmark for dropping invoices directly into the customer's inbox.
