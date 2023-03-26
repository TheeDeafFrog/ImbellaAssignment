import React, { useContext, useEffect, useState } from 'react';
import { SlugContext, StoryblokClientContext, StoryblokDraftModeContext } from '../../../contexts';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { IdType } from '../../interfaces/ComponentIdentification';
import { Story } from '../../interfaces/Story';
import { fetchComponent } from '../../util/fetchComponent';
import { ActivityIndicator, Card } from 'react-native-paper';
import { ProductProps } from '../../stories/Product';
import { View } from 'react-native';
import styles from './styles';

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

    const products = resolvedProducts.map((productStory: Story) => {
        const product = productStory.content as ProductProps;
        return <Card onPress={() => setSlug(`/${productStory.full_slug}`)} key={product._uid} style={styles.card}>
            <Card.Cover source={{uri: product.image.filename}} />
            <Card.Title title={product.title} subtitle={product.subtitle}/>
        </Card>;
    });

    const rows = products.reduce((accumulator, current, index) => {
        if (index % 2) {
            accumulator.push([current]);
        } else {
            accumulator[accumulator.length - 1].push(current);
        }

        return accumulator;
    }, [[]]).map((row, index) => {
        return <View style={styles.row} key={index}>
            {row}
        </View>;
    });

    return <View style={styles.cardContainer}>
        {rows}
    </View>;    
}
