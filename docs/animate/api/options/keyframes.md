### keyframes

| Default | Type                                                                                                                                                                                   |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[]`    | TypeCSSLikeKeyframe \| ICSSComputedTransformableProperties[] & Keyframe[] \| object[] \| [TypeCallback](/docs/api/modules/_okikio_animate.md#typecallback) |

I highly suggest going through the API documentation to better understand [keyframes](/docs/api/interfaces/_okikio_animate.ianimationoptions.md#keyframes).

Allows you to manually set keyframes using a `keyframe` array

Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/setKeyframes).

An `array` of objects (keyframes) consisting of properties and values to iterate over. This is the canonical format returned by the [getKeyframes()](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/getKeyframes) method.

`@okikio/animate` also offers another format called `CSSLikeKeyframe`, read more about [KeyframeParse](/docs/api/modules/_okikio_native.md#keyframeparse)

It basically functions the same way CSS's `@keyframe` works.

_**Note**: the order of `transform` functions in CSS Property form...matter, meanwhile in keyframes the transform order doesn't, keep this in mind when you are try to create complex rotation based animations or other complex animations in general._

```ts
animate({
     keyframes: {
         "from, 50%, to": {
             opacity: 1
         },
         "25%, 0.7": {
             opacity: 0
         }
     }
})

// Results in a keyframe array like this
//= [
//=   { opacity: 1, offset: 0 },
//=   { opacity: 0, offset: 0.25 },
//=   { opacity: 1, offset: 0.5 },
//=   { opacity: 0, offset: 0.7 },
//=   { opacity: 1, offset: 1 }
//= ]
```