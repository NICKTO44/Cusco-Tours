import { client } from './sanity'

const SANITY_IMG_PARAMS = '?w=1200&q=85&fit=max&auto=format'
const GALLERY_IMG_PARAMS = '?w=800&q=85&fit=max&auto=format'

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

  // Agregar parámetros de optimización a las URLs de Sanity
  return tours?.map((tour: any) => ({
    ...tour,
    image: tour.image ? `${tour.image}${SANITY_IMG_PARAMS}` : tour.image,
    gallery: tour.gallery?.map((url: string) => `${url}${GALLERY_IMG_PARAMS}`) ?? [],
  }))
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

  if (!tour) return null

  return {
    ...tour,
    image: tour.image ? `${tour.image}${SANITY_IMG_PARAMS}` : tour.image,
    gallery: tour.gallery?.map((url: string) => `${url}${GALLERY_IMG_PARAMS}`) ?? [],
  }
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