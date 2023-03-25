import React from 'react';
import { Text, ScrollView } from 'react-native';
import { BaseBlock } from '../../interfaces/BaseBlock';
import styles from './styles';

export interface TitleProps extends BaseBlock {
    title: string;
    subtitle: string;
}

export function Title(props: TitleProps) {
    return <ScrollView>
        <Text style={styles.title}>
            {props.title}
        </Text>
        <Text style={styles.subTitle}>
            {props.subtitle}
        </Text>
    </ScrollView>;
}