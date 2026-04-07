import { client } from './sanity'

export async function getTours() {
  const tours = await client.fetch(`
    *[_type == "tour"] | order(_createdAt asc) {
      "slug": slug.current,
      "name": name,
      priceUsd,
      durationHours,
      highlight,
      difficulty,
      description,
      descriptionEn,
      includes,
      "image": image.asset->url,
      "gallery": gallery[].asset->url,
    }
  `)
  return tours
}

export async function getTourBySlug(slug: string) {
  const tour = await client.fetch(`
    *[_type == "tour" && slug.current == $slug][0] {
      "slug": slug.current,
      "name": name,
      priceUsd,
      durationHours,
      highlight,
      difficulty,
      description,
      descriptionEn,
      includes,
      "image": image.asset->url,
      "gallery": gallery[].asset->url,
    }
  `, { slug })
  return tour
}

export async function getGallery() {
  return client.fetch(`
    *[_type == "gallery"] | order(order asc, _createdAt asc) {
      title,
      category,
      highlight,
      "image": image.asset->url,
    }
  `)
}

export async function getGalleryHighlights() {
  return client.fetch(`
    *[_type == "gallery" && highlight == true] | order(order asc, _createdAt asc) {
      title,
      category,
      "image": image.asset->url,
    }
  `)
}

export async function getMobility() {
  return client.fetch(`
    *[_type == "mobility"] | order(_createdAt asc) {
      route,
      priceGeely,
      priceStaria,
      priceRenault,
      priceSprinter,
    }
  `)
}

export async function getMobilityRoutes() {
  return client.fetch(`
    *[_type == "mobility"] | order(order asc, _createdAt asc) {
      routeId,
      nameEs,
      nameEn,
      descEs,
      descEn,
      priceGeely,
      priceStaria,
      priceRenault,
      priceSprinter,
    }
  `)
}
