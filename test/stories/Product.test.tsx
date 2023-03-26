import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Product } from '../../src/stories/Product';

describe('Product', () => {
    it('should render all components', () => {
        render(<Product title='title' subtitle='subtitle' description='description' image={{filename: 'filename'}} _uid='uid' component='component' />);
       
        screen.getByTestId('product');
        screen.getByTestId('title');
        screen.getByTestId('subtitle');
        screen.getByTestId('image');
        screen.getByTestId('description');
    });
});