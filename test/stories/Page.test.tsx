import React from 'react';
import {render, screen, act} from '@testing-library/react-native';
import { Page } from '../../src/stories/Page';
import { SAMPLE_HOME, SAMPLE_PRODUCT, SAMPLE_SIMPLE_HOME } from '../sampleData';
import { StoryblokClientContext } from '../../contexts';


describe.only('Page', () => {
    it('should render the correct blocks', async () => {
        const deferred = [];
        const client = {
            get: () => new Promise((resolve, reject) => {
                deferred.push({resolve, reject});
            })
        };

        render(
            <StoryblokClientContext.Provider value={client}>
                <Page pageContent={SAMPLE_HOME.story.content.pageContent} _uid="meh" component='Page'/>
            </StoryblokClientContext.Provider>
        );

        await act(() => {
            deferred.pop().resolve({data: SAMPLE_PRODUCT});
        });

        screen.getByTestId('generic-text');
        screen.getByTestId('product-list');
    });
});
