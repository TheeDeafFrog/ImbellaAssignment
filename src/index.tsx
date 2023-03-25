import React, {useContext, useEffect, useState} from 'react';
import { StoryblokBridgeInstanceContext, StoryblokClientContext, StoryblokDraftMode } from '../contexts';
import { IdType } from './interfaces/ComponentIdentification';
import { fetchComponent } from './util/fetchComponent';
import { Story } from './interfaces/Story';
import mapBlockToComponent from './util/componentMap';
import { SafeAreaView, ScrollView, RefreshControl, StatusBar } from 'react-native';
import styles from './styles';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export default function RootComponent(): React.ReactElement {

    const [story, setStory] = useState(null);
    const [refreshing, setRefreshing] = useState(true);
    const storyblokClient = useContext(StoryblokClientContext);
    const storyblokBridgeInstance = useContext(StoryblokBridgeInstanceContext);
    const storyblokDraftMode = useContext(StoryblokDraftMode);

    const fetchStory = () => {
        setRefreshing(true);

        const pathname = window?.location?.pathname || '/';
        const slug = pathname === '/' ? '/home' : pathname;
        if (window?.history) {
            window.history.pushState({}, '', slug);
        }
    
        const id = {
            id: `cdn/stories${slug}`,
            idType: IdType.path,
        };

        fetchComponent<ClientResponse>(id, storyblokClient, storyblokDraftMode).then((response) => {
            setStory(response.story);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        if (story === null) {
            fetchStory();
        }
    }, []);

    if (storyblokBridgeInstance) {
        storyblokBridgeInstance.on('input', (event) => {
            setStory(event.story);
        });
    }

    return <SafeAreaView style={styles.container}>
        <StatusBar/>
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchStory}/>
            }
        >
            {story !== null && mapBlockToComponent(story.content)}
        </ScrollView>
    </SafeAreaView>;
}