/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import RootComponent from '../src';
import StoryblokClient from 'storyblok-js-client';
import { SAMPLE_HOME, SAMPLE_PRODUCT, SAMPLE_SIMPLE_HOME } from './sampleData';
import { StoryblokClientContext } from '../contexts';
import { Platform } from 'react-native';

jest.mock('storyblok-js-client');

describe('Root Component', () => {

    // const getMocked = jest.fn(() => ({data: SAMPLE_STORY}));
    let deferred = [];
    const getMocked = jest.fn(() => new Promise((resolve, reject) => {
        deferred.push({resolve, reject});
    }));
    // const getMocked = jest.fn();
    const pushStateMocked = jest.fn((state, unused, path) => {
        // @ts-ignore
        window.location = {
            // @ts-ignore
            pathname: path     
        };
    });

    let storyblokClient;

    const getComponent = () => {
        return <StoryblokClientContext.Provider value={storyblokClient}>
            <RootComponent />
        </StoryblokClientContext.Provider>;
    };

    beforeAll(() => {
        // @ts-ignore
        StoryblokClient.mockImplementation(() => {
            return {
                get: getMocked
            };
        });

        storyblokClient = new StoryblokClient({});

        Platform.OS = 'web';
    });

    beforeEach(() => {
        deferred = [];
        jest.clearAllMocks();
        // @ts-ignore
        window.location = {
            pathname: '/'
        };
        // @ts-ignore
        window.history = {
            pushState: pushStateMocked
        };
    });

    describe('Client', () => {
        it('should use the client to request the story', () => {
            render(getComponent());

            expect(getMocked).toHaveBeenCalledTimes(2);
            expect(getMocked).lastCalledWith('cdn/stories/home', {version: 'published'});
        });

        it('should fetch and render a story', async () => {
            render(getComponent());

            await act(() => {
                deferred.pop().resolve({data: SAMPLE_SIMPLE_HOME});
            });

            const page = screen.getByTestId('page');
            expect(page.type).not.toBe(null);
        });
    });

    describe('Pathname', () => {
        it('should set the pathname to home if it\'s a \'/\'', () => {
            // @ts-ignore
            window.location = {
                pathname: '/'
            };
            
            render(getComponent());

            expect(pushStateMocked).toBeCalledTimes(1);
            expect(pushStateMocked).lastCalledWith({}, '', '/home');
            expect(window.location.pathname).toBe('/home');
        });

        it('should request the correct block based on the pathname', () => {
            // @ts-ignore
            window.location = {
                pathname: '/product/happiness'
            };

            render(getComponent());

            expect(getMocked).toHaveBeenCalledTimes(2);
            expect(getMocked).lastCalledWith('cdn/stories/product/happiness', {version: 'published'});
        });

        it('should request home and not modify the pathname if window.history is undefined (mobile)', () => {
            window.history = undefined;
            
            render(getComponent());

            expect(window.history).toBe(undefined);
            expect(getMocked).toHaveBeenCalledTimes(2);
            expect(getMocked).lastCalledWith('cdn/stories/home', {version: 'published'});
        });

        it('should change the pathname when the slug is changed', async () => {
            // @ts-ignore
            window.location = {
                pathname: '/'
            };
            
            render(getComponent());

            await act(() => {
                deferred.pop().resolve({data: SAMPLE_HOME});
                deferred.pop();
            });

            await act(() => {
                deferred.pop().resolve({data: SAMPLE_PRODUCT});
            });

            const button = screen.getByTestId('product');

            fireEvent(button, 'click');

            expect(pushStateMocked).toBeCalledTimes(2);
            expect(pushStateMocked).toHaveBeenLastCalledWith({}, '', `/${SAMPLE_PRODUCT.story.full_slug}`);
            expect(window.location.pathname).toBe(`/${SAMPLE_PRODUCT.story.full_slug}`);
        });
    });

});