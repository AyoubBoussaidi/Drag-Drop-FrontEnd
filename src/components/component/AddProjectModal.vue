<template>
    <div class="form-container">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="Name" class="form-item">
                <el-input v-model="form.name" class="custom-input"></el-input>
            </el-form-item>
            <el-form-item label="Description" class="form-item">
                <el-input v-model="form.description" class="custom-input"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button type="primary" @click="addProject">Create</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import ApiService from '../../service/apiService'

export default {
    data() {
        return {
            form: {
                name: "",
                userId: '', // userId is automatically filled in the login component
                description: "",
            },
            rules: {
                name: [
                    { required: true, message: 'Please Enter Project Name', trigger: 'blur' },
                ],
                description: [
                    { required: true, message: 'Please Enter Project Description', trigger: 'blur' },
                ],
            },
            loading: false,
        };
    },
    methods: {
        onSubmit() {
            const storedUserId = localStorage.getItem('userId');
            this.$set(this.form, 'userId', storedUserId);

            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;

                    ApiService.post('/project', this.form)
                        .then(response => {
                            this.$refs.form.resetFields();
                            this.$message({
                                type: 'success',
                                message: 'Project Added Successfully'
                            });
                            console.log("Added project", response.data);
                            this.$emit('projectCreated'); // Emit event after project creation
                        })
                        .catch(error => {
                            console.error('Error creating project:', error);
                        })
                        .finally(() => {
                            // Reset the loading state regardless of success or failure
                            this.loading = false;
                        });
                } else {
                    // If the form is not valid, log the validation failure
                    console.log('Form validation failed.');
                }
            });
        },
        addProject() {
            this.$refs.form.validate((valid) => {
                const storedUserId = localStorage.getItem('userId');
                this.$set(this.form, 'userId', storedUserId);
                if (valid) {
                    //this.loading = true;

                    ApiService.post('/project', this.form)
                        .then(response => {
                            this.$refs.form.resetFields();
                            this.$message({
                                type: 'success',
                                message: 'Project Added Successfully'
                            });
                            console.log("Added project", response.data);
                            this.$emit('projectCreated'); // Emit event after project creation
                        })
                        .catch((error) => {
                            console.error('Error creating project:', error);
                        });

                } else {
                    console.log('Form validation failed.');
                }
            });
        },


    },
};
</script>

<style scoped>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    padding: 10px;
}

.custom-input {
    padding-right: 10px;
    margin-right: 10px;
}

.form-item {
    margin-right: 20px;
}

.el-form {
    padding: 10px;
    margin-left: 30px;
}
</style>../../service/apiService
