import { ComponentIdentification, IdType } from '../../src/interfaces/ComponentIdentification';
import { fetchComponent } from '../../src/util/fetchComponent';
import StoryblokClient from 'storyblok-js-client';

describe('Fetch Component', () => {

    const getMockFn = jest.fn();
    const client = {
        get: getMockFn
    } as unknown as StoryblokClient;

    beforeEach(() => {
        getMockFn.mockReset();
    });

    it('should fetch for the path type', async () => {
        const identification: ComponentIdentification = {
            id: 'cdn/stories/meh',
            idType: IdType.path,
        };

        const data = 'data!';
        getMockFn.mockResolvedValue({data});

        const result = await fetchComponent<string>(identification, client, true);

        expect(getMockFn).toBeCalledTimes(1);
        expect(getMockFn).toHaveBeenLastCalledWith('cdn/stories/meh', {version: 'draft'});
        expect(result).toBe(data);
    });
});