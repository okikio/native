## Limitations

### CSS & SVG Animations Support

> _**Warning**: Techinically the `d` attribute is supported in Chromium based browsers, but litterarly no one else supports it so, be carefull and take the following list of attributes with a grain of salt, make sure to test them in the browser enviroments you expect them to be used in._

`Animate` can animate `~197` CSS properties; [MDN Animatable CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) and `~63` SVG properties; [MDN SVG Presentation Attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation).

The animatable CSS properties are:

- backdrop-filter
- background
- background-color
- background-position
- background-size
- block-size
- border
- border-block-end
- border-block-end-color
- border-block-end-width
- border-block-start
- border-block-start-color
- border-block-start-width
- border-bottom
- border-bottom-color
- border-bottom-left-radius
- border-bottom-right-radius
- border-bottom-width
- border-color
- border-end-end-radius
- border-end-start-radius
- border-image-outset
- border-image-slice
- border-image-width
- border-inline-end
- border-inline-end-color
- border-inline-end-width
- border-inline-start
- border-inline-start-color
- border-inline-start-width
- border-left
- border-left-color
- border-left-width
- border-radius
- border-right
- border-right-color
- border-right-width
- border-start-end-radius
- border-start-start-radius
- border-top
- border-top-color
- border-top-left-radius
- border-top-right-radius
- border-top-width
- border-width
- bottom
- box-shadow
- caret-color
- clip
- clip-path
- offset-distance
- color
- [etc...](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)

The animatable SVG properties are:

- alignment-baseline
- baseline-shift
- clip
- clip-path
- clip-rule
- color
- color-interpolation
- color-interpolation-filters
- color-profile
- color-rendering
- cursor
- d (only on Chromium browsers)
- direction
- display
- dominant-baseline
- enable-background
- fill
- fill-opacity
- fill-rule
- filter
- flood-color
- flood-opacity
- font-family
- font-size
- font-size-adjust
- font-stretch
- font-style
- font-variant
- font-weight
- letter-spacing
- lighting-color
- marker-end
- marker-mid
- marker-start
- mask
- opacity
- overflow
- pointer-events
- shape-rendering
- solid-color
- solid-opacity
- stop-color
- stop-opacity
- stroke
- stroke-dasharray
- stroke-dashoffset
- stroke-linecap
- stroke-linejoin
- stroke-miterlimit
- stroke-opacity
- stroke-width
- text-anchor
- text-decoration
- text-rendering
- transform
- vector-effect
- visibility
- word-spacing
- writing-mode
- [etc...](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)

Unfortunately, morphing SVG paths via the `d` property isn't well supported yet, as Gecko (Firefox) & Webkit (Safari) based browsers don't natively support it yet, and there are other limitations to what the Web Animation API will allow 😭, these limitation are covered in detail by an article published by Adobe about [the current state of SVG animation on the web](https://blog.adobe.com/en/publish/2015/06/05/the-state-of-svg-animation.html#gs.pihpjw). 

However, animation using motion paths is now possible through [Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path), and morphing can be emulated through  [tweenAttr](/docs/animate/api/tween-attributes.md).