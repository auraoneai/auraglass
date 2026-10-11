# Contract amendment — date fields vs CMP Field parts (REQ-CMP-57)

`DateField`, `DatePicker`, `DateRangePicker`, and `TimeField` are React Aria
Components (RAC) streams. Their `label` / `description` / `errorMessage` props
map to RAC `Label` / `Text[slot=description]` / `FieldError` — RAC owns the
`aria-describedby` wiring through its own field context, in
description-then-error order.

Wrapping those slots in CMP `Field.Root` / `Field.Label` / `Field.Description` /
`Field.Error` is not possible: Base UI `Field` parts read Base UI's field
context, which is absent inside a RAC field subtree, so the describedby ids
would never register. This file is the documented amendment the REQ allows:
the date stream keeps RAC-owned field slots and satisfies the same
accessibility contract (label + description-before-error describedby order)
through RAC's implementation.
