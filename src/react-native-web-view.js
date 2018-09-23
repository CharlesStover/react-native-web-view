import React from 'react';
import { WebView } from 'react-native';
import injectPostMessage from './inject-post-message';

const unescape = str =>
  str.replace(/\\'/g, '\'');

class WebViewPostMessage extends React.PureComponent {

  handleNavigationStateChange = e => {

    // If this navigation state contains a message to post, post it.
    const postMessage = e.url.match(/\#window\.postMessage\('(.+)'\)$/);
    if (postMessage) {
      if (
        e.loading &&
        this.props.onMessage
      ) {
        this.props.onMessage({
          nativeEvent: {
            data: unescape(postMessage[1])
          }
        });
      }
      return;
    }

    // If this navigation state has completed, listen for messages.
    if (
      !e.loading &&
      this.ref
    ) {
      this.ref.injectJavaScript(injectPostMessage);
    }

    // If a navigation state change event handler was passed, call it.
    if (this.props.onNavigationStateChange) {
      return this.props.onNavigationStateChange(e);
    }
    return;
  };

  // Grab the WebView ref for injecting JavaScript.
  handleRef = ref => {
    this.ref = ref;

    // If the caller also wants this ref, pass it along to them as well.
    if (this.props.forwardedRef) {
      this.props.forwardedRef(ref);
    }
  };

  render() {

    // Do not send onMessage to the React Native WebView, since it is not supported on iOS.
    const props = {...this.props};
    delete props.forwardedRef;
    delete props.onMessage;

    return (
      <WebView
        {...this.props}
        onNavigationStateChange={this.handleNavigationStateChange}
        ref={this.handleRef}
      />
    );
  }
}

// Export a component that allows refs to be forwarded, in case the user wants access to the WebView.
export default React.forwardRef((props, ref) =>
  <WebViewPostMessage
    {...props}
    forwardedRef={ref}
  />
);
