import { ComponentIdentification, IdType } from "../interfaces/ComponentIdentification";
import StoryblokClient from 'storyblok-js-client';

export async function fetchComponent<Type>(id: ComponentIdentification, client: StoryblokClient) {
    switch (id.idType) {
        case IdType.path: {
            return (await client.get(id.id)).data as Type;
        }
    }
}