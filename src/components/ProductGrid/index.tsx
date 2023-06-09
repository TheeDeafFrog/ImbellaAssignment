import React, {useContext} from 'react';
import { Story } from '../../interfaces/Story';
import { ProductProps } from '../../stories/Product';
import { Card } from 'react-native-paper';
import { View } from 'react-native';
import styles from './styles';
import { SlugContext } from '../../../contexts';

export interface ProductGridProps {
    productsStories: Story[]
    columns: number
}

export interface ProductStory extends Story {
    content: ProductProps
}

export function ProductGrid(props: ProductGridProps) {

    const {setSlug} = useContext(SlugContext);

    const products = props.productsStories.map((productStory: ProductStory) => {
        const product = productStory.content;
        return <Card onPress={() => setSlug(`/${productStory.full_slug}`)} key={product._uid} style={styles.card} testID='product'>
            <Card.Cover source={{uri: product.image.filename}} />
            <Card.Title title={product.title} subtitle={product.subtitle}/>
        </Card>;
    });

    const rows = products.reduce((accumulator, current, index) => {
        if (index % props.columns === 0) {
            accumulator.push([current]);
        } else {
            accumulator[accumulator.length - 1].push(current);
        }

        return accumulator;
    }, []).map((row, index) => {
        return <View style={styles.row} key={index} testID='row'>
            {row}
        </View>;
    });

    return <View style={styles.cardContainer} testID='product-grid'>
        {rows}
    </View>;
}
