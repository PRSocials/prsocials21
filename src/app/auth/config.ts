import { z } from "zod";

const configSchema = z.object({
  signInOptions: z.object({
    google: z.coerce.boolean({ description: "Enable Google sign-in" }),
    github: z.coerce.boolean({ description: "Enable GitHub sign-in" }),
    facebook: z.coerce.boolean({ description: "Enable Facebook sign-in" }),
    twitter: z.coerce.boolean({ description: "Enable Twitter sign-in" }),
    emailAndPassword: z.coerce.boolean({
      description: "Enable email and password sign-in",
    }),
    magicLink: z.coerce.boolean({ description: "Enable magic link sign-in" }),
  }),
  siteName: z.string({ description: "The name of the site" }),
  signInSuccessUrl: z.preprocess(
    (it) => it || "/",
    z.string({ description: "The URL to redirect to after a successful sign-in" }),
  ),
  tosLink: z.string({ description: "Link to the terms of service" }).optional(),
  privacyPolicyLink: z.string({ description: "Link to the privacy policy" }).optional(),
  firebaseConfig: z.object(
    {
      apiKey: z.string().default(""),
      authDomain: z.string().default(""),
      projectId: z.string().default(""),
      storageBucket: z.string().default(""),
      messagingSenderId: z.string().default(""),
      appId: z.string().default(""),
    },
    {
      description:
        "Firebase config as described in https://firebase.google.com/docs/web/learn-more#config-object",
    },
  ),
});

type FirebaseExtensionConfig = z.infer<typeof configSchema>;

export const config: FirebaseExtensionConfig = {
  signInOptions: {
    google: true,
    github: false,
    facebook: false,
    twitter: false,
    emailAndPassword: false,
    magicLink: false,
  },
  siteName: "PRSocials",
  signInSuccessUrl: "/",
  tosLink: "/terms-of-service",
  privacyPolicyLink: "/privacy-policy",
  firebaseConfig: {
    apiKey: import.meta.env.VITE_DATABUTTON_EXTENSIONS
      ? JSON.parse(import.meta.env.VITE_DATABUTTON_EXTENSIONS)
          .find(ext => ext.name === 'firebase-auth')
          ?.config.firebaseConfig.apiKey
      : 'AIzaSyDqUi40c1lw4_-0ZP0qRV1nttMeJNRQkgQ',
    authDomain: import.meta.env.VITE_DATABUTTON_EXTENSIONS
      ? JSON.parse(import.meta.env.VITE_DATABUTTON_EXTENSIONS)
          .find(ext => ext.name === 'firebase-auth')
          ?.config.firebaseConfig.authDomain
      : 'prsocials-59058.firebaseapp.com',
    projectId: 'prsocials-59058',
    storageBucket: 'prsocials-59058.firebasestorage.app',
    messagingSenderId: '896744747534',
    appId: '1:896744747534:web:68b63648d6f91ef4ae025f',
  },
};