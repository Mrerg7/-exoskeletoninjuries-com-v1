import { defineCollection, z } from 'astro:content';

const advancements = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Medical', 'Consumer', 'Industrial', 'Research']),
    organization: z.string().optional(),
    highlight: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  advancements,
};
