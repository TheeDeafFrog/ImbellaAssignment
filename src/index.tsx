import React, {useContext, useEffect, useState} from 'react';
import { StoryblokBridgeInstanceContext, StoryblokClientContext, StoryblokDraftModeContext, SlugContext } from '../contexts';
import { IdType } from './interfaces/ComponentIdentification';
import { fetchComponent } from './util/fetchComponent';
import { Story } from './interfaces/Story';
import mapBlockToComponent from './util/componentMap';
import { SafeAreaView, ScrollView, RefreshControl, StatusBar, Platform } from 'react-native';
import styles from './styles';
import { TopBar } from './stories';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export default function RootComponent(): React.ReactElement {


    let initialSlug;
    if (Platform.OS === 'web') {
        const pathname = window?.location?.pathname || '/';
        initialSlug = pathname === '/' ? '/home' : pathname;
    } else {
        initialSlug = '/home';
    }

    const [story, setStory] = useState(null);
    const [refreshing, setRefreshing] = useState(true);
    const [slug, setSlug] = useState(initialSlug);

    const storyblokClient = useContext(StoryblokClientContext);
    const storyblokBridgeInstance = useContext(StoryblokBridgeInstanceContext);
    const storyblokDraftMode = useContext(StoryblokDraftModeContext);

    const fetchStory = () => {
        setRefreshing(true);

        if (Platform.OS === 'web') {
            if (window?.history) {
                window.history.pushState({}, '', slug);
            }
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

    return <SlugContext.Provider value={{slug, setSlug}}>
        <SafeAreaView style={styles.container}>
            <StatusBar/>
            <TopBar title={story?.name}/>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchStory}/>
                }
            >
                {story !== null && mapBlockToComponent(story.content)}
            </ScrollView>
        </SafeAreaView>
    </SlugContext.Provider>;
}