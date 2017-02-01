# Unit Testing 

## Set up

```javascript
// package.json
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

```javascript
```

```javascript
class TestComponent extends Component {
  name; // component variable. 

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    answer: PropTypes.func.isRequired,
    beenCalled: PropTypes.bool
  }

  constructor(){
    super();
    this.name = 'Candy';
  }

  componentWillReceiveProps( nextProps ){
    if( nextProps.beenCalled ){
      this.props.answer();
    }
  }

  _onPress = ()=>{
    this.props.onPress( this.name );
  }

  render(){
    return(
      <View>
        <Text>Hello world</Text>
        <Button
          onPress={ this._onPress }
          title="How are you?"
          accessibilityLabel="How are you?"
        />
      </View>
    )
  }
}
```

## Testing

- ### Snapshot Testing

```javascript
it('renders correctly',()=>{
  const tree = renderer.create( <TestComponent {...props} /> );
  expect( tree ).toMatchSnapshot();
});
```

- ### Checking the component's variable 
It is used in the component but doesn't trigger 'render'.

```javascript
const instance = renderer.create( <TestComponent {...props} /> ).getInstance();
expect( instance.name ).toEqual( 'Candy' );
```

- ### Checking if the component calls given callback or not when props changed  

I used '[enzyme](https://github.com/airbnb/enzyme)' which is made by Airbnb for easier  unit testing on React.

```javascript
const answer = jest.fn();

it('calls answer() when the beenCalled is set true', ()=>{
  const wrapper = shallow(<TestComponent beenCalled={false} answer={answer} onPress={onPress} />);
  expect(answer).not.toBeCalled();
  wrapper.setProps({ beenCalled: true }); 
  expect(answer).toBeCalled();
});
```

- ### Checking if the component calls given callback when it is pressed 

```javascript
const _onPress = jest.fn();

it('calls answer() when the beenCalled is set true', ()=>{
  const wrapper = shallow(<TestComponent beenCalled={false} answer={answer} onPress={_onPress} />);
  expect( _onPress ).not.toBeCalled();
  wrapper.find('Button').simulate( 'press' );
  expect( _onPress ).toBeCalled();
  expect( _onPress ).toBeCalledWith( 'Candy' ); // When checks arguments 
});
```

- ### Checking if the component displays the right contents

```javascript
it('displays \'Hello world\'', ()=>{
  const wrapper = shallow(<TestComponent {...props} />);
  expect( wrapper.find('Text').length ).toEqual( 1 );
  expect( wrapper.find('Text').children().node ).toEqual( 'Hello world' );
});
```

## Mock 

- ### Mock native modules on setup file.

```javascript
// ./jest/setup.js
const mockEmptyObject = {};
export const mockNativeModules = {
  BuildInfo: {
    appVersion: '0',
    buildVersion: '0',
  },
  FacebookSDK: {
    login: jest.fn(),
    logout: jest.fn(),
    queryGraphPath: jest.fn((path, method, params, callback) => callback()),
  },
  UIManager: {
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
    Dimensions: {
      window: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
      },
    },
    ModalFullscreenView: {
      Constants: {},
    },
    ScrollView: {
      Constants: {},
    },
    View: {
      Constants: {},
    },
  },
  WebSocketModule: {
    connect: jest.fn(),
    send: jest.fn(),
    sendBinary: jest.fn(),
    ping: jest.fn(),
    close: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  }
};

Object.keys(mockNativeModules).forEach(module => {
  try {
    jest.doMock(module, () => mockNativeModules[module]); 
  } catch (e) {
    jest.doMock(module, () => mockNativeModules[module], {virtual: true});
  }
});

jest
  .doMock('NativeModules', () => mockNativeModules)
  .doMock('ReactNativePropRegistry', () => ({
    register: id => id,
    getByID: () => mockEmptyObject,
  }));

jest.doMock('requireNativeComponent', () => {
  const React = require('react');

  return viewName => props => React.createElement(
    viewName,
    props,
    props.children,
  );
});
```

- ### redux store 

```javascript
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore( middlewares );

export default mockStore;
```

## Useful links for react-native unit testing   

- [Facebook's React Native jest setup](https://github.com/facebook/react-native/blob/master/jest/setup.js) 
- [React Native - ReactTestRenderer](https://github.com/facebook/react/tree/master/src/renderers/testing)  
- [AsyncStroage test mock](https://github.com/jasonmerino/react-native-simple-store/blob/master/__tests__/index-test.js#L31-L64)   
- [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock)
- [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) 