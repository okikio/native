### padEndDelay

| Default | Type    |
| :------ | :------ |
| `false` | Boolean |

This ensures all `animations` match up to the total duration, and don't finish too early, if animations finish too early when the `.play()` method is called specific animations  that are finished will restart while the rest of the animations will continue playing.

_**Note**: you cannot use the `padEndDelay` option and set a value for `endDelay`, the `endDelay` value will replace the padded endDelay, `padEndDelay` is also ignored if `loop` is `true` or is set to `infinity`._

When creating progress/seek bars this needs to be enabled for the animation to function properly.