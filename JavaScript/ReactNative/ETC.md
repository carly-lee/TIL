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