// src/compat/index.ts  (CONTRACT, verbatim)
/* Peer note (REQ-SURF-04): the surf/date adapters (GlassDateField,
   GlassTimeField, GlassDatePicker, GlassDateRangePicker, GlassCalendar)
   intentionally require the optional date peers — @internationalized/date
   and react-aria-components — because they bridge 4.x Date props onto the
   real src/date components. Every other compat adapter is peer-free. The
   main 'aura-glass' and 'aura-glass/data' entries never pull these peers;
   that isolation is gated by tests/data/exports/peer-isolation.test.ts on
   the built dist. */
export * from './plat';
export * from './mat';
export * from './cmp';
export * from './surf';
