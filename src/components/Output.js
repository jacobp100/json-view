import Json from './json';
import ErrorMessage from './errorMessage';
import RemainingText from './RemainingText';

export default ({ json, message, remainingText }) => (
  Json({ json }) +
  ErrorMessage({ message }) +
  RemainingText({ remainingText })
);
