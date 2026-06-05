- [x] Update app/page.tsx for mobile-first layout (<768px):
  - [ ] Wrap root with flex flex-col md:flex-row min-h-screen overflow-x-hidden

  - [ ] Hide desktop sidebar on mobile and add md:hidden mobile header
  - [ ] Ensure main content uses w-full max-w-screen overflow-x-hidden px-4 md:px-6
- [x] Update components/media-player.tsx:
  - [x] Set fixed footer container to `fixed bottom-0 left-0 right-0 w-full`
  - [x] Remove/adjust left/right insets on mobile
  - [x] Ensure all text/artwork/control containers use min-w-0 / w-full to prevent overflow
  - [x] Reduce min-w constraints on mobile
- [x] Update components/playlist-section.tsx:
  - [x] Add mobile simplified row layout (no extra columns) + responsive header
  - [x] Use truncate/min-w-0 and responsive grid columns for md+
- [ ] Validate: run dev server + manually check <768px for no overflow-x and proper spacing.

