import React, { useContext, useEffect, useState } from 'react';
import { SlugContext, StoryblokClientContext, StoryblokDraftModeContext } from '../../../contexts';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { IdType } from '../../interfaces/ComponentIdentification';
import { Story } from '../../interfaces/Story';
import { fetchComponent } from '../../util/fetchComponent';
import { ActivityIndicator, Card } from 'react-native-paper';
import { ProductProps } from '../../stories/Product';
import { View } from 'react-native';

interface ClientResponse {
    story: Story;
    [attributes: string]: unknown;
}

export interface ProductListProps extends BaseBlock {
    products: string[];
}

export function ProductList(props: ProductListProps) {
    const storyblokClient = useContext(StoryblokClientContext);
    const storyblokDraftMode = useContext(StoryblokDraftModeContext);
    const {setSlug} = useContext(SlugContext);
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
                return (result.value as unknown as Story).content;
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

    const products = resolvedProducts.map((product: ProductProps) => {
        return <Card onPress={() => setSlug(`/${product.full_slug}`)} key={product._uid}>
            <Card.Title title={product.title} />
            <Card.Cover source={{uri: product.image.filename}} />
        </Card>;
    });

    return <View>
        {products}
    </View>;    
}
