import React from 'react';
import { registerRootComponent } from 'expo';

import App from './src/App';

// Add error boundary for development
if (__DEV__) {
  const withErrorBoundary = (Component) => {
    return class ErrorBoundary extends React.Component {
      componentDidCatch(error, info) {
        console.error('Error:', error);
        console.error('Info:', info);
      }
      
      render() {
        return <Component {...this.props} />;
      }
    };
  };
  
  registerRootComponent(withErrorBoundary(App));
} else {
  registerRootComponent(App);
}
