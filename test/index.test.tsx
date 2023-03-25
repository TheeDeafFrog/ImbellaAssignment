/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {act, render, screen} from '@testing-library/react-native';
import RootComponent from '../src';
import StoryblokClient from 'storyblok-js-client';
import { SAMPLE_STORY } from './sampleData';
import { StoryblokClientContext } from '../contexts';
import { Page } from '../src/stories';

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
        deferred = [];

        // @ts-ignore
        StoryblokClient.mockImplementation(() => {
            return {
                get: getMocked
            };
        });
        // @ts-ignore
        window.history = {
            pushState: pushStateMocked
        };

        storyblokClient = new StoryblokClient({});
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // @ts-ignore
        window.location = {
            pathname: '/'
        };
    });

    describe('Client', () => {
        it('should use the client to request the story', () => {
            render(getComponent());

            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/home', {version: 'published'});
        });

        it('should fetch and render a story', async () => {
            render(getComponent());

            await act(() => {
                deferred.pop().resolve({data: SAMPLE_STORY});
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

            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/product/happiness', {version: 'published'});
        });

        it('should request home and not modify the pathname if window.history is undefined (mobile)', () => {
            window.history = undefined;
            
            render(getComponent());

            expect(window.history).toBe(undefined);
            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/home', {version: 'published'});
        });
    });

});