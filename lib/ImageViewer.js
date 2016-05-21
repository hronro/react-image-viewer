'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageViewer = function (_Component) {
  _inherits(ImageViewer, _Component);

  function ImageViewer(props) {
    _classCallCheck(this, ImageViewer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageViewer).call(this, props));

    var defaultConfig = {
      viewedImageSize: 0.9,
      backgroundOpacity: 0.4,
      stretchFromAnimate: true
    };

    _this.config = Object.assign({}, defaultConfig, _this.props.config);

    _this.constainerStyle = {
      position: 'relative',
      left: 0,
      top: 0,
      backgroundImage: 'url("' + props.image + '")',
      opacity: 1,
      transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1)',
      zIndex: 10
    };
    _this.viewedContainerStyle = {
      zIndex: 20
    };

    _this.state = {
      isLoaded: false,
      isViewing: false,
      imageComputedStyle: {
        width: 0,
        height: 0
      },
      translateX: 0,
      translateY: 0
    };

    _this.handleContainerTap = _this.handleContainerTap.bind(_this);
    _this.hanleImageTap = _this.hanleImageTap.bind(_this);
    return _this;
  }

  _createClass(ImageViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.refs.preload.addEventListener('load', function () {
        _this2.setState({
          isLoaded: true
        });
        _this2.computeImagePosition();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.body.ontouchmove = function () {
        return true;
      };
    }
  }, {
    key: 'getStyle',
    value: function getStyle(styleName) {
      var win = this.refs.container.ownerDocument.defaultView;
      return win.getComputedStyle(this.refs.container, null)[styleName];
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      var img = document.createElement('img');
      img.src = this.props.image;
      return {
        width: img.hasOwnProperty('naturalWidth') ? img.naturalWidth : img.width,
        height: img.hasOwnProperty('naturalHeight') ? img.naturalHeight : img.height
      };
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      var box = this.refs.image.getBoundingClientRect();
      return {
        top: box.top,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
  }, {
    key: 'computeViewedPosition',
    value: function computeViewedPosition() {
      var imagePosition = this.getPosition();
      this.setState({
        translateX: (this.screenSize.width - this.state.imageComputedStyle.width) / 2 - imagePosition.left,
        translateY: (this.screenSize.height - this.state.imageComputedStyle.height) / 2 - imagePosition.top
      });
    }
  }, {
    key: 'computeImagePosition',
    value: function computeImagePosition() {
      var containerSize = {
        width: parseFloat(this.getStyle('width')),
        height: parseFloat(this.getStyle('height'))
      };
      var imageRealSize = this.getSize();
      var screenSize = this.screenSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      var imageAspectRatio = this.imageAspectRatio = imageRealSize.width / imageRealSize.height;
      var containerAspectRatio = containerSize.width / containerSize.height;

      var viewedWidth, viewedHeight;
      if (imageAspectRatio > screenSize.width / screenSize.height) {
        viewedWidth = screenSize.width * this.config.viewedImageSize;
        viewedHeight = viewedWidth / imageAspectRatio;
      } else {
        viewedHeight = screenSize.height * this.config.viewedImageSize;
        viewedWidth = viewedHeight * imageAspectRatio;
      }

      if (imageAspectRatio > containerAspectRatio) {
        var scale = this.scale = containerSize.width / viewedWidth;

        // only use heightScale when stretchFromAnimate is true
        var heightScale = containerSize.height / viewedHeight;
        this.setState({
          imageComputedStyle: {
            width: viewedWidth,
            height: viewedHeight,
            transform: 'scale(' + scale + ', ' + (this.config.stretchFromAnimate ? heightScale : scale) + ')',
            left: 0,
            top: this.config.stretchFromAnimate ? 0 : (containerSize.height - containerSize.width / imageAspectRatio) / 2
          }
        });
      } else {
        var _scale = this.scale = containerSize.height / viewedHeight;

        // only use widthScale when stretchFromAnimate is true
        var widthScale = containerSize.width / viewedWidth;
        this.setState({
          imageComputedStyle: {
            width: viewedWidth,
            height: viewedHeight,
            transform: 'scale(' + (this.config.stretchFromAnimate ? widthScale : _scale) + ', ' + _scale + ')',
            left: this.config.stretchFromAnimate ? 0 : (containerSize.width - containerSize.height * imageAspectRatio) / 2,
            top: 0
          }
        });
      }
    }
  }, {
    key: 'handleContainerTap',
    value: function handleContainerTap(event) {
      event.preventDefault();
      if (!this.state.isViewing && this.state.isLoaded) {
        // disable document scroll
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.ontouchmove = function (e) {
          return e.preventDefault();
        };

        this.computeViewedPosition();
        this.setState({
          isViewing: true
        });
      }
    }
  }, {
    key: 'hanleImageTap',
    value: function hanleImageTap(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.state.isViewing) {
        // enable document scroll
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.ontouchmove = function () {
          return true;
        };

        this.setState({
          isViewing: false
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var containerStyle = Object.assign({}, this.constainerStyle, this.props.style, this.state.isViewing ? this.viewedContainerStyle : undefined);
      var imageStyle = Object.assign({}, {
        position: 'absolute',
        backgroundSize: '100% 100%',
        backgroundImage: 'url("' + this.props.image + '")',
        pointerEvents: 'none',
        opacity: 0,
        backfaceVisibility: 'hidden',
        transformOrigin: '0 0 0',
        transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1), opacity 0.4s ease-in 0.2s',
        zIndex: 10
      }, this.state.imageComputedStyle, this.state.isViewing ? {
        pointerEvents: 'auto',
        transform: 'scale(1, 1) translate3d(' + this.state.translateX + 'px, ' + this.state.translateY + 'px, 0)',
        opacity: 1,
        transition: 'transform 0.4s cubic-bezier(0, 0, 0.3, 1)',
        zIndex: 99
      } : undefined);
      var backgroundStyle = this.state.isViewing ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, ' + this.config.backgroundOpacity + ')',
        transition: 'background-color 0.4s ease 0.2s'
      } : undefined;
      return _react2.default.createElement(
        'div',
        {
          className: this.props.className,
          style: containerStyle,
          ref: 'container',
          onTouchTap: this.handleContainerTap
        },
        _react2.default.createElement('div', {
          style: imageStyle,
          ref: 'image',
          onTouchTap: this.hanleImageTap
        }),
        _react2.default.createElement('div', {
          style: backgroundStyle,
          onTouchTap: this.hanleImageTap
        }),
        _react2.default.createElement('img', { src: this.props.image, style: { display: 'none' }, alt: '', ref: 'preload' })
      );
    }
  }]);

  return ImageViewer;
}(_react.Component);

exports.default = ImageViewer;

ImageViewer.propTypes = {
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  image: _react.PropTypes.string.isRequired,
  config: _react.PropTypes.shape({
    viewedImageSize: _react.PropTypes.number
  })
};