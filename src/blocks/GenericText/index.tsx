import React from 'react';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { Text, MD3TypescaleKey } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export interface GenericTextProps extends BaseBlock {
    text: string;
    variant: 'display' | 'headline' | 'title' | 'body' | 'label';
    size: 'small' | 'medium' | 'large';
    color?: string;
    margin?: boolean;
    center?: boolean;
}

export function GenericText(props: GenericTextProps) {
    const fullVariant = `${props.variant}${props.size.charAt(0).toUpperCase() + props.size.slice(1)}` as MD3TypescaleKey;

    const styles = StyleSheet.create({
        text: {
            color: props.color || null,
            margin: props.margin ? 15 : 5,
            textAlign: props.center ? 'center' : 'auto'
        }
    });

    return <Text testID='generic-text'
        variant={fullVariant}
        style={styles.text}
    >
        {props.text}
    </Text>;
}
