export function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function HeroMetric({ title, value, text }) {
  return (
    <section className="metric">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </section>
  );
}

export function OfferRow({
  offer,
  actionLabel,
  onAction,
  actionDisabled,
  actionClassName,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionDisabled,
  secondaryActionClassName,
  active,
  meta,
}) {
  const hasActions = actionLabel || secondaryActionLabel;

  return (
    <article className={`offer-row ${active ? "active" : ""}`}>
      <div>
        <strong>{offer.offer_title || offer.title}</strong>
        <span>{offer.company_name}</span>
        <p>{offer.description}</p>
        {meta && <small>{meta}</small>}
      </div>
      {hasActions && (
        <div className="offer-row-actions">
          {actionLabel && <button className={actionClassName} disabled={actionDisabled} onClick={onAction}>{actionLabel}</button>}
          {secondaryActionLabel && (
            <button className={secondaryActionClassName} disabled={secondaryActionDisabled} onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
