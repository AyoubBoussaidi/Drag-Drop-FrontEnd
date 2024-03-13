<template>
    <div class="properties-panel" @click.stop>
        <el-button class="save-interface-btn" @click="updateTemplate" round>Save
            Interface</el-button>
        <el-button class="view-interface-btn" @click="viewInterface" round>View Interface</el-button>
        <div><el-input placeholder="Please name your interface" v-model="input" @click.stop
                aria-required="true"></el-input>
        </div>
        <div v-if="selectedElement && selectedElement.attributes.type">
            <h2>{{ selectedElement.attributes.type + ' :' }} {{ selectedElement.attributes.value }}</h2>
        </div>
        <div v-if="selectedElement">
            <el-form :model="selectedElement.attributes" ref="elementForm" label-width="80px">
                <el-form-item v-for="(value, key) in selectedElement.attributes" :key="key"
                    :label="capitalizeFirstLetter(key)">
                    <el-input v-model="selectedElement.attributes[key]" @input="updateAttribute(key)" @click.stop />

                </el-form-item>
                <el-form-item
                    v-if="(selectedElement.attributes.type != 'Button' || selectedElement.attributes.type != 'Title') && (selectedElement.textContent)"
                    :label="capitalizeFirstLetter('textContent')">
                    <el-input v-model="selectedElement.textContent" @input="updateAttribute('textContent')"
                        @click.stop />
                </el-form-item>
                <el-form-item v-if="(selectedElement)" :label="capitalizeFirstLetter('Columns')">
                    <el-input v-model="draggableElements.columns.type" @click.stop />
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <p>No element selected.</p>
        </div>
    </div>
</template>

<script>

import ApiService from '../../service/apiService';
import Vue from 'vue';

export default {
    props: {
        panelSelectedElement: {
            type: Object,
            default: () => ({}),
        },
        draggableElements: {
            type: Array,
            default: () => [],
        },
        selectedProjectId: {
            type: String,
        },
        templates: Array,
    },
    data() {
        return {
            selectedElement: {
                type: null,
                id: null,
                name: null,
                attributes: {},
                columns: {},
            },
            input: '',
            renderedInterface: null,
            templateId: null,
        };
    },
    mounted() {
        document.addEventListener('click', this.handleClick);
        console.log(draggableElements);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClick);
    },
    methods: {
        async saveTemplate() {
            if (this.input == '') {
                this.openDialogSaveTemplate();
            }

            const updatedTemplateData = {
                userId: localStorage.getItem('userId'),
                name: this.input,
                widgets: this.draggableElements.map((element) => {
                    return {
                        id: element.id,
                        type: element.type,
                        label: element.label,
                        value: element.value,
                        max: element.max,
                        min: element.min,
                        size: element.size,
                        textContent: element.textContent,
                        attributes: element.attributes,
                    };
                }),
            };

            try {
                const response = await ApiService.post('/interface', updatedTemplateData);
                this.templateId = response.data._id;

                console.log('Template saved successfully:', response.data);

                this.updateProject();
                //this.getTemplates();
            } catch (error) {
                console.error('Error saving template:', error);
                // Handle the error as needed
            }
        },
        openDialogSaveTemplate() {
            this.$alert('Interface name must be provided', 'Warning', {
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    });
                }
            });
        },
        async updateTemplate() {
            if (!this.templateId) {
                this.openDialogUpdateTemplate();
                return;
            }

            const updatedTemplateData = {
                userId: localStorage.getItem('userId'),
                name: this.input,
                widgets: this.draggableElements.map((element) => {
                    return {
                        id: element.id,
                        type: element.type,
                        label: element.label,
                        value: element.value,
                        max: element.max,
                        min: element.min,
                        size: element.size,
                        attributes: element.attributes,
                    };
                }),
            };

            try {
                const response = await ApiService.patch(`/interface/${this.templateId}`, updatedTemplateData);
                //this.getTemplates();
                this.updateProject();

                console.log('Template updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating template:', error);
            }
        },
        openDialogUpdateTemplate() {
            this.$alert('Missing Interface ID', 'Warning', {
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    });
                }
            });
        },
        openDialogViewInterface() {
            this.$alert('Missing Interface ID', 'Warning', {
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    });
                }
            });
        },
        async updateProject() {
            if (!this.templateId) {
                console.error('Template ID is required for updating the project.');
                return;
            }

            try {
                const updatedTemplateData = {
                    userId: localStorage.getItem('userId'),
                    name: this.input,
                    templateId: this.templateId,
                    widgets: this.draggableElements.map((element) => {
                        return {
                            id: element.id,
                            type: element.type,
                            label: element.label,
                            value: element.value,
                            max: element.max,
                            min: element.min,
                            size: element.size,
                            attributes: element.attributes,
                        };
                    }),
                };

                const response = await ApiService.patch(`/project/${this.selectedProjectId}`, updatedTemplateData);
                console.log('Project updated successfully.', response.data);
            } catch (error) {
                console.error('Error updating project:', error);
            }
        },
        async getTemplates() {
            try {

                const response = await ApiService.get(`/project/${this.selectedProjectId}`);
                const templates = response.data;
                this.$emit('request-templates', templates);
                console.log('method called successfuly')
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        },
        async viewInterface() {
            try {
                const templateId = this.templateId;
                if (templateId) {
                    window.open(`http://localhost:3000/interface/${templateId}/get`);
                } else {
                    this.openDialogViewInterface()
                }
            } catch (error) {
                console.error("Error opening interface:", error);
            }
        },

        handleClick(event) {
            const clickedElement = event.target;
            const targetElement = this.findElementWithId(clickedElement);

            if (targetElement) {
                const elementType = targetElement.tagName.toLowerCase();
                const attributes = this.getAttributes(targetElement);
                this.selectedElement = {
                    type: elementType,
                    id: targetElement.id,
                    name: targetElement.name,
                    value: targetElement.value,
                    size: targetElement.size,
                    min: targetElement.min,
                    max: targetElement.max,
                    textContent: targetElement.textContent,
                    attributes: attributes,
                };
            } else {
                this.selectedElement = {
                    type: null,
                    id: null,
                    name: null,
                    attributes: {},
                };
            }
            console.log('Dragaga', this.draggableElements)
        },
        findElementWithId(element) {
            while (element && !element.id) {
                element = element.parentNode;
            }
            return element;
        },
        getAttributes(element) {
            const attributes = {};
            for (const { name, value } of element.attributes) {
                attributes[name] = value;
            }
            attributes['value'] = element.value;

            return attributes;
        },
        updateAttribute(key) {
            console.log("draggableElts : ", this.draggableElements);

            console.log('Updating attribute:', key);
            console.log('draggableElements:', this.draggableElements);

            if (this.selectedElement && this.selectedElement.id) {
                const element = document.getElementById(this.selectedElement.id);

                if (element) {
                    if (key === 'textContent') {
                        // Handle special case for textContent
                        element.textContent = this.selectedElement.textContent;
                    } else {
                        // Update other attributes
                        element.setAttribute(key, this.selectedElement.attributes[key]);
                    }

                    const draggableElementIndex = this.draggableElements.findIndex(
                        (element) => element.id === this.selectedElement.id
                    );

                    if (draggableElementIndex !== -1) {
                        Vue.set(this.draggableElements, draggableElementIndex, {
                            ...this.draggableElements[draggableElementIndex],
                            [key]: this.selectedElement.attributes[key],
                        });

                        // Update other properties
                        this.draggableElements[draggableElementIndex].label = this.selectedElement.attributes['label'];
                        this.draggableElements[draggableElementIndex].value = this.selectedElement.attributes['value'];
                        this.draggableElements[draggableElementIndex].id = this.selectedElement.attributes['id'];
                        this.draggableElements[draggableElementIndex].size = this.selectedElement.attributes['size'];
                        this.draggableElements[draggableElementIndex].min = this.selectedElement.attributes['min'];
                        this.draggableElements[draggableElementIndex].max = this.selectedElement.attributes['max'];
                        this.draggableElements[draggableElementIndex].checked = this.selectedElement.attributes['checked'];

                        console.log('After update - draggableElements:', this.draggableElements);
                        this.$forceUpdate();
                    }
                }
            }
        },

        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
    },
};
</script>

<style scoped>
.save-interface-btn {
    margin: 4px;
    width: fit-content;
    color: '#F2F6FC';
}

.view-interface-btn {
    margin: 4px;
    width: fit-content;
    color: '#F2F6FC'
}

.properties-panel {
    margin-top: 0px;
    padding: 10px;
    padding-left: 5px;
    border: 2px solid #ccc;
    min-width: 400px;
}

.el-input {
    margin: 3px;
    margin-top: 0;
    padding: 4px;
    margin-right: 5px;
}

.label {
    margin-top: 5px;
    margin-left: 5px;
}

h2 {
    font-size: 18px;
    margin-bottom: 10px;

    padding: 8px;
}

p {
    font-style: italic;
    color: #888;
}
</style>
