# angular-smooth-scrollbar

[smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) for angular projects.

## Requirements

Angular 1.4+

## Install

Via npm:

```
npm install angular-smooth-scrollbar --save
```

Or via bower:

```
bower install angular-smooth-scrollbar --save
```

## Demo

[http://idiotwu.github.io/angular-smooth-scrollbar/](http://idiotwu.github.io/angular-smooth-scrollbar/)


## Usage

1. Include all dependencies in your page file:

    ```html
    <link rel="stylesheet" href="smooth-scrollbar/dist/smooth_scrollbar.css">

    <script src="angular.js"></script>
    <script src="smooth-scrollbar/dist/smooth_scrollbar.js"></script>
    <script src="angular-smooth-scrollbar/dist/angular-smooth-scrollbar.js"></script>
    ```

2. Add `SmoothScrollbar` as dependency to your angular app:

    ```javascript
    angular.module('myApp', ['SmoothScrollbar']);
    ```

3. Use it wherever you want:

    - As element:

        ```html
        <scrollbar name="scrollbarName">
            ...
        </scrollbar>
        ```

    - As attribute:

        ```html
        <section scrollbar="scrollbarName">
            ...
        </section>
        ```

### Available Options

| parameter | default | description |
| :--------: | :--: | :-----: | :----------: |
| name | Date.now().toString(32) | passed through `scrollbar` or `name` attribute, determine the name for this scrollbar instance. |
| speed | 1 | scrolling speed |
| stepLength | 50 | how long each scrolling is (px/delta) |
| easingDuration | 1000 | how long will easing takes after `touchend` event |
| easingCurve  | cubic-bezier(0.1, 0.57, 0.1, 1) | easing timing function, either css `timing-function` or pre-defined curves [here](http://easings.net/en)|

## ScrollbarService

By given scrollbar a name via attribute, you can access your scrollbar instances through `ScrollbarService`.

### ScrollbarService.getInstance( name )

Get scrollbar instance by giving the name, and return a promise with instance.

### ScrollbarService.destroyInstance( name )

Remove all event listeners on the named instance, but will not remove scrollbar from DOM.

## APIs

[Documents](https://github.com/idiotWu/smooth-scrollbar#apis)

## License

MIT.
