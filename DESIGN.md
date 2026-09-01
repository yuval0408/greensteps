# Eco Green

## Mission
Create implementation-ready, token-driven UI guidance for Eco Green that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Eco Green
- URL: http://www.ecogreenproducts.in/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=Armata`, `font.family.stack=Armata, sans-serif`, `font.size.base=12px`, `font.weight.base=400`, `font.lineHeight.base=normal`
- Typography scale: `font.size.xs=11px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=19px`
- Color palette: `color.text.primary=#85a528`, `color.text.secondary=#9f9fa5`, `color.text.tertiary=#7f7f85`, `color.text.inverse=#333333`, `color.surface.base=#000000`, `color.surface.muted=#dadada`, `color.surface.raised=#a6cd37`
- Spacing scale: `space.1=6px`, `space.2=10px`, `space.3=12px`, `space.4=14px`, `space.5=15px`, `space.6=16px`, `space.7=20px`, `space.8=22px`
- Radius/shadow/motion tokens: No reliable extraction yet; motion and shape tokens should be defined manually.

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (28), lists (3).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
