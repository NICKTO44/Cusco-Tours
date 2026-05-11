export const tourSchema = {
  name: 'tour',
  title: 'Tours',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre del Tour',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL del Tour',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceUsd',
      title: 'Precio en USD',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'durationHours',
      title: 'Duracion en horas',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Descripcion',
      type: 'text',
    },
    {
      name: 'descriptionEn',
      title: 'Descripcion en Ingles',
      type: 'text',
    },
    {
      name: 'includes',
      title: 'Que incluye (Español)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'includesEn',
      title: 'Que incluye (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'notIncludes',
      title: 'Que NO incluye (Español)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'notIncludesEn',
      title: 'Que NO incluye (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Galeria de fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'highlight',
      title: 'Tour destacado en Home',
      type: 'boolean',
    },
    {
      name: 'difficulty',
      title: 'Dificultad',
      type: 'string',
      options: {
        list: ['Facil', 'Moderado', 'Dificil'],
      },
    },
  ],
}