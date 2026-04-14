import { Inbox, Pencil, Trash2, X } from "lucide-react";

export const EditorPanel = ({ children, description, isEditing, onReset, title }) => {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.04]"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        ) : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
};

export const ListPanel = ({ emptyLabel, items, renderItem, title }) => {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <Inbox className="h-5 w-5 text-cyan-300" />
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      <div className="mt-6 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">
            {emptyLabel}
          </div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </section>
  );
};

export const ResourceCard = ({ badges = [], description, onDelete, onEdit, subtitle, title }) => {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-slate-950/45 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          {description ? <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p> : null}
          {badges.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.04]"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-400/15"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export const Field = ({
  hint,
  label,
  max,
  min,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
        {hint ? <span className="ml-2 text-xs text-slate-500">{hint}</span> : null}
      </label>
      <input
        type={type}
        className="field-control"
        value={value ?? ""}
        min={min}
        max={max}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export const TextAreaField = ({ hint, label, onChange, placeholder, rows = 5, value }) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
        {hint ? <span className="ml-2 text-xs text-slate-500">{hint}</span> : null}
      </label>
      <textarea
        rows={rows}
        className="field-control resize-none"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export const FileField = ({ accept, currentFileLabel, hint, label, onChange }) => {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
        {hint ? <span className="ml-2 text-xs text-slate-500">{hint}</span> : null}
      </label>
      <input
        type="file"
        accept={accept}
        className="file-control"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      {currentFileLabel ? <p className="mt-2 text-xs text-slate-500">Current: {currentFileLabel}</p> : null}
    </div>
  );
};
