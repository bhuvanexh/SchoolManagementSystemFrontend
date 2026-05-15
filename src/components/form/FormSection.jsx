const FormSection = ({ title, description, children, className = '' }) => (
  <section className={`glass-panel p-6 ${className}`.trim()}>
    {(title || description) && (
      <div className="mb-6">
        {title ? <h2 className="text-xl font-bold text-on-surface">{title}</h2> : null}
        {description ? <p className="mt-2 text-sm text-on-surface-variant">{description}</p> : null}
      </div>
    )}
    <div className="grid gap-5 md:grid-cols-2">{children}</div>
  </section>
);

export default FormSection;
