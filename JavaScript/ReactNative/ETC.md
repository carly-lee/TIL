# ETC

- Checks the size of component after it's rendered      

> [onLayout function](http://facebook.github.io/react-native/releases/0.40/docs/view.html#onlayout)    
> Invoked on mount and layout changes with:   
>
> { nativeEvent: { layout: { x, y, width, height }}}   
>
> This event is fired immediately once the layout has been calculated, but the new layout may not yet be reflected on the screen at the time the event is received, especially if a layout animation is in progress.

```javascript
_onLayout({nativeEvent: { layout: {x, y, width, height}}}){
  // Do something
}

<View onLayout={this._onLayout} />
```
[Video lecture](https://egghead.io/lessons/react-measure-and-get-the-position-of-a-react-native-element)

- Calculates the offset between the components.

```js
import { UIManager, findNodeHandle } from 'react-native';

UIManager.measureLayout(
          findNodeHandle(this.childRef),
          findNodeHandle(this.parentRef),
          (msg) => errorCallback(),
          (offsetX, offsetY, width, height) => {
            successCallback();
          },
        );
```
[Beyond Toasts](https://facebook.github.io/react-native/docs/native-modules-android#beyond-toasts)

---

- [Command failed: xcrun instruments -s](http://stackoverflow.com/questions/39778607/error-running-react-native-app-from-terminal-ios)  
xcrun: error: unable to find utility "instruments", not a developer tool or in PATH

- [Unit testing React Native component with Mocha and Enzyme](http://valuemotive.com/2016/08/01/unit-testing-react-native-components-with-mocha-and-enzyme/)

- [yarn install package from private github repo through ssh](https://github.com/yarnpkg/yarn/issues/513)  
```bash
npm install <git remote url>:
```
Installs the package from the hosted git provider, cloning it with git.  
First it tries via the https (git with github) and if that fails, via ssh.

```bash
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish>]
```

<protocol> is one of git, git+ssh, git+http, git+https, or git+file. If no <commit-ish> is specified, then master is used.

```javascript
before : "package-name": "git@github.com:<user>/<repo>.git"
after : "package-name": "git://github.com/<user>/<repo>.git" 
// or 
"package-name": "git+ssh://github.com/<user>/<repo>.git"
```