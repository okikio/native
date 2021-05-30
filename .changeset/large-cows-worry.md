---
"@okikio/animate": minor
"@okikio/native": patch
---

support dashed css properties; add more auto unit css properties

You can now use both camelCase and dashed CSS properties; more CSS properties now support auto units by default all CSS properties with that have a name in this list ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", "gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing"], this includes margin, padding, and inset, with thier mult value support, "5% 6 7 8", etc... Warning: all CSS properties that can accept color as a value are disallowed from auto units.
