const SectionHeading = ({ eyebrow, title, description }) => {
  return (
    <div className="max-w-3xl">
      <span className="section-chip">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-8 text-slate-300">{description}</p> : null}
    </div>
  );
};

export default SectionHeading;
