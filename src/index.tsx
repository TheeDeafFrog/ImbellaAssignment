import React, {useContext, useState} from 'react';
import { StoryblokBridgeInstanceContext, StoryblokClientContext } from '../contexts';
import { IdType } from './interfaces/ComponentIdentification';
import { fetchComponent } from './util/fetchComponent';
import { Story } from './interfaces/Story';
import mapBlockToComponent from './util/componentMap';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import styles from './styles';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export default function RootComponent(): React.ReactElement {

    const [story, setStory] = useState(null);
    const storyblokClient = useContext(StoryblokClientContext);

    const storyblokBridgeInstance = useContext(StoryblokBridgeInstanceContext);
    if (storyblokBridgeInstance) {
        storyblokBridgeInstance.on('input', (event) => {
            setStory(event.story);
        });
    }

    const pathname = window?.location?.pathname || '/';
    const slug = pathname === '/' ? '/home' : pathname;
    if (window?.history) {
        window.history.pushState({}, '', slug);
    }

    const id = {
        id: `cdn/stories${slug}`,
        idType: IdType.path,
    };

    if (story === null) {
        fetchComponent<ClientResponse>(id, storyblokClient).then((response) => {
            setStory(response.story);
        });

        // TODO: Pull to refresh

        return <View style={styles.activityIndicator}>
            <ActivityIndicator size="large"/>
        </View>;
    }
    
    return mapBlockToComponent(story.content);
}