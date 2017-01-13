import React from 'react';
import CSSModules from 'react-css-modules'

import ImageViewer from './../../../src';

import styles from './demo.css';

const Demo = CSSModules(() => (
  <div>
    <ImageViewer
      image={require('./../../images/1.jpg')}
      style={{
        width: '400px',
        height: '500px',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    />
    <ImageViewer
      image={require('./../../images/1.jpg')}
      style={{
        display: 'inline-block',
        marginTop: '30px',
        width: '400px',
        height: '400px',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    />
    <ImageViewer
      styleName="image1"
      image="./images/1.jpg"
    />
    <ImageViewer
      image="./images/2.jpg"
      style={{
        marginTop: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 800,
        height: 300,
        backgroundSize: 'cover',
      }}
      config={{
        viewedImageSize: 0.4,
        backgroundOpacity: 0.9,
      }}
    />
  </div>
), styles, { allowMultiple: true });

export default Demo;
