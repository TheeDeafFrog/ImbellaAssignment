import { BaseBlock } from '../interfaces/BaseBlock';
import { ProductList, Title } from '../blocks';
import { Product, Page } from '../stories';
import React from 'react';

export const COMPONENT_MAP = {
    ProductList: ProductList,
    Title: Title,
    Page: Page,
    Product: Product,
};

export default function mapBlockToComponent(content: BaseBlock) {
    const Component = COMPONENT_MAP[content.component];
    return <Component {...content}/>;
}