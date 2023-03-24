import { BaseBlock } from '../interfaces/BaseBlock';
import { Page, ProductList, Title } from '../blocks';
import React from 'react';

export const COMPONENT_MAP = {
    ProductList: ProductList,
    Title: Title,
    Page: Page,
};

export default function mapBlockToComponent(content: BaseBlock) {
    const Component = COMPONENT_MAP[content.component];
    return <Component {...content}/>;
}