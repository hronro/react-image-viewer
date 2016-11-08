import React, { Component, PropTypes } from 'react';
import stylePropType from 'react-style-proptype';

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);

    const defaultConfig = {
      viewedImageSize: 0.9,
      backgroundOpacity: 0.4,
      stretchFromAnimate: true,
    };

    this.config = Object.assign({}, defaultConfig, this.props.config);

    this.constainerStyle = {
      position: 'relative',
      left: 0,
      top: 0,
      backgroundImage: `url("${props.image}")`,
      opacity: 1,
      transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1)',
      zIndex: 10,
    };
    this.viewedContainerStyle = {
      zIndex: 20,
    };

    this.state = {
      isLoaded: false,
      isViewing: false,
      imageComputedStyle: {
        width: 0,
        height: 0,
      },
      translateX: 0,
      translateY: 0,
    };

    this.handleContainerTap = this.handleContainerTap.bind(this);
    this.hanleImageTap = this.hanleImageTap.bind(this);
  }

  componentDidMount() {
    this.$preload.addEventListener('load', () => {
      this.setState({
        isLoaded: true,
      });
      this.computeImagePosition();
    });
  }

  componentWillUnmount() {
    document.body.ontouchmove = function() { return true };
  }

  getStyle(styleName) {
    const win = this.$container.ownerDocument.defaultView;
    return win.getComputedStyle(this.$container, null)[styleName];
  }

  getSize() {
    const img = document.createElement('img');
    img.src = this.props.image;
    return {
      width: img.hasOwnProperty('naturalWidth') ? img.naturalWidth : img.width,
      height: img.hasOwnProperty('naturalHeight') ? img.naturalHeight : img.height,
    };
  }

  getPosition() {
    const box = this.$image.getBoundingClientRect();
    return {
      top: box.top,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft,
    }
  }

  computeViewedPosition() {
    const imagePosition = this.getPosition();
    this.setState({
      translateX: ((this.screenSize.width - this.state.imageComputedStyle.width) / 2 - imagePosition.left),
      translateY: ((this.screenSize.height - this.state.imageComputedStyle.height) / 2 - imagePosition.top),
    });
  }

  computeImagePosition() {
    const containerSize = {
      width: parseFloat(this.getStyle('width')),
      height: parseFloat(this.getStyle('height')),
    };
    const imageRealSize = this.getSize();
    const screenSize = this.screenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const imageAspectRatio = this.imageAspectRatio = imageRealSize.width / imageRealSize.height;
    const containerAspectRatio = containerSize.width / containerSize.height;

    var viewedWidth, viewedHeight;
    if(imageAspectRatio > screenSize.width / screenSize.height) {
      viewedWidth = screenSize.width * this.config.viewedImageSize;
      viewedHeight = viewedWidth / imageAspectRatio;
    } else {
      viewedHeight = screenSize.height * this.config.viewedImageSize;
      viewedWidth = viewedHeight * imageAspectRatio;
    }

    if(imageAspectRatio > containerAspectRatio) {
      const scale = this.scale = containerSize.width / viewedWidth;

      // only use heightScale when stretchFromAnimate is true
      const heightScale = containerSize.height / viewedHeight;
      this.setState({
        imageComputedStyle: {
          width: viewedWidth,
          height: viewedHeight,
          transform: `scale(${scale}, ${this.config.stretchFromAnimate ? heightScale : scale})`,
          left: 0,
          top: this.config.stretchFromAnimate ? 0 : ((containerSize.height - containerSize.width / imageAspectRatio) / 2),
        },
      });
    } else {
      const scale = this.scale = containerSize.height / viewedHeight;

      // only use widthScale when stretchFromAnimate is true
      const widthScale = containerSize.width / viewedWidth;
      this.setState({
        imageComputedStyle: {
          width: viewedWidth,
          height: viewedHeight,
          transform: `scale(${this.config.stretchFromAnimate ? widthScale : scale}, ${scale})`,
          left: this.config.stretchFromAnimate ? 0 : ((containerSize.width - containerSize.height * imageAspectRatio) / 2),
          top: 0,
        },
      })
    }

  }

  handleContainerTap(event) {
    event.preventDefault();
    if(!this.state.isViewing && this.state.isLoaded) {
      // disable document scroll
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.ontouchmove = e => e.preventDefault();

      this.computeViewedPosition();
      this.setState({
        isViewing: true,
      });
    }
  }

  hanleImageTap(event) {
    event.preventDefault();
    event.stopPropagation();
    if(this.state.isViewing) {
      // enable document scroll
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.ontouchmove = function() { return true };

      this.setState({
        isViewing: false,
      });
    }
  }

  render() {
    const containerStyle = Object.assign(
      {},
      this.constainerStyle,
      this.props.style,
      this.state.isViewing ? this.viewedContainerStyle: undefined
    );
    const imageStyle = Object.assign(
      {},
      {
        position: 'absolute',
        backgroundSize: '100% 100%',
        backgroundImage: `url("${this.props.image}")`,
        pointerEvents: 'none',
        opacity: 0,
        backfaceVisibility: 'hidden',
        transformOrigin: '0 0 0',
        transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1), opacity 0.4s ease-in 0.2s',
        zIndex: 10,
      },
      this.state.imageComputedStyle,
      this.state.isViewing ? {
        pointerEvents: 'auto',
        transform: `scale(1, 1) translate3d(${this.state.translateX}px, ${this.state.translateY}px, 0)`,
        opacity: 1,
        transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1)',
        zIndex: 99,
      } : undefined
    );
    const backgroundStyle = this.state.isViewing ? {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: `rgba(0, 0, 0, ${this.config.backgroundOpacity})`,
      transition: 'background-color 0.4s ease 0.2s',
    } : undefined;
    return (
      <div
        className={this.props.className}
        style={containerStyle}
        ref={element => this.$container = element}
        onTouchTap={this.handleContainerTap}
      >
        <div
          style={imageStyle}
          ref={element => this.$image = element}
          onTouchTap={this.hanleImageTap}
        />
        <div
          style={backgroundStyle}
          onTouchTap={this.hanleImageTap}
        />
        <img
          src={this.props.image}
          style={{ display: 'none' }}
          alt="preload"
          ref={element => this.$preload = element}
        />
      </div>
    );
  }
}
ImageViewer.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
  image: PropTypes.string.isRequired,
  config: PropTypes.shape({
    viewedImageSize: PropTypes.number,
  }),
};
