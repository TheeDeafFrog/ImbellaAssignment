import { ComponentIdentification, IdType } from '../interfaces/ComponentIdentification';
import StoryblokClient from 'storyblok-js-client';
import { useContext } from 'react';
import { StoryblokDraftMode } from '../../contexts';

export async function fetchComponent<Type>(id: ComponentIdentification, client: StoryblokClient) {

    const storyblokDraftMode = useContext(StoryblokDraftMode);

    switch (id.idType) {
    case IdType.path:
        return (await client.get(id.id, {
            version: storyblokDraftMode ? 'draft' : 'published'
        })).data as Type;
    }
}