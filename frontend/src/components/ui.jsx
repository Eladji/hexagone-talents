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

export function OfferRow({ offer, actionLabel, onAction, actionDisabled, active, meta }) {
  return (
    <article className={`offer-row ${active ? "active" : ""}`}>
      <div>
        <strong>{offer.offer_title || offer.title}</strong>
        <span>{offer.company_name}</span>
        <p>{offer.description}</p>
        {meta && <small>{meta}</small>}
      </div>
      {actionLabel && <button disabled={actionDisabled} onClick={onAction}>{actionLabel}</button>}
    </article>
  );
}
