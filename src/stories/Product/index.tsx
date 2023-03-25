import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { BaseBlock } from '../../interfaces/BaseBlock';
import Markdown from '@jonasmerlin/react-native-markdown-display';

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
    return <View testID='product'>
        <Text variant="headlineLarge">
            {props.title}
        </Text>
        <Text variant="titleLarge">
            {props.subtitle}
        </Text>
        <Image 
            source={{
                uri: props.image.filename
            }}
        />
        {/* <Markdown>
            {props.description}
        </Markdown> */}
        <Text>
            {props.description}
        </Text>
    </View>;
}