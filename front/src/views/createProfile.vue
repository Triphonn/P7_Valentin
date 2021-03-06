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
                                        class="form-row mg-15"
                                        name="name"
                                        color="secondary"
                                        label="Prénom/Nom"
                                        type="text"
                                        counter="20"
                                        :rules="[rules.length(20)]"
                                        v-model="name"
                                    ></v-text-field>
                                    <v-text-field
                                        class="form-row mg-15"
                                        id="username"
                                        color="secondary"
                                        name="username"
                                        label="Nom d'utilisateur"
                                        type="username"
                                        :rules="[rules.length(16)]"
                                        counter="16"
                                        v-model="username"
                                    ></v-text-field>
                                    <v-textarea
                                        class="form-row mg-15"
                                        color="secondary"
                                        id="bio"
                                        name="bio"
                                        label="Bio"
                                        type="bio"
                                        counter="100"
                                        :rules="[rules.length(100)]"
                                        v-model="bio"
                                        auto-grow
                                    ></v-textarea>
                                    <v-file-input class="text-field-post mg-15" hide-input @blur="search = ''" prepend-icon="mdi-image-plus" @change="onFileChange" accept="image/*" />
                                    <div v-if="url" class="flex-row-top width-150-150">
                                        <v-img v-if="url" class="img-file" width="150px" height="150px" :src="url" >
                                        </v-img>
                                        <div class="width-50 icon-basic tr-color cursor padding-basic">
                                            <v-icon v-if="url" @click.stop="file = '', url = null" dense size="24" color="secondary">
                                            mdi-close
                                            </v-icon>
                                        </div>
                                    </div>
                                </v-form>
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
                                    color="third"
                                    @click="createProfile()"
                                    class="button button-radius"
                                    :disabled="!validatedFields"
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
            file: '',
            url: null,
            profileError: '',
            snackbar: false,
            rules: {
                length: len => v => (v || '').length <= len || `Vous avez atteint le maximum de charactères (${len})`,
            },
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
                    this.username.length <= 16 &&
                    this.name.length <= 20 &&
                    !this.username.match(/^\s*$/) &&
                    !this.name.match(/^\s*$/)
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
            
            const profileInfos = {
                userId: this.$store.state.user.userId,
                name: this.name,
                username: this.username,
                bio: this.bio,
                banner: null,
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

<style scoped>

.max-width{
    max-width: 400px;
}
.img-file{
  margin-top: 15px;
  background-size: cover;
  border-radius: 15px;
  object-fit: cover;
}
.button-radius{
    border-radius: 20px;
}
.form-row {
    display: flex;
    margin: 16px 0px;
    gap: 16px;
    flex-wrap: wrap;
}

.mg-15{
    margin-right: 15px;
    margin-left: 15px;
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
