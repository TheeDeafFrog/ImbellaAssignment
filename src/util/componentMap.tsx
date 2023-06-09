import { BaseBlock } from '../interfaces/BaseBlock';
import { ProductList, GenericText, Button } from '../blocks';
import { Product, Page, TopBar, Search } from '../stories';
import React from 'react';

export const COMPONENT_MAP = {
    ProductList: ProductList,
    GenericText: GenericText,
    Page: Page,
    Product: Product,
    Topbar: TopBar,
    Search: Search,
    Button: Button, 
};

export default function mapBlockToComponent(content: BaseBlock) {
    if (!Object.keys(COMPONENT_MAP).includes(content.component)) {
        throw new Error(`Component '${content.component}' requested by Storyblok is not recognized by the component mapper.`);
    }
    const Component = COMPONENT_MAP[content.component];
    return <Component {...content} key={content._uid}/>;
}