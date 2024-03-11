<template>
    <main>
        <header class="header">
            <div>
                <img src="../../assets/logo.png" height="70px" width="250px">
            </div>
            <div class="username-contanier">
                <label class="username-label">Welcome {{ username }}</label>
                <el-button class="logout-btn" type="danger" @click="logout" round>Logout</el-button>
            </div>
        </header>

        <div class="container">
            <aside class="sidebar">
                <el-menu default-active="addProject" class="el-menu-vertical">
                    <el-menu-item index="addProject" @click="showAddProjectModal">
                        <i class="el-icon-plus"></i>
                        <span slot="title">Add Project</span>
                    </el-menu-item>
                </el-menu>
            </aside>

            <div class="main-content">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="project in projects" :key="project._id">
                        <div @click="handleCardClick(project)">
                            <el-card class="project-card">
                                <div slot="header" class="project-card-header">
                                    <div>{{ project.name }}</div>
                                    <div>
                                        <i class="el-icon-delete" @click.stop="openDialogDelete(project._id)"></i>
                                    </div>
                                </div>
                                <div class="project-card-content">
                                    <p>{{ project.description }}</p>
                                    <p>Created by: {{ project.username }}</p>
                                </div>
                            </el-card>
                        </div>

                    </el-col>
                </el-row>
            </div>



            <el-dialog title="Add Project" :visible.sync="addProjectModalVisible"
                :before-close="beforeCloseAddProjectModal" width="30%">
                <add-project-modal v-if="addProjectModalVisible" @projectCreated="updateProjects"
                    @projectSaved="closeAddProjectModal" />
            </el-dialog>
        </div>
    </main>
</template>

<script>

import Vue from 'vue';
import AddProjectModal from '../component/AddProjectModal.vue';
import ApiService from '../../service/apiService';

export default {
    components: {
        AddProjectModal,
    },


    data() {
        return {
            addProjectModalVisible: false,
            username: localStorage.getItem('connectedUser'),
            projects: {},
            project: {},
        };
    },
    mounted() { this.getProjects() },

    methods: {
        logout() {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('connectedUser');
            delete this.axios.defaults.headers.common['Authorization'];
            this.$router.replace({ name: 'login' });
        },
        handleCardClick(project) {
            this.openProject(project)
        },
        showAddProjectModal() {
            this.addProjectModalVisible = true;
        },
        closeAddProjectModal() {
            this.addProjectModalVisible = false;

        },
        beforeCloseAddProjectModal(done) {
            done();

        },
        getProjects() {

            ApiService.get('/project')
                .then(response => {
                    this.projects = response.data;
                })
                .catch(error => {
                    console.error('Error fetching projects:', error);
                });
        },

        updateProjects() {
            this.getProjects(); // Refresh the list of projects
            this.addProjectModalVisible = false;
            ApiService.get('/project')
                .then(response => {
                    this.projects = response.data;
                })
                .catch(error => {
                    console.error('Error fetching projects:', error);
                });
        },

        deleteProject(projectId) {
            ApiService.delete(`/project/${projectId}`)
                .then(response => {
                    this.updateProjects();

                })
                .catch(error => {
                    console.error('Error deleting project:', error);
                });
        },
        openDialogDelete(projectId) {
            this.$confirm('This will delete entirly the project from the database. ', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
                buttonSize: 'mini',
                center: 'true',
            }).then(() => {
                this.deleteProject(projectId)
                this.$message({
                    height: '100px',
                    type: 'info',
                    message: 'Project Deleted Successfuly'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });
            });
        },
        openProject(project) {
            this.$router.push({ name: 'main', params: { projectId: project._id } });
            console.log('projectOpened');
        },

    }
}
</script>


<style scoped>
header {
    background-color: #f0f0f0;
    padding: 10px;

    margin-top: 0px;
    justify-content: space-between;
    display: flex;
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

.main-content {
    margin-top: 12px;
}

.el-card {
    margin-bottom: 10px;
    cursor: pointer;
}

.project-card-header {
    justify-content: space-between;
    display: flex;
}

.project-card-header i {
    margin-right: 10px;

}

.username-container {
    display: flex;
    align-items: center;
}

.sidebar {
    width: 200px;
    box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.2);
    padding: 15px;
    margin-top: 10px;
}

.el-menu-vertical {
    border: none;
}

.confirmButtonText {
    width: fit-content;
}

i {
    padding: 10px;
}
</style>