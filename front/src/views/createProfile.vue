<template>
    <v-app id="inspire">
        <v-main>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title
                                    >Création de compte</v-toolbar-title
                                >
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                        class="form-row"
                                        name="name"
                                        label="Prénom/Nom"
                                        type="text"
                                        v-model="name"
                                    ></v-text-field>
                                    <v-text-field
                                        class="form-row"
                                        id="username"
                                        name="username"
                                        label="Nom d'utilisateur"
                                        type="username"
                                        v-model="username"
                                    ></v-text-field>
                                    <v-textarea
                                        class="form-row"
                                        id="bio"
                                        name="bio"
                                        label="Bio"
                                        type="bio"
                                        v-model="bio"
                                        auto-grow
                                    ></v-textarea>
                                    <v-file-input
                                        v-model="file"
                                        label="Photo de Profil"
                                        name="file"
                                        filled
                                        prepend-icon="mdi-camera"
                                        @change="onFileChange"
                                        accept="image/*"
                                    ></v-file-input>
                                    <!-- <input type="file"
                                    id="file" name="file"
                                    accept="image/*"
                                    @change="onFileChange"> -->
                                    <img v-if="url" :src="url" class="max-width"/>
                                </v-form>
                                <div
                                    class="form-row"
                                    v-if="
                                        mode == 'create' &&
                                        status == 'create'
                                    "
                                >
                                    Profil non crée
                                </div>
                                <v-snackbar
                                    v-model="snackbar"
                                    :timeout="1500"
                                >
                                    {{ profileError }}
                                </v-snackbar>
                            </v-card-text>
                            <v-card-actions class="form-row">
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="createProfile()"
                                    class="button"
                                    :class="{
                                        'button--disabled': !validatedFields,
                                    }"
                                >
                                    <span v-if="status == 'loading'"
                                        >Création en cours...</span
                                    >
                                    <span v-else>Créer mon profil</span>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Create',

    data: function () {
        return {
            mode: 'create',
            name: '',
            username: '',
            bio: '',
            file: {},
            url: null,
            profileError: '',
            snackbar: false,
        };
    },
    props: {
        source: String,
    },
    mounted: function () {
        const userId = this.$store.state.user.userId;
        this.verifyProfile();
        if (userId == -1) {
            this.$router.push(`/login`);
            return;
        }
        if (this.$store.state.status == 'profileCreated') {
            this.$router.push('/')
        }
    },
    computed: {
        validatedFields: function () {
            if (this.mode == 'create') {
                if (
                    this.name != '' &&
                    this.username != '' &&
                    this.bio != '' &&
                    this.file != ''
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        ...mapState(['status', 'profileInfos']),
    },
    methods: {
        onFileChange(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.file = e;
            this.url = urlCreator.createObjectURL(this.file);
        },
        switchToCreateProfile () {
            this.mode = 'create';
        },
        switchToHome () {
            this.mode = 'profileCreated';
        },
        verifyProfile: function () {
            this.$store.dispatch('verifyProfile')
        },
        createProfile () {
            const self = this;
            let today = new Date();
            let dateToday = today.toISOString().substring(0, 10);
            
            const profileInfos = {
                userId: this.$store.state.user.userId,
                name: this.name,
                username: this.username,
                bio: this.bio,
                banner: null,
                date: dateToday,
            }
            let formData = new FormData();
            formData.append("image", this.file);
            formData.set("profile", JSON.stringify(profileInfos));

            this.$store
                .dispatch('createProfile', formData)
                .then(function () {
                    self.$router.push('/home');
                    self.switchToHome();
                })
                .catch((error) => {
                    console.log(error);
                    this.snackbar = true;
                    this.profileError = 'Nom d\'utilisateur déjà utilisé';
                })
        },
        returnToHome: function() {
            this.$router.push('/home');
        }
    },
};
</script>

<style>

.max-width{
    max-width: 400px;
}
.form-row {
    display: flex;
    margin: 16px 0px;
    gap: 16px;
    flex-wrap: wrap;
}

.form-row__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex: 1;
    min-width: 100px;
    color: black;
}

.form-row__input::placeholder {
    color: #aaaaaa;
}
.card__action {
    color: #2196f3;
    text-decoration: underline;
}

.card__action:hover {
    cursor: pointer;
}
</style>
