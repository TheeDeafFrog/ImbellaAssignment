import React from 'react';
import { View, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { BaseBlock } from '../../interfaces/BaseBlock';
import styles from './styles';

export interface ProductProps extends BaseBlock {
    title: string;
    subtitle: string;
    description: string;
    image: {
        filename: string;
        [key: string]: unknown
    }
}

export function Product(props: ProductProps) {
    return <View testID='product' style={styles.container}>
        <Text variant="displayMedium" style={styles.title}>
            {props.title}
        </Text>
        <Text variant="titleLarge" style={styles.subtitle}>
            {props.subtitle}
        </Text>
        <Surface
            style={styles.surface}
        >
            <Image 
                source={{
                    uri: props.image.filename
                }}
                style={styles.image}
            />
            <Text
                style={styles.text}
            >
                {props.description}
            </Text>
        </Surface>
    </View>;
}