# newslabs-cdn
General cdn website for generic files, images, common js libraries etc

## Usage in a React project

Following 'getting started' instructions at https://github.com/facebookincubator/create-react-app one ends up with an empty and functional React Single Page App.

**The following changes were made to just two as-supplied files:**

*src/App.js* now contains
```import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```
The important departure from the as-supplied file is removal of the `<header>` element.

*public/index.html* now contains (comments removed here):
```<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">

    <meta name=application-name content=ReactDemo>
    <meta name=author content=Dave>

    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">

    <script src=https://bbc.github.io/newslabs-cdn/app.js></script>

  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
  </body>
</html>
```
The important changes from the as-supplied file is addition of the two `<meta>` tags (`application-name` & `author`), and the addition of the `<script src=https://bbc.github.io/newslabs-cdn/app.js></script>` line.
