import React, {useContext, useState} from 'react';
import { StoryblokBridgeInstanceContext, StoryblokClientContext } from '../contexts';
import StoryblokClient from 'storyblok-js-client';
import { IdType } from './interfaces/ComponentIdentification';
import { fetchComponent } from './util/fetchComponent';
import { Story } from './interfaces/Story';
import mapBlockToComponent from './util/componentMap';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export default function RootComponent() {
    const storyblokClient = new StoryblokClient({
        accessToken: 'xC7sv2LJmqH3mYQsjENw3Att'
    });

    const pathname = window?.location?.pathname || '/';
    const slug = pathname === '/' ? '/home' : pathname;
    if (window?.history) {
        window.history.pushState({}, '', slug);
    }

    const id = {
        id: `cdn/stories${slug}`,
        idType: IdType.path,
    };

    const [story, setStory] = useState(null);

    if (story === null) {
        fetchComponent<ClientResponse>(id, storyblokClient).then((response) => {
            setStory(response.story);
        });

        // TODO: Proper Spinner
        // TODO: Pull to refresh

        return;
    }

    const storyblokBridgeInstance = useContext(StoryblokBridgeInstanceContext);
    if (storyblokBridgeInstance) {
        storyblokBridgeInstance.on('input', (event) => {
            setStory(event.story);
        });
    }

    return (
        <StoryblokClientContext.Provider value={storyblokClient}>
            {mapBlockToComponent(story.content)}
        </StoryblokClientContext.Provider>
    );
}