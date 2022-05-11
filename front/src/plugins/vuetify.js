import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#333333',
                secondary: '#FFFFFF',
                third: '#ffbcbc',
                error: '#b71c1c',
                background: '#000000',
            },
        },
        dark: true,
    },
});
