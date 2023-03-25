import {createContext} from 'react';

export const StoryblokClientContext = createContext(null);
export const StoryblokBridgeInstanceContext = createContext(null);
export const StoryblokDraftModeContext = createContext(false);
export const SlugContext = createContext({slug: '/home', setSlug: (slug: string) => null});
