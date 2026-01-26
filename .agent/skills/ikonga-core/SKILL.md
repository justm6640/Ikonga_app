---
name: ikonga-core
description: Guidelines for IKONGA's mathematical logic, Prisma patterns, and core system architectures.
---

# IKONGA Core Skill

This skill documents the critical backend systems and mathematical foundations of the IKONGA platform.

## Mathematical Engines

### 1. Metabolic Calculators (`lib/engines/calculators.ts`)
- **PISI (Poids Idéal Santé Ikonga)**: Calculated based on height and gender. Central to all loss projections.
- **IMC (Indice de Masse Corporelle)**: Standard BMI calculation.
- **Age**: Calculated from birthDate.

### 2. IKONGA Mathematical Engine (`lib/engines/math-engine.ts`)
- **Loss Projection**: Calculates the target weight for the end of each phase.
- **Phase Durations**: Standard durations (e.g., 21 days for Phase 1).
- **Session Timing**: 10-day cycles or specific phase lengths.

## Database & Prisma Patterns

### 1. User Model
- `hasCompletedOnboarding`: Critical flag for dashboard redirection.
- `startDate`: The actual start of the 12-week program.
- `gender`: MALE, FEMALE, OTHER (Enums).

### 2. Temporal Logic
- Always normalize dates to midnight (`startOfDay`) when comparing logs or calculating phase progress to avoid timezone/hour discrepancies.
- Use `differenceInCalendarDays` for accurate countdowns.

### 3. Self-Healing Actions
- Common pattern: Check if Prisma user exists during auth/onboarding; if not, create on the fly using Supabase metadata (`getOrCreateUser`).

## Workflow Best Practices

1.  **Migrations**: Use `pnpm prisma db push` for rapid development, but ensure pooled vs direct connection strings are handled (Port 5432 vs 6543).
2.  **Transactions**: Use `$transaction` for operations involving User, Phases, and Initial Logs (e.g., in `submitOnboarding`).
3.  **Revalidation**: Always `revalidatePath("/dashboard")` and other affected routes after server actions.

## Onboarding Orchestration
- **Progressive Flow**: WELCOME -> PROFILE -> QUESTIONNAIRE -> SCHEDULE -> ANALYSIS -> COMPLETE.
- **Skip Logic**: `skipOnboarding` action allows entry with minimal data (firstName, email).
