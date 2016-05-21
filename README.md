# react-image-viewer

## Demo
![demo](https://raw.githubusercontent.com/foisonocean/react-image-viewer/media/media/demo.gif)

## Installation
```
npm install react-image-viewer
```

## Usage
```jsx
class Demo extends React.Component {
  render() {
    const style = {
      width: 400,
      height: 300,
      backgroundSize: 'cover'
    };
    const config = {
      viewedImageSize: 0.8,
      backgroundOpacity: 0.6
    };
    return (
      <div>
        <ImageViewer
          style={style}
          config={config}
          image="http://***"
        />
      </div>
    );
  }
}
```
