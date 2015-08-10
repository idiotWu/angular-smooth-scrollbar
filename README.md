# angular-smooth-scrollbar

An angular module that helps you to customize high performance scrollbar.

## Install

```
bower install angular-smooth-scrollbar --save
```

## Demo

[http://idiotwu.github.io/angular-smooth-scrollbar/](http://idiotwu.github.io/angular-smooth-scrollbar/)

## Why is native scrolling slow?

As is explained in [this article](http://www.html5rocks.com/en/tutorials/speed/scrolling/), browser repaint every frame in scrolling. **Less painting is better.**

To avoid repainting, I use `translate3d` in scroll content to create composite layers and force hardware accelerating.

## Usage

1. Include the script and stylesheet in your page file:

    ```html
    <link rel="stylesheet" href="bower_components/angular-smooth-scrollbar/dist/smooth-scrollbar.css">

    <script src="bower_components/angular-smooth-scrollbar/dist/smooth-scrollbar.js"></script>
    ```

2. Add `SmoothScrollbar` as dependency to your angular app:

    ```javascript
    angular.module('myApp', ['SmoothScrollbar']);
    ```

3. Use it wherever you want:

    ```html
    <section scrollbar="scrollbarName">
        ...
    </section>
    ```

### Available Options

- name(required): passed throught `scrollbar` attribute, determine the name for this scrollbar instance.
- speed: scrolling speed, default is `1`.
- stepLength: wheel scroll step length (px/delta), default is `50`.
- easingDuration: swipe easing duration (ms), default is `1000`.
- easingCurve: cubic bezier easing function, you can use either css `timing-function` or pre-defined curves [here](http://easings.net/en), default is `easeOutCubic`.

## ScrollbarService

You can access your scrollbar instances through `ScrollbarService`.

### ScrollbarService.getInstance( name, cb )

Get scrollbar instance by giving the name, and instance is passed through callback function. If the named instance is already existed, callback will be invoked as soon as possible, otherwise callback will not be called until that instance is create.

### ScrollbarService.destroyInstance( name )

Remove all event listeners on the named instance, but will not remove scrollbar from DOM.

## APIs

Scrollbar instance has exposed some methods so that you can controll the scrollbar.

### instance#getSize()

Return the size of scrollbar container and scroll content, it may be something like this:

```javascript
{
    container: {
        width: 600,
        height: 400
    },
    content: {
        width: 1000,
        height: 3000
    }
}
```

### instance#update()

Update the scrollbar right now. This will be useful when you modified scroll content.

If you don't do this manually, scrollbar will be updated everytime you start scrolling (a rest(100ms) after continuous scrolling will terminate current scroll action, and when you start scrolling again, `update` will be called).

### instance#setPosition( x, y )

This method behaves like DOM method `element.scrollTo`, scroll content will be set to the given position without transition.

### instance#scrollTo( x, y, duration )

When you want to scroll content to position with easing animation, use this method.

### instance#addListener( cb )

Register scrolling listener to scrollbar instance, callback will be invoked in every small scrolling.

**Be careful not to add time consuming listeners that will slow down scrolling.**

### instance#removeListener( fn )

Remove the given listener from listeners list.

### instance#infiniteScroll( cb, threshold )

This is another useful method when you want to make infinite scrolling. Callback will be invoked the first time you scroll to given threshold, then when you scrolling over threshold again.

## TODO: A better inertial scrolling algorithm

Smooth scrollbar will calculate you touch moving speed, and scroll to a distance of `speed * easingDuration` more when you stop. This algorithm is not same as what the inertial scrolling is in mobile devices.

I've tried using uniformly accelerated motion, but it worked so bad that i have to use `cubic-bezier` easing. If any one has an idea about this, please create an issue or make a pull request, thx.