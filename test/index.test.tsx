/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {render} from '@testing-library/react-native';
import RootComponent from '../src';
import StoryblokClient from 'storyblok-js-client';
import { SAMPLE_STORY } from './sampleData';
import { IdType } from '../src/interfaces/ComponentIdentification';

jest.mock('storyblok-js-client');

describe ('Root Component', () => {

    const getMocked = jest.fn(() => ({data: SAMPLE_STORY}));
    const pushStateMocked = jest.fn((state, unused, path) => {
        // @ts-ignore
        window.location = {
            // @ts-ignore
            pathname: path     
        };
    });

    beforeAll(() => {
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
            render(<RootComponent />);

            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/home');
        });
    });

    describe('Pathname', () => {
        it('should set the pathname to home if it\'s a \'/\'', () => {
            // @ts-ignore
            window.location = {
                pathname: '/'
            };
            render(<RootComponent/>);
            expect(pushStateMocked).toBeCalledTimes(1);
            expect(pushStateMocked).lastCalledWith({}, '', '/home');
            expect(window.location.pathname).toBe('/home');
        });

        it('should request the correct block based on the pathname', () => {
            // @ts-ignore
            window.location = {
                pathname: '/product/happiness'
            };
            render (<RootComponent/>);

            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/product/happiness');
        });

        it('should request home and not modify the pathname if window.history is undefined (mobile)', () => {
            window.history = undefined;
            render (<RootComponent/>);

            expect(window.history).toBe(undefined);
            expect(getMocked).toHaveBeenCalledTimes(1);
            expect(getMocked).lastCalledWith('cdn/stories/home');
        });
    });

});