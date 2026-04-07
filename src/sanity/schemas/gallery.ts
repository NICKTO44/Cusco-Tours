export const gallerySchema = {
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titulo',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: ['Tours', 'Movilidad', 'Cusco', 'Machu Picchu'],
      },
    },
    {
      name: 'highlight',
      title: 'Mostrar en Home',
      type: 'boolean',
      description: 'Activar para mostrar esta foto en la seccion de galeria del inicio',
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Numero para ordenar las fotos (1, 2, 3...)',
    },
  ],
}
