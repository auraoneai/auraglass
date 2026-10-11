# consumer-4x / cmp cases (CMP-426)

Real 4.x usage covering the CMP-owned surface: GlassButton, GlassInput,
GlassSelectCompound, GlassSwitch, GlassCheckbox, GlassModal, GlassDrawer,
GlassPopover, GlassTooltip, GlassDropdownMenu, GlassToast, GlassCard,
Typography (deep import — Typography was never root-exported on 4.x).

These files must compile unchanged on every 4.x minor and, after
`aura-glass migrate 5`, produce zero `TODO(aura-glass 5)` markers on
mechanically mappable props (G-08). PLAT's tests/fixtures/consumer-4x
harness (lane L11) compiles and migrates them.
