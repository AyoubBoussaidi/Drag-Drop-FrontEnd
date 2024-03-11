<template>
    <main>
        <header class="header">
            <div>
                <img src="../assets/logo.png" height="70px" width="250px">
            </div>
            <div class="username-contanier">
                <label class="username-label">Welcome {{ username }}{{ project ? project.name : '' }}</label>
                <el-button class="logout-btn" type="danger" @click="logout" round>Logout</el-button>
            </div>
        </header>
    </main>
</template>

<script>
export default {

    mounted() {
        this.username = localStorage.getItem('connectedUser');
    },
    data() {
        return {
            username: ''
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('connectedUser');
            delete this.axios.defaults.headers.common['Authorization'];
            this.$router.replace({ name: 'login' });
        }
    },
}
</script>

<style scoped>
.main {
    margin-top: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

header {
    background-color: #f0f0f0;
    padding: 10px;
    margin-right: 35px;
    margin-left: 35px;
    margin-top: 0px;
    justify-content: space-between;
    display: flex;
}

.container {
    display: flex;
    position: absolute;
    background-color: white;
    margin-top: 20px;
    left: 0;
    right: 0;
}

.drag-area {
    flex-direction: column;
    border: 2px solid #ccc;
    margin-left: 10px;
    margin-right: 20px;
    padding: 20px;
    width: 200px;
}

.drop-area {
    border: 2px solid #ccc;
    margin-left: 10px;
    padding: 20px;
    width: 600px;
    min-width: 500px;
}

.logout-btn {
    color: black;
    padding: 10px;
    border: none;
    cursor: pointer;
    width: fit-content;
    margin-left: 5px;
}

.username-label {
    margin-right: 10px;
    text-decoration: solid;
    font-family: 'Lucida Sans',
}

.username-container {
    display: flex;
    align-items: center;
}

.el-button {
    margin: 4px;
}

.choice-btn {
    margin-right: 3px;
    width: 200px;
}

.button-container {
    display: flex;
    flex-direction: column;
}

.img {
    height: 100px;
    width: 300px;
    margin-left: 0;
    margin-right: auto;

}
</style>