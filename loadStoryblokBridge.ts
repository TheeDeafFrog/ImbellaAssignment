import {Platform} from 'react-native';

function loadBridge(callback) {
    const existingScript = document.getElementById('storyblokBridge');
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
        script.id = 'storyblokBridge';
        document.body.appendChild(script);
        script.onload = () => {
            callback();
        };
    } else {
        callback();
    }
}

export function loadStoryBlokBridge(callback) {
    if (Platform.OS === 'web' && window.location.search.includes('_storyblok')) {
        loadBridge(callback);
    }
}