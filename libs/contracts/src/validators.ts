import { z } from 'zod';

export const passwordValidator = z.string().min(1);
// .min(6, 'Min 6 chars')
// .regex(/(?=.*[A-Z])/, 'At least one uppercase letter')
// .regex(/(?=.*[a-z])/, 'At least one lowercase letter')
// .regex(/(?=.*\d)/, 'At least one number');
