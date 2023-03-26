import React, { useContext, useEffect, useState } from 'react';
import { StoryblokClientContext, StoryblokDraftModeContext } from '../../../contexts';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { IdType } from '../../interfaces/ComponentIdentification';
import { Story } from '../../interfaces/Story';
import { fetchComponent } from '../../util/fetchComponent';
import { ActivityIndicator } from 'react-native-paper';
import { ProductGrid } from '../../components/ProductGrid';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export interface ProductListProps extends BaseBlock {
    products: string[];
    columns: number;
}

export function ProductList(props: ProductListProps) {
    const storyblokClient = useContext(StoryblokClientContext);
    const storyblokDraftMode = useContext(StoryblokDraftModeContext);
    const [resolvedProducts, setResolvedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const promises = props.products.map((productUid) => new Promise((resolve) => {
            fetchComponent<ClientResponse>({
                id: `cdn/stories/${productUid}`,
                idType: IdType.uuid
            }, storyblokClient, storyblokDraftMode).then((response) => resolve(response.story));
        }));

        Promise.allSettled(promises).then((results) => results.map((result) => {
            if (result.status === 'fulfilled') {
                return (result.value as unknown as Story);
            }
            return null;
        })).then((intermediateProducts) => {
            return intermediateProducts.filter((product) => product !== null);
        }).then((filteredProducts) => {
            setResolvedProducts(filteredProducts);
            setLoading(false);
        });
    }, [props.products]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return <ProductGrid productsStories={resolvedProducts} columns={props.columns} />;
}
