import { z } from "zod";

export const profileSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    heightCm: z.coerce.number().min(100, "Taille minimum 100cm").max(250, "Taille maximum 250cm"),
    targetWeight: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.number().min(30, "Poids minimum 30kg").optional()
    ),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
