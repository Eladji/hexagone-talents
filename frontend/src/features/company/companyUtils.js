export function getOfferId(offer) {
  return offer.id || offer.offer_id;
}

export function getOfferKey(offer) {
  return getOfferId(offer) || `${offer.company_name}-${offer.title || offer.offer_title}`;
}

export function uniqueOffers(offers) {
  const seenIds = new Set();
  const seenTitles = new Set();
  return offers.filter((offer) => {
    const id = getOfferId(offer);
    const title = `${offer.company_name || ""}-${offer.title || offer.offer_title || ""}`.trim().toLowerCase();
    if ((id && seenIds.has(id)) || seenTitles.has(title)) return false;
    if (id) seenIds.add(id);
    seenTitles.add(title);
    return true;
  });
}

export function formatArchiveMeta(offer) {
  if (!offer.closed_at) return "Ancienne offre";
  return `Archivee le ${new Date(offer.closed_at).toLocaleDateString("fr-FR")}`;
}
