import React from 'react';
import {Search, SearchProps} from '../../src/stories/Search';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SAMPLE_PRODUCT } from '../sampleData';
import StoryblokClient from 'storyblok-js-client';
import { StoryblokClientContext } from '../../contexts';

jest.mock('storyblok-js-client');

describe('Search', () => {

    let deferred = [];
    let storyblokClient;

    const getAllMocked = jest.fn(() => new Promise((resolve, reject) => {
        deferred.push({resolve, reject});
    }));

    const getComponent = (props) => {
        return <StoryblokClientContext.Provider value={storyblokClient}>
            <Search {...props} />
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
                getAll: getAllMocked
            };
        });
    });

    const getProduct = (uid) => {
        return {
            ...SAMPLE_PRODUCT.story,
            content: {
                ...SAMPLE_PRODUCT.story.content,
                _uid: uid
            }
        };
    };

    it('should make the correct search query', async () => {
        const props: SearchProps = {
            columns: 2,
            folder: '/meh',
            placeholder: 'search',
            searchDelay: 0,
            component: 'Search',
            _uid: '123',
        };

        render(getComponent(props));

        const search = screen.getByTestId('searchbar');

        fireEvent.changeText(search, 'query');

        await waitFor(() => expect(getAllMocked).toHaveBeenCalledTimes(1));
        expect(getAllMocked).toHaveBeenLastCalledWith('cdn/stories', {search_term: 'query', starts_with: '/meh'});
    });

    it('should render the correct products', async () => {
        const props: SearchProps = {
            columns: 2,
            folder: '/meh',
            placeholder: 'search',
            searchDelay: 0,
            component: 'Search',
            _uid: '123',
        };

        const productOne = getProduct('1');
        const productTwo = getProduct('2');

        render(getComponent(props));

        const search = screen.getByTestId('searchbar');

        fireEvent.changeText(search, 'query');

        await act(async () => {
            await waitFor(() => expect(deferred).toHaveLength(1));

            deferred.pop().resolve([
                productOne,
                productTwo
            ]);
        });

        const products = screen.queryAllByTestId('product');

        expect(products).toHaveLength(2);
    });
});