/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { StoryblokClientContext } from '../../contexts';
import { ProductList } from '../../src/blocks';
import { SAMPLE_PRODUCT } from '../sampleData';
import StoryblokClient from 'storyblok-js-client';
import {render, screen, act} from '@testing-library/react-native';
import { ProductListProps } from '../../src/blocks/ProductList';

jest.mock('storyblok-js-client');

describe('Product List', () => {

    let deferred = [];
    let storyblokClient;

    const getMocked = jest.fn(() => new Promise((resolve, reject) => {
        deferred.push({resolve, reject});
    })); 

    const getComponent = (props: ProductListProps) => {
        storyblokClient = new StoryblokClient({});
        return <StoryblokClientContext.Provider value={storyblokClient}>
            <ProductList {...props} />
        </StoryblokClientContext.Provider>;
    };

    beforeAll(() => {
        // @ts-ignore
        StoryblokClient.mockImplementation(() => {
            return {
                get: getMocked
            };
        });
    });

    beforeEach(() => {
        deferred = [];
        jest.clearAllMocks();
    });

    it('should show activity indicator while loading', () => {
        const uuid = 'hello';
        render(getComponent({products: [uuid], columns: 2, _uid: '123', component: 'ProductList'}));

        expect(getMocked).toBeCalledTimes(1);
        expect(getMocked).toHaveBeenLastCalledWith(`cdn/stories/${uuid}`, {
            version: 'published',
            find_by: 'uuid'
        });
        
        const activityIndicator = screen.getByTestId('activity-indicator');
        expect(activityIndicator).not.toBe(null);
    });

    it('should render product grid once loading completes', async () => {
        const uuid = 'hello';
        render(getComponent({products: [uuid], columns: 2, _uid: '123', component: 'ProductList'}));

        expect(getMocked).toBeCalledTimes(1);
        expect(getMocked).toHaveBeenLastCalledWith(`cdn/stories/${uuid}`, {
            version: 'published',
            find_by: 'uuid'
        });

        await act(() => {
            deferred.pop().resolve({data: SAMPLE_PRODUCT});
        });
    
        const productGrid = screen.findByTestId('product-grid');
        expect(productGrid).not.toBe(null);
    });
});
