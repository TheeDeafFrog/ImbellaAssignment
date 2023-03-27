import React, { useContext } from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { SlugContext } from '../../../contexts';
import { BaseBlock } from '../../interfaces/BaseBlock';

export interface ButtonProps extends BaseBlock {
    slug: string;
    label: string;
    mode: 'text' | 'outlined' | 'elevated' | 'contained-tonal',
}

export function Button(props: ButtonProps) {

    const {setSlug} = useContext(SlugContext);

    return <PaperButton onPress={() => setSlug(props.slug)} mode={props.mode} testID='button'>
        {props.label}
    </PaperButton>;
}
