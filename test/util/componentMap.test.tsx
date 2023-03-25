import React from 'react';
import { GenericText } from '../../src/blocks';
import { GenericTextProps } from '../../src/blocks/GenericText';
import mapBlockToComponent from '../../src/util/componentMap';

describe('Component Map', () => {
    it('should return the correct component given the string name', () => {
        const _uid = '123';

        const props: GenericTextProps = {
            component: 'GenericText',
            _uid,
            text: 'hello',
            variant: 'body',
            size: 'large',
        };

        const expectedComponent = <GenericText {...props} key={_uid}/>;

        expect(mapBlockToComponent(props)).toEqual(expectedComponent);
    });
});