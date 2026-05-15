const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
      {description ? <p className="mt-2 text-sm text-on-surface-variant">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
