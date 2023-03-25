import React from 'react';
import { Text } from 'react-native';
import { BaseBlock } from '../../interfaces/BaseBlock';

interface ProductProps extends BaseBlock {
    title: string;
}

export function Product(props: ProductProps) {
    return <Text>
        {props.title}
    </Text>;
}