import React, {useContext, useState} from 'react';
import { StoryblokClientContext } from './contexts';
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

    // TODO: check URL to determine starting id

    const id = {
        id: 'cdn/stories/home',
        idType: IdType.path,
    };

    const [story, setStory] = useState(null);

    if (story === null) {
        fetchComponent<ClientResponse>(id, storyblokClient).then((response) => {
            setStory(response.story);
        });

        // TODO: Proper Spinner
        // TODO: Set URL to slug
        // TODO: Pull to refresh

        return
    }

    return (
        <StoryblokClientContext.Provider value={storyblokClient}>
            {mapBlockToComponent(story.content)}
        </StoryblokClientContext.Provider>
    );
}