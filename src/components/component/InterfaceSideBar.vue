<template>
    <aside class="sidebar">
        <el-menu default-active="interfaces" class="el-menu-vertical">
            <el-menu-item class="button" index="saveInterface" @click="saveTemplate">
                <i class="el-icon-plus"></i>
                <span slot="title">Add Interface</span>
            </el-menu-item>
            <el-menu-item class="label" index="interfaceName">
                <!--  <el-button @click="getTemplates(selectedProjectId)">Load Interfaces</el-button> -->
                <div v-if="templates.length > 0">

                    <el-menu-item v-for="template in templates" :key="template._id" :index="template._id"
                        @click="handleInterfaceClick(template.templateId)">
                        <img src="https://demo.softyflow.io/ide/icon/svg/interface.svg" alt="Interface Icon" height="30"
                            width="30">
                        <span slot="title">{{ template.name }}</span>
                    </el-menu-item>
                </div>

                <div v-else>
                    No templates available.
                </div>
            </el-menu-item>
        </el-menu>
    </aside>
</template>

<script>
import ApiService from '../../service/apiService';

export default {

    data() {
        return {
            templates: [],
        }

    },
    props: {
        labelText: String,
        buttonText: String,
        selectedProjectId: {
            type: String,
        },
    },
    mounted() {
        this.getTemplates(this.selectedProjectId)
    },

    watch: {
        selectedProjectId(newVal, oldVal) {
            if (newVal !== null && newVal !== undefined) {
                this.getTemplates(newVal);
            }
        },
    },
    methods: {
        handleButtonClick() {
            console.log('Button clicked!');
        },
        async saveTemplate() {
            this.$emit('save-template');
        },
        async getTemplates(selectedProjectId) {
            try {
                if (this.selectedProjectId) {
                    const response = await ApiService.get(`/project/${selectedProjectId}`);
                    this.templates = response.data;
                    console.log('method called successfully');
                } else {
                    console.error('selectedProjectId is null or undefined');
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        },
        handleInterfaceClick(interfaceId) {
            this.getInterface(interfaceId)
            //this.$emit('interface-click', interfaceId);
        },
        async getInterface(interfaceId) {
            try {
                const response = await ApiService.get(`/interface/${interfaceId}`);
                const interfaceData = response.data;
                console.log('Interface data retrieved successfully:', interfaceData);

                this.$emit('interface-clicked', interfaceData);
            } catch (error) {
                console.error('Error fetching interface data:', error);
            }
        },

    },
};
</script>

<style scoped>
.interface-sidebar {
    margin-right: auto;
    padding: 10px;
    width: 30%;
    background-color: #f0f0f0;
}

.button {
    border: 0.3 solid black;
    color: '#F2F6FC';
    padding: 5px;
}

.label {
    border: 0.3 solid black;


}
</style>
