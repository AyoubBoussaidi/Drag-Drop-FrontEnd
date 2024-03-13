<template>
  <html>

  <head>
    <link rel="stylesheet" href="https://jspreadsheet.com/v7/jspreadsheet.css" type="text/css" />
    <link rel="stylesheet" href="https://jsuites.net/v5/jsuites.css" type="text/css" />
  </head>
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
      <div class="sideBar">
        <InterfaceSideBar :labelText="sidebarLabel" :buttonText="sidebarButton" :templates="templates"
          :selectedProjectId="selectedProjectId" @request-templates="handleRequestTemplates"
          @save-template="callSaveTemplate" />
      </div>
      <div class="drag-area  button-container">
        <div class="drag-item drag-container" v-for="(item, index) in items" :key="item.id"
          @dragstart="handleDragStart($event, item)" @drop="handleDrop($event, index)" draggable="true">
          <el-button>
            {{ item.name }}
          </el-button>
        </div>

      </div>
      <div id="dragArea" ref="dragArea" class="drop-area" @dragover="allowDrop" @drop="handleDropInDropArea">
        <div>
          <div id="my-spreadsheet"></div>
          <!--           <div><input type="button" value="Add new row" @click="addNewRow" /></div> -->
          <div v-if="spreadsheet"><input type="button" value="Add new column" @click="addColumn" /></div>
        </div>
      </div>

      <element-properties-panel class="element-properties-panel" :panelSelectedElement="selectedElement"
        :draggableElements="draggableElements" @updateAttributes="updateAttributes"
        :selectedProjectId="selectedProjectId" ref="elementPropertiesPanel" />
    </div>
  </main>

  </html>
</template>

<script>
import Vue from 'vue';
import draggable from 'vuedraggable';
import axios from 'axios';
import VueAxios from 'vue-axios';
import elementPropertiesPanel from './ElementPropertiesPanel.vue';
import InterfaceSideBar from '../component/InterfaceSideBar.vue';
import { mapMutations } from 'vuex';
import jspreadsheet from 'jspreadsheet-ce';

Vue.use(VueAxios, axios);

export default {
  components: {
    InterfaceSideBar,
    elementPropertiesPanel,
    draggable,
  },
  created() {
    console.log('Main component created');
  },

  mounted() {
    this.username = localStorage.getItem('connectedUser');
    const projectId = this.$route.params.projectId;
    this.$store.commit('setSelectedProjectId', projectId);
    console.log('Project IDDDDDD:', projectId);
    let spreadsheet = jspreadsheet(this.$el, options);
    Object.assign(this, spreadsheet);
  },
  computed: {
    selectedProjectId() {
      return this.$store.state.selectedProjectId;
    },
  },

  data() {
    return {
      items: [
        { id: 1, name: 'Input', label: 'input', color: '#F2F6FC', round: true },
        { id: 2, name: 'Button', label: 'button', color: '#F2F6FC', round: true },
        { id: 4, name: 'Number', label: 'number', color: '#F2F6FC', round: true },
        { id: 5, name: 'Title', label: 'title', color: '#F2F6FC', round: true },
        { id: 3, name: 'SpreadSheet', label: 'spreadsheet', color: '#F2F6FC', round: true },
      ],
      draggableElements: [],
      selectedElement: null,
      generatedElements: [],
      username: localStorage.getItem('connectedUser'),
      projectId: this.$route.params.projectId,
      sidebarLabel: 'Your Label Text',
      sidebarButton: 'Add Interface',
      templates: [],
      isDragging: false,
      options: {
        data: [[]],
        minDimensions: [3, 1],
        filters: true,

      },
    };
  },

  methods: {
    ...mapMutations(['setSelectedProjectId']),

    logout() {
      localStorage.removeItem('jwtToken');
      delete this.axios.defaults.headers.common['Authorization'];
      this.$router.replace({ name: 'login' });
    },
    callSaveTemplate() {
      this.$refs.elementPropertiesPanel.saveTemplate();
    },
    handleUpdateProjectTemplates(templates) {
      this.templates = templates;
    },
    handleDragStart(event, item) {
      event.dataTransfer.setData('text/plain', item.label);
      console.log("Called handleDragStart");
    },

    allowDrop(event) {
      event.preventDefault();
      console.log("Called allowDrop");
    },

    handleDropInDropArea(event) {
      const label = event.dataTransfer.getData('text/plain');
      let element;
      if (label === 'input') {
        element = document.createElement('input');
        element.setAttribute('type', 'input');
        element.setAttribute('id', `input_${this.draggableElements.length + 1}`);
        element.setAttribute('placeholder', 'Paste your text here');
        element.setAttribute('value', `Default Value`);
        element.setAttribute('size', `10`);
        element.style.border = '1px solid #ccc';
        element.style.padding = '5px';
      } else if (label === 'number') {
        element = document.createElement('input');
        element.setAttribute('type', 'number');
        element.setAttribute('id', `number${this.draggableElements.length + 1}`);
        element.setAttribute('max', '10');
        element.setAttribute('min', '0');
        element.style.width = '400px';
      } else if (label === 'checkbox') {
        element = document.createElement('input');
        element.setAttribute('type', 'Checkbox');
        element.setAttribute('id', `element_${this.draggableElements.length + 1}`);
        element.setAttribute('label', `checkbox ${this.draggableElements.length + 1}`);
        element.setAttribute('checked', 'true')


      } else if (label === 'button') {
        element = document.createElement('button');
        element.setAttribute('value', 'Button');
        element.setAttribute('type', 'Button');
        element.setAttribute('id', `element_${this.draggableElements.length + 1}`);

        element.textContent = `Button ${this.draggableElements.length + 1}`;
        element.style.backgroundColor = '#C0C4CC';
        element.style.color = 'white';
        element.style.width = '200px'
        element.style.padding = '8px 16px';
      } else if (label === 'title') {
        element = document.createElement('h1');
        element.setAttribute('id', `title_${this.draggableElements.length + 1}`);
        element.setAttribute('type', 'Title');
        element.textContent = `Title ${this.draggableElements.length + 1}`;
        element.style.color = '#333';
        element.style.marginBottom = '10px';
      } else if (label === 'spreadsheet') {
        element = document.createElement('div');
        element.setAttribute('id', `my-spreadsheet`);
        element.setAttribute('type', 'spreadsheet');
        //element.textContent = `Title ${this.draggableElements.length + 1}`;
        element.style.color = '#333';
        element.style.marginBottom = '10px';
        this.initializeJSpreadsheet();

      }


      if (label != 'button' && label != 'title' && label != 'spreadsheet') {
        element.setAttribute('label', `${label} ${this.draggableElements.length + 1}`);
      }
      element.setAttribute('class', 'dropped-item');
      element.style.display = 'block';


      const container = document.createElement('div');
      container.setAttribute('class', 'dropped-item-container');
      container.style.display = 'block';
      container.style.padding = '10px'

      const labelElement = document.createElement('span');
      labelElement.textContent = element.getAttribute('label');
      labelElement.setAttribute('class', 'dropped-item-label');

      container.appendChild(labelElement);
      container.appendChild(element);

      this.draggableElements.push({
        type: label,
        id: element.getAttribute('id'),
        label: element.getAttribute('label'),
        textContent: element.textContent,
        value: element.getAttribute('value'),
        min: element.getAttribute('min'),
        max: element.getAttribute('max'),
        size: element.getAttribute('size'),
      });

      this.$refs.dragArea.appendChild(container);
      event.target.appendChild(container);
    },


    initializeJSpreadsheet() {
      // Initialize jSpreadsheet
      this.spreadsheet = jspreadsheet(document.getElementById('my-spreadsheet'), this.options);
    },
    addNewRow() {
      // Add new row to the spreadsheet
      if (this.spreadsheet) {
        this.spreadsheet.destroy();
        this.spreadsheet.insertRow();
        this.initializeJSpreadsheet()
      }
    },
    addColumn() {
      // Add new column to the spreadsheet
      if (this.spreadsheet) {
        this.spreadsheet.destroy();
        this.spreadsheet.insertColumn();
        this.initializeJSpreadsheet()

      }
    },
    updateAttributes(newAttributes) {
      console.log('Before update - newAttributes:', newAttributes);
      console.log('Before update - selectedElement:', this.selectedElement);

      console.log('Before update - draggableElements:', this.draggableElements);
      if (this.selectedElement) {
        this.selectedElement.attributes = newAttributes;
        this.updateElementAttributes(this.selectedElement.id, newAttributes);

        const draggableElementIndex = this.draggableElements.findIndex(
          (element) => element.id === this.selectedElement.id
        );

        if (draggableElementIndex !== -1) {
          Vue.set(this.draggableElements, draggableElementIndex, {
            ...this.draggableElements[draggableElementIndex],
            label: newAttributes['label'],

            value: newAttributes['value'],
            id: newAttributes['id'],
            size: newAttributes['size'],
            min: newAttributes['min'],
            max: newAttributes['max'],
            checked: newAttributes['checked'],
            textContent: newAttributes['textContent'],
            placeholder: newAttributes['placeholder'],
          });
          console.log('After update - draggableElements:', this.draggableElements);
        }
      }
    },

    handleRequestTemplates() {
      //this.$refs.elementPropertiesPanel.getTemplates();
    },

  },
};
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
  margin-top: 0px;
  justify-content: space-between;
  display: flex;
}

.container {
  display: flex;
  position: absolute;
  background-color: white;
  margin-top: 20px;
  justify-content: space-between;

}

.sideBar {
  width: 400px;
  padding: 20px;
  margin-left: 0;
}

.drag-area {
  flex-direction: column;
  border: 2px solid #ccc;
  margin-left: 10px;
  margin-right: 10px;
  padding: 20px;
}



.element-properties-panel {
  flex-direction: column;
  border: 2px solid #ccc;
  margin-left: 10px;
  right: 0;
  margin-right: 10px;
  padding: 20px;
}

.logout-btn {
  color: black;
  padding: 10px;
  border: none;
  cursor: pointer;
  width: 100px;
  margin-left: 5px;
}

.username-label {
  margin-right: 10px;
  text-decoration: solid;
  font-family: 'Lucida Sans';
}

.username-container {
  display: flex;
  align-items: center;
}

.el-button {
  margin: 4px;
  width: 120px;
}

.choice-btn {
  margin-right: 3px;
  width: 200px;
}

.dropped-item {
  width: max-content;
  margin: 20px;
  padding: 20px;
}

.img {
  height: 100px;
  width: 300px;
  margin-left: 0;
  margin-right: auto;
}



.dropped-item-label {
  margin-right: 10px;
}

.drop-area {
  border: 2px solid #ccc;
  margin-left: auto;
  padding: 30px;

  min-width: 600px;
  align-items: center;
}
</style>
