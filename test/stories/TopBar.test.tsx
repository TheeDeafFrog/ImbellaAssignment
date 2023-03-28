import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SAMPLE_PRODUCT, SAMPLE_TOPBAR } from '../sampleData';
import StoryblokClient from 'storyblok-js-client';
import { StoryblokClientContext } from '../../contexts';
import { TopBar, TopBarProps } from '../../src/stories/TopBar';

jest.mock('storyblok-js-client');

jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
        SafeAreaConsumer: jest
            .fn()
            .mockImplementation(({ children }) => children(inset)),
        useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    };
});

describe('TopBar', () => {

    let deferred = [];
    let storyblokClient;

    const getMocked = jest.fn(() => new Promise((resolve, reject) => {
        deferred.push({resolve, reject});
    }));

    const getComponent = (props: TopBarProps) => {
        return <StoryblokClientContext.Provider value={storyblokClient}>
            <TopBar {...props} />
        </StoryblokClientContext.Provider>;
    };

    beforeEach(() => {
        storyblokClient = new StoryblokClient({});
        deferred = [];
        jest.clearAllMocks();
    });

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        StoryblokClient.mockImplementation(() => {
            return {
                get: getMocked
            };
        });
    });
    
    it('should request nav items', async () => {
        const props: TopBarProps = {
            title: 'Home'
        };

        render(getComponent(props));

        await waitFor(() => expect(getMocked).toBeCalledTimes(1));
        expect(getMocked).toHaveBeenLastCalledWith('cdn/stories/topbar', {version: 'published'});
    });

    it('should render all the correct components', async () => {
        const props: TopBarProps = {
            title: 'Home'
        };

        render(getComponent(props));

        await act(() => {
            deferred.pop().resolve({
                data: SAMPLE_TOPBAR,
            });
        });

        screen.getByTestId('top-bar');

        SAMPLE_TOPBAR.story.content.navigationItems.forEach((navigationItem) => {
            screen.getByTestId(navigationItem._uid);
        });
    });
});