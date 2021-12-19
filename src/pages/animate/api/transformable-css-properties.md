---
layout: layout:PagesLayout
---
## Transformable CSS Properties

You can now use **single value**[^1] unitless `numbers`, `strings`, and `arrays`, you can now, also use CSS transform functions as CSS properties.

[^1]: `single value` means,

    ```ts
    animate({
        opacity: 0.5, // This will turn into `["5"]`, notice no units, this could also be a string
        translateX: 250, // This will turn into `["250px"]`, notice how it adds units, this could also be a string
        rotate: 360, // This will turn into `["360deg"]`, notice how it adds units, this could also be a string
        skew: "1.25turn", // This will turn into `["1.25turn"]`, notice how it doesn't add "deg" as the units
        left: 50, // This is actually an error, this will turn into `["50"]`, notice no units, this could also be a string. Only transform properties support automatic units
    })
    ```

Single value CSS properties use [Implicit to/from keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#implicit_tofrom_keyframes) to avoid the need for a developer to need input the initial state of a CSS property. 

> _**Warning**: If a users browser doesn't support Implicit to/from keyframes, you will run into issues. Most modern browsers now support it, but you should be carefull if you aim to support browsers less than Chrome 83_

_**Note**: dash & camel case are supported as CSS property names, this also includes transforms, so, you can use `translate-x` or `translateX`, when setting a CSS property_

_**Note**: all other features will work with Transformable CSS Properties, this includes the `keyframes` animation options and `animation options` as callbacks_

_**Warning**: only the transform function CSS properties and CSS properties with the keys ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", ,"gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing", "rotate"] will get automatic units. It will also work with multiple unit CSS properties like "margin", "padding", and "inset", etc..., however, no automatic units will be applied to any CSS properties that can accept color, this is to avoid unforseen bugs._

To properly understand all the complex transformations at work, read more about the [ParseTransformableCSSProperties](/docs/api/modules/_okikio_animate.md#parsetransformablecssproperties) method. Also, read about the [ParseTransformableCSSKeyframes](/docs/api/modules/_okikio_animate.md#parsetransformablecsskeyframes) method. 

> _**Note**: Yes, both methods may look the similar/the same but they are indeed very different methods._

### CSS Transform functions as CSS properties

Transformable CSS Properties remove the need for the full transform statement, so, if you wanted to use translate, rotate, scale, skew, or perspective including their X, Y, Z, and 3d varients, you could just specify something like this 
```ts
animate({ 
    translateX: 500, 
    translate: "20 60", 
    scale3d: "2",
    // ... 
})
``` 

Plus since all CSS properties automatically receive units, the  CSS transform function properties, do as well.Also, Transformable CSS Properties adds the ability to use single string or number values for transform functions.

_**Warning**: using the `transform` animation option will override all transform CSS properties_

_**Warning**: CSS transform function properties use CSS variables on browsers that support animating CSS variables (only Chromium based browsers support this feature at the moment), meaning on browsers that don't support this feature, animations may behave in slightly different ways. **Remember to test your animation throughly on multiple browsers**_

_**Note**: the order of `transform` functions as CSS Properties, matter. Meanwhile in keyframes the transform order doesn't matter, keep this in mind when you are try to create complex rotation based animations or other complex animations in general._

```ts
animate({
    // ...
    /*
    keyframes(index) {
        // Note, the transform property order doesn't matter when using keyframe array syntax
        return [
            { translateX: 0 },
            { translateX: (index + 1) * 250 }
        ];
    },

    // or
    translateX(index) {
        return `0, ${(index + 1) * 250}`;
    },
    */

    // Remember the transform CSS property order **MATTERS**, don't forget this, it can mess up your rotation based animations
    translate3d: [
        // It will automatically add the "px" units for you, or you can write a string with the units you want
        "25, 35, 60%",
        [50, "60px", 70],
        ["70", 50]
    ],
    translate: "25, 35, 60%",
    translateX: [50, "60px", "70"],
    translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
    translateZ: 0,
    perspective: 0,
    opacity: "0, 5",
    scale: [
        [1, "2"],
        ["2", 1]
    ],
    rotate3d: [
        [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
        [2, "4", 6, "45turn"],
        ["2", "4", "6", "-1rad"]
    ],
    opacity: [0, 1],
    "border-left": 5
})

//= {
//=   transform: [
//=       // `translateY(50, 60)` will actually result in an error
//=       'translate(25px) translate3d(25px, 35px, 60%) translateX(50px) translateY(50, 60) translateZ(0px) rotate3d(1, 2, 5, 3deg) scale(1, 2) perspective(0px)',
//=       'translate(35px) translate3d(50px, 60px, 70px) ranslateX(60px) translateY(60px) rotate3d(2, 4, 6, 45turn) scale(2, 1)',
//=       'translate(60%) translate3d(70px, 50px) translateX(70px) rotate3d(2, 4, 6, -1rad)'
//=   ],
//=   opacity: [ '0', '5' ],
//=   borderLeft: ["5px"]
//= }
```

> [Check out an example on Codepen &#8594;](https://codepen.io/okikio/pen/qBrNXoY?editors=0110)