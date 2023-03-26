import { ProductGrid } from '../../src/components';
import React from 'react';
import { SlugContext } from '../../contexts';
import { ProductGridProps, ProductStory } from '../../src/components/ProductGrid';
import { fireEvent, render, screen} from '@testing-library/react-native';
import { Story } from '../../src/interfaces/Story';

describe('Product Grid', () => {

    const slugMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const getComponent = (props: ProductGridProps) => {
        return <SlugContext.Provider value={{setSlug: slugMock, slug: 'meh'}}>
            <ProductGrid {...props} />
        </SlugContext.Provider>;
    };

    const getProduct = (uid): ProductStory => {
        return {
            content: {
                _uid: uid,
                component: 'Product',
                title: 'meh',
                subtitle: 'meh meh',
                description: 'meh meh meh',
                image: {
                    filename: 'meh.meh'
                }
            },
            name: 'meh',
            created_at: 'meh',
            published_at: 'meh',
            id: 1,
            uuid: 'uuid',
            slug: 'slug',
            full_slug: 'full_slug'
        };
    };

    const getProductStories = (amount: number): ProductStory[] => {
        const products = [];
        for (let i = 0; i < amount; i++) {
            products.push(getProduct(i));
        }
        return products;
    };

    it('render 3 rows for 6 products with 2 columns', () => {
        const props: ProductGridProps = {
            productsStories: getProductStories(6),
            columns: 2
        };

        render(getComponent(props));

        const products = screen.queryAllByTestId('product');
        const rows = screen.queryAllByTestId('row');

        expect(products).toHaveLength(6);
        expect(rows).toHaveLength(3);
    });

    it('should render 6 rows for 6 products with 1 column', () => {
        const props: ProductGridProps = {
            productsStories: getProductStories(6),
            columns: 1
        };

        render(getComponent(props));

        const products = screen.queryAllByTestId('product');
        const rows = screen.queryAllByTestId('row');

        expect(products).toHaveLength(6);
        expect(rows).toHaveLength(6);
    });

    it('should render 3 rows for 9 products with 4 columns', () => {
        const props: ProductGridProps = {
            productsStories: getProductStories(9),
            columns: 4
        };

        render(getComponent(props));

        const products = screen.queryAllByTestId('product');
        const rows = screen.queryAllByTestId('row');

        expect(products).toHaveLength(9);
        expect(rows).toHaveLength(3);
    });

    it('should set the slug when a product is clicked on', () => {
        const props: ProductGridProps = {
            productsStories: getProductStories(6),
            columns: 2
        };

        render(getComponent(props));

        const product = screen.queryAllByTestId('product')[0];
        
        fireEvent(product, 'click');

        expect(slugMock).toHaveBeenLastCalledWith('/full_slug');
    });
});