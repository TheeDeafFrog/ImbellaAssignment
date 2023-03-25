import React from 'react';
import { BaseBlock } from '../../interfaces/BaseBlock';
import mapBlockToComponent from '../../util/componentMap';
import { View } from 'react-native';

interface PageProps extends BaseBlock {
    pageContent: ReadonlyArray<BaseBlock>;
}

export function Page(props: PageProps): React.ReactElement {
    return <View testID='page'>
        {props.pageContent.map((block) => mapBlockToComponent(block))}
    </View>;
}