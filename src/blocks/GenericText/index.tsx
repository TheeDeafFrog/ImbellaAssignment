import React from 'react';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { Text, MD3TypescaleKey } from 'react-native-paper';

export interface GenericTextProps extends BaseBlock {
    text: string;
    variant: 'display' | 'headline' | 'title' | 'body' | 'label';
    size: 'small' | 'medium' | 'large';
    color?: string;
}

export function GenericText(props: GenericTextProps) {
    const fullVariant = `${props.variant}${props.size.charAt(0).toUpperCase() + props.size.slice(1)}` as MD3TypescaleKey;

    return <Text testID='generic-text'
        variant={fullVariant}
        style={props.color ? {color: props.color} : {}}
    >
        {props.text}
    </Text>;
}
