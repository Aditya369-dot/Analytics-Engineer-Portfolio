# Public knowledge library

This directory is the Markdown authoring source for future portfolio retrieval and graph data. Application components must consume validated generated data, never parse Markdown in the browser.

Supported record types:

- `profile`
- `experience`
- `project`
- `skill`
- `technology`
- `certification`
- `education`
- `personal`

Required frontmatter:

```yaml
---
id: stable-record-id
type: project
title: Record title
visibility: public
tags:
  - example-tag
related: []
---
```

Optional timeline and link metadata:

```yaml
timeline:
  startDate: 2099-01
  endDate: present
  label: Example period
links:
  - label: External reference
    href: https://example.com
    kind: external
```

The Markdown body is the long-form knowledge. Its `# Summary` paragraph becomes the canonical `shortSummary`.

Rules:

- Only `visibility: public` records are written to the generated application dataset.
- IDs must be unique and relationships must resolve.
- A public record may not relate to a private record.
- Never add private notes, secrets, or unverified personal and career claims.
- `README.md` files are documentation and are not parsed as records.
- Run `npm run knowledge:validate` before `npm run knowledge:build`.
