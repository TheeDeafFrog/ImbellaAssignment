import React from 'react';
import {screen, render, fireEvent} from '@testing-library/react-native';
import { Button } from '../../src/blocks';
import { SlugContext } from '../../contexts';
import { ButtonProps } from '../../src/blocks/Button';

describe('Button', () => {

    const setSlugMocked = jest.fn();

    const getComponent = (props: ButtonProps) => {
        return <SlugContext.Provider value={{slug: 'meh', setSlug: setSlugMocked}} >
            <Button {...props}>
                {props.label}
            </Button>
        </SlugContext.Provider>;
    };


    it('should set slug when clicked on', () => {
        const slug = 'hello/world';
        render (getComponent({mode: 'text', slug, label: 'meh', component: 'Button', _uid: '123'}));

        const button = screen.getByTestId('button');
        fireEvent(button, 'click');

        expect(setSlugMocked).toBeCalledTimes(1);
        expect(setSlugMocked).toHaveBeenLastCalledWith('hello/world');
    });
});