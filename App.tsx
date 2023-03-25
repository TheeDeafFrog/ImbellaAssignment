import React, {useState} from 'react';
import RootComponent from './src';
import { loadStoryBlokBridge } from './loadStoryblokBridge';
import { StoryblokBridgeInstanceContext, StoryblokDraftMode, StoryblokClientContext } from './contexts';
import StoryblokClient from 'storyblok-js-client';
import {Provider as PaperProvider} from 'react-native-paper';

export default function App() {

    const [storyblokBridgeInstance, setStoryblokBridgeInstance] = useState(null);
    const [storyblokDraftMode, setStoryblokDraftMode] = useState(false);

    loadStoryBlokBridge(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { StoryblokBridge } = window;
        const bridge = new StoryblokBridge();
        setStoryblokBridgeInstance(bridge);

        bridge.on(['published', 'unpublished', 'change'], (event) => {
            if (!event.slugChanged) {
                window.location.reload();
            }
        });
        bridge.on('enterEditmode', () => {
            setStoryblokDraftMode(true);
        });
    });

    const storyblokClient = new StoryblokClient({
        accessToken: 'xC7sv2LJmqH3mYQsjENw3Att'
    });
    
    return (
        <StoryblokBridgeInstanceContext.Provider value={storyblokBridgeInstance}>
            <StoryblokDraftMode.Provider value={storyblokDraftMode}>
                <StoryblokClientContext.Provider value={storyblokClient}>
                    <PaperProvider theme={{version: 3, dark: true}}>
                        <RootComponent/>
                    </PaperProvider>
                </StoryblokClientContext.Provider>
            </StoryblokDraftMode.Provider>
        </StoryblokBridgeInstanceContext.Provider>
    );
}
