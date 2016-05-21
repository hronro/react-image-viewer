import React from 'react';

import ImageViewer from './../../../src';

import './demo.css';

const Demo = () => (
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
      className="image1"
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
);

export default Demo;
