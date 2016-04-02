import Json from './json';
import ErrorMessage from './errorMessage';
import RemainingText from './RemainingText';

export default ({ json, message, location, remainingText }) => (
  ErrorMessage({ message, location }) +
  Json({ json }) +
  RemainingText({ remainingText })
);
