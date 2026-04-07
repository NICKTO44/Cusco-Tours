export const mobilitySchema = {
  name: 'mobility',
  title: 'Movilidad Privada - Rutas',
  type: 'document',
  fields: [
    {
      name: 'nameEs',
      title: 'Nombre de la ruta (Español)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: 'Nombre de la ruta (Inglés)',
      type: 'string',
    },
    {
      name: 'descEs',
      title: 'Descripción (Español)',
      type: 'text',
    },
    {
      name: 'descEn',
      title: 'Descripción (Inglés)',
      type: 'text',
    },
    {
      name: 'priceGeely',
      title: 'Precio Geely Shaniao — 6 pasajeros (USD)',
      type: 'number',
    },
    {
      name: 'priceStaria',
      title: 'Precio Staria SBC — 10 pasajeros (USD)',
      type: 'number',
    },
    {
      name: 'priceRenault',
      title: 'Precio Renault Master — 15 pasajeros (USD)',
      type: 'number',
    },
    {
      name: 'priceSprinter',
      title: 'Precio Sprinter — 19 pasajeros (USD)',
      type: 'number',
    },
    {
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número para ordenar las rutas: 1, 2, 3...',
    },
  ],
}
