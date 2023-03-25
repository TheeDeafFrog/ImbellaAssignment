import React from 'react';
import {screen, render} from '@testing-library/react-native';
import { GenericText } from '../../src/blocks';

describe('Generic Text', () => {
    it('should render the given text', () => {
        const textToDisplay = 'world';

        render(<GenericText variant="display" size="medium" text={textToDisplay} component="GenericText" _uid="123"/>);

        const displayedText = screen.getByText(textToDisplay);

        expect(displayedText).not.toBe(null);
    });
});