import React, { useContext, useState, useEffect } from 'react';
import {Appbar} from 'react-native-paper';
import { SlugContext, StoryblokClientContext, StoryblokDraftModeContext } from '../../../contexts';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { IdType } from '../../interfaces/ComponentIdentification';
import { Story } from '../../interfaces/Story';
import { fetchComponent } from '../../util/fetchComponent';

export interface NavigationButton extends BaseBlock {
    slug: string;
    icon: string;
}

export interface TopBarProps {
    title: string;
}

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export function TopBar(props: TopBarProps) {

    const storyblokClient = useContext(StoryblokClientContext);
    const storyblokDraftMode = useContext(StoryblokDraftModeContext);
    const {setSlug} = useContext(SlugContext);

    const [story, setStory] = useState(null);

    const fetchStory = () => {
        const id = {
            id: 'cdn/stories/topbar',
            idType: IdType.path,
        };

        fetchComponent<ClientResponse>(id, storyblokClient, storyblokDraftMode).then((response) => {
            setStory(response.story);
        });
    };

    useEffect(() => {
        if(story === null) {
            fetchStory();
        }
    }, []);

    if (!story) {
        return;
    }

    return <Appbar.Header style={{backgroundColor: story.content.color}} testID='top-bar'>
        <Appbar.Content title={props.title}/>
        {story.content.navigationItems.map((navigationItem) => {
            return <Appbar.Action icon={navigationItem.icon} onPress={() => setSlug(navigationItem.slug)} key={navigationItem._uid} testID={navigationItem._uid} />;
        })}
    </Appbar.Header>;
}