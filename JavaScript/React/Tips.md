# Passing addtional props to 'children'

Let's say we have a list component which will take several child components. If a user clicks one of child component, it will be highlighted. There should be only one highlighted child component. Thus, if there was a previously highlighted child component, its state will be changed back to normal. In order to do so, list component should pass the component information that a user clicked.

- Child component

```javascript
import React, { Component, PropTypes } from 'react';

class Child extends Component {
  
  onClick = (e)=>{
    e.preventDefault();
    this.props.onClick( this.props.id );
  }

  render() {
    const textColor = this.props.clickId === this.props.id ? 'red' : 'black';
    return( 
      <div style={{ color:textColor }} onClick={ this.onClick }>
      	{ this.props.children }
      </div> 
     );
  }
}
```

## 1. Using cloneElement

```javascript
import React, { Component, PropTypes } from 'react';

class List extends Component {

  constructor(){
    super();
    this.state = { clickId: null };
  }

  _handleItemClick = (clickId) => {
    this.setState({ clickId });
  }

  _passingPropsToChildren = ()=> {
    return React.Children.map( this.props.children, child => {
      return React.cloneElement( child, {
        onClick: this._handleItemClick,
        clickId: this.state.clickId,
      });
    });
  }

  render(){
    return (
      <div>
        {this._passingPropsToChildren()}
      </div>
    );
  }
}

// This will look like below 

<List>
  <Child id={'one'}>Child one</Child>
  <Child id={'two'}>Child two</Child>
  <Child id={'three'}>Child three</Child>
</List>


```

## 2. [Function as children](https://facebook.github.io/react/docs/jsx-in-depth.html#functions-as-children)   
>Children passed to a custom component can be anything, as long as that component transforms them into something React can understand before rendering. This usage is not common, but it works if you want to stretch what JSX is capable of.

[Render callback pattern](https://morlay.gitbooks.io/react-patterns/content/en/react-patterns/render-callback.html)

```javascript
import React, { Component, PropTypes } from 'react';

class List extends Component {

  constructor(){
    super();
    this.state = { clickId: null };
  }

  _handleItemClick = (clickId) => {
    this.setState({ clickId });
  }

  render(){
    return this.props.children({ 
      clickId: this.state.clickId, 
      onClick: this._handleItemClick });
  }
}

// This will look like below 

<List>
  {(props) => {
    return(
      <div>
        <Child id={'one'} {...props}>Child one</Child>
        <Child id={'two'} {...props}>Child two</Child>
        <Child id={'three'} {...props}>Child three</Child>
      </div>
    );
  }}
</List>

```
Both work in the same way as expected. However, on the second one, we don't need to loop all children and clone.

# In which lifecycle event do you make AJAX requests and why?

AJAX requests should go in the **componentDidMount** lifecycle event.

There are a few reasons for this,

- Fiber, the next implementation of React’s reconciliation algorithm, will have the ability to start and stop rendering as needed for performance benefits. One of the trade-offs of this is that componentWillMount, the other lifecycle event where it might make sense to make an AJAX request, will be “non-deterministic”. What this means is that _React may start calling **componentWillMount** at various times whenever it feels like it needs to._ This would obviously be a bad formula for AJAX requests.

- You can’t guarantee the AJAX request won’t resolve before the component mounts. If it did, that would mean that you’d be trying to setState on an unmounted component, which not only won’t work, but React will yell at you for. Doing AJAX in componentDidMount will guarantee that there’s a component to update.

from : [React interview questions](https://tylermcginnis.com/react-interview-questions/)