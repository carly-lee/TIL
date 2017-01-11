# ETC

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

- Jest setup on package.json

```javascript
"jest": {
    "preset": "react-native",
    "verbose": true,
    "timers": "fake", // No need to wait actual time 
    "setupFiles": [
      "./jest/setup.js" // Mock fetch, native modules etc... 
    ],
    "modulePaths": [
      "<rootDir>/src/" // In order to resolve nested relative paths.
    ],
    "moduleNameMapper": {
      "^image![a-zA-Z0-9$_-]+$": "GlobalImageStub",
      "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$": "RelativeImageStub",
      "module-name-want-to-mock": "<rootDir>/__mocks__/module-name-want-to-mock.js"
    },
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/android/",
      "/iOS/"
    ],
    "haste": {
      "defaultPlatform": "ios", // When this value is changed, the test process is also different.
      "platforms": [
        "ios",
        "android",
        "native"
      ],
      "providesModuleNodeModules": [
        "react-native" // There should be only 'react-native'.
        // Even through there is 'react' as well in the example on the website, 
        // but if you put 'react' here, it causes a duplicate declaration error.
      ]
    }
  }
```
## Useful links for react-native unit testing   

- [Facebook react native jest setup](https://github.com/facebook/react-native/blob/master/jest/setup.js)   
- [AsyncStroage test mock](https://github.com/jasonmerino/react-native-simple-store/blob/master/__tests__/index-test.js#L31-L64)   
- [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock)