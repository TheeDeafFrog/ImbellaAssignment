import React from 'react';
import { BaseBlock } from '../../interfaces/BaseBlock';
import mapBlockToComponent from '../../util/componentMap';

interface PageProps extends BaseBlock {
    pageContent: ReadonlyArray<BaseBlock>;
}

export function Page(props: PageProps) {
    return props.pageContent.map((block) => mapBlockToComponent(block));
}