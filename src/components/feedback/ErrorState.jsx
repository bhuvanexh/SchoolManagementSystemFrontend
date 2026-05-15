const ErrorState = ({ title = 'Something went wrong', message = 'Please try again.' }) => (
  <div className="glass-panel border-error/20 bg-error-container/60 px-6 py-5 text-error">
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm">{message}</p>
  </div>
);

export default ErrorState;
