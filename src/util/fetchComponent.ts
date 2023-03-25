import { ComponentIdentification, IdType } from '../interfaces/ComponentIdentification';
import StoryblokClient from 'storyblok-js-client';

export async function fetchComponent<Type>(id: ComponentIdentification, client: StoryblokClient, storyblokDraftMode: boolean) {
    const version = storyblokDraftMode ? 'draft' : 'published';
    switch (id.idType) {
    case IdType.path:
        return (await client.get(id.id, {
            version
        })).data as Type;
    case IdType.uid:
        return (await client.get(id.id, {
            version
        })).data as Type;
    case IdType.uuid:
        return (await client.get(id.id, {
            version,
            find_by: 'uuid'
        })).data as Type;
    }
}