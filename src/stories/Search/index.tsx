import React, {useState, useEffect, useContext} from 'react';
import { BaseBlock } from '../../interfaces/BaseBlock';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import styles from './styles';
import { Story } from '../../interfaces/Story';
import { StoryblokClientContext } from '../../../contexts';
import { ProductGrid } from '../../components';

export interface SearchProps extends BaseBlock {
    columns: number,
    folder: string,
    placeholder: string,
    searchDelay: number
}

export function Search(props: SearchProps) {

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchBoxInput, setSearchBoxInput] = useState<string>('');
    const [typingTimer, setTypingTimer] = useState(null);
    const [searching, setSearching] = useState<boolean>(false);
    const [productStories, setProductStories] = useState<Story[]>([]);

    const storyblokClient = useContext(StoryblokClientContext);

    useEffect(() => {
        if (searchQuery !== '') {
            storyblokClient.getAll('cdn/stories', {
                search_term: searchQuery,
                starts_with: props.folder,
            }).then((response: Story[]) => {
                setProductStories(response);
                setSearching(false);
            });
        }
    }, [searchQuery]);

    const onChangeText = (query: string) => {
        setSearchBoxInput(query);
        clearTimeout(typingTimer);
        if (query !== '') {
            setSearching(true);
            setTypingTimer(setTimeout(() => setSearchQuery(query), Number(props.searchDelay)));
        } else {
            setSearching(false);
        }
    };

    return <View>
        <Searchbar
            style={styles.searchbox}
            placeholder={props.placeholder}
            onChangeText={onChangeText}
            value={searchBoxInput}
            testID='searchbox'
        />
        {searching ?
            <ActivityIndicator/> :
            <ProductGrid productsStories={productStories} columns={props.columns}/>    
        }
    </View>;
}
