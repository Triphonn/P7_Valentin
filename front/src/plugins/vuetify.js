import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#0b0f12',
                secondary: '#FFFFFF',
                third: '#739dbc',
                fourth: '#1b1f24',
                error: '#b71c1c',
                background: '#14171b',
            },
        },
        options: {
            customProperties: true,
        },
        dark: true,
    },
});
