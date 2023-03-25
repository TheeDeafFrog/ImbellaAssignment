import React, {useState} from 'react';
import RootComponent from './src';
import { loadStoryBlokBridge } from './loadStoryblokBridge';
import { StoryblokBridgeInstanceContext, StoryblokDraftMode } from './contexts';

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
    
    return (
        <StoryblokBridgeInstanceContext.Provider value={storyblokBridgeInstance}>
            <StoryblokDraftMode.Provider value={storyblokDraftMode}>
                <RootComponent/>
            </StoryblokDraftMode.Provider>
        </StoryblokBridgeInstanceContext.Provider>
    );
}
