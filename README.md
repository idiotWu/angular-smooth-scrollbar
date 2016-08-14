# angular-smooth-scrollbar

[![npm](https://img.shields.io/npm/v/angular-smooth-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/angular-smooth-scrollbar)
[![npm](https://img.shields.io/npm/dt/angular-smooth-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/angular-smooth-scrollbar)
[![npm](https://img.shields.io/npm/l/angular-smooth-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/angular-smooth-scrollbar)
[![Travis](https://img.shields.io/travis/idiotWu/angular-smooth-scrollbar.svg)](https://travis-ci.org/idiotWu/angular-smooth-scrollbar)

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
    <link rel="stylesheet" href="smooth-scrollbar/dist/smooth-scrollbar.css">

    <script src="angular.js"></script>
    <script src="smooth-scrollbar/dist/smooth-scrollbar.js"></script>
    <script src="angular-smooth-scrollbar/dist/angular-smooth-scrollbar.js"></script>
    ```

2. Add `SmoothScrollbar` as dependency to your angular app:

    ```javascript
    angular.module('myApp', ['SmoothScrollbar']);
    ```

3. Use it wherever you want:

    - As element:

        ```html
        <scrollbar name="scrollbar_name">
            ...
        </scrollbar>
        ```

    - As attribute:

        ```html
        <section scrollbar="scrollbar_name">
            ...
        </section>
        ```

### Available Options

| parameter | type | default | description |
| :--------: | :--: | :-----: | :---------- |
| name | `string@` | N/A | Naming current scrollbar. |
| speed | `number=` | 1 | Scrolling speed scale. |
| damping | `number=` | 0.1 | Delta reduce damping, a float value between (0, 1), the lower the value is, the more smooth the scrolling will be. |
| thumbMinSize | `number=` | 20 | Minimal size for scrollbar thumb. |
| syncCallbacks | Boolean | false | Execute listeners in synchronous or asynchronous. |
| renderByPixels | `boolean=` | true | Render scrolling by integer pixels, set to `true` to improve performance. |
| alwaysShowTracks | `boolean=` | false | Keep scrollbar tracks visible whether it's scrolling or not. |
| continuousScrolling | `boolean=`\|`string=` | 'auto' | Whether allow upper scrollable content to continue scrolling when current scrollbar reaches edge. **When set to 'auto', it will be enabled on nested scrollbars, and disabled on first-class scrollbars.** |
| overscrollEffect | `boolean=`\|`string=` | false | Experimental overscroll effect, `'bounce'` for iOS style effect and `'glow'` for Android style effect. **Be careful when you enable this feature!** |
| overscrollEffectColor | `string@` | '#87ceeb' | Canvas paint color with 'glow' effect. |
| overscrollDamping | Number | 0.2 | The same as `damping`, but for overscrolling. |

**Confusing with the option field? Try edit tool [here](http://idiotwu.github.io/smooth-scrollbar/)!**

## ScrollbarServiceProvider

You can configure default scrollbar behavior here:

```javascript
angular.module('myApp', ['SmoothScrollbar'])
.config((ScrollbarServiceProvider) => {
    // set default scrollbar behavior
});
```

### ScrollbarServiceProvider.setDefaultOptions( options )

Set default scrollbar options for your angular app.


## ScrollbarService

By **given scrollbar a name via attribute**, you can access your scrollbar instances through `ScrollbarService`.

```html
    <scrollbar name="myScrollbar">...</scrollbar>
```

```javascript
app.controller('MyCtrl', (ScrollbarService) => {
    const myScrollbar = ScrollbarService.getInstance('myScrollbar');
    ...
});
```

### ScrollbarService.generateName()

Return a timestamp string, this will be useful while trying naming scrollbars uniquely.

### ScrollbarService.getInstance( name )

Get scrollbar instance by giving the name, and return a promise with instance.

### ScrollbarService.destroyInstance( name )

Destroy scrollbar with the given name.

## APIs

[Documents](https://github.com/idiotWu/smooth-scrollbar#apis)

## License

MIT.
