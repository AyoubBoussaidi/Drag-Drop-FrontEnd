<template>
    <html>

    <head>
        <link rel="stylesheet" href="https://jspreadsheet.com/v7/jspreadsheet.css" type="text/css" />
        <link rel="stylesheet" href="https://jsuites.net/v5/jsuites.css" type="text/css" />
    </head>

    <body>
        <div id="my-spreadsheet">
        </div>
        <input type="button" value="Add new row" @click="() => spreadsheet.insertRow()" />

    </body>

    </html>
</template>


<script>
import jspreadsheet from 'jspreadsheet-ce';
import ApiService from '../../service/apiService';

export default {
    data() {
        return {
            items: [],
            spreadsheet: null,
        };
    },
    mounted() {
        this.getInterface();
    },
    methods: {
        initializeJSpreadsheet() {
            const transformedData = this.items.map(item => [item.id, item.type, item.value]);

            if (this.spreadsheet) {
                this.spreadsheet.destroy();
            }

            this.spreadsheet = jspreadsheet(document.getElementById('my-spreadsheet'), {
                data: transformedData,
                columns: [
                    { title: 'Id', width: 300 },
                    { title: 'Type', width: 80 },
                    { title: 'Value', width: 100 },
                ],
            });
        },

        async getInterface(interfaceId) {
            console.log('getInterface Called');
            interfaceId = '65eacd15298986a324f658ab';
            try {
                const response = await ApiService.get(`/interface/${interfaceId}`);
                const interfaceData = response.data;
                this.items = interfaceData;
                console.log("Items ", this.items);
                console.log('Interface data retrieved successfully:', interfaceData);

                this.$emit('interface-clicked', interfaceData);

                // Après avoir reçu les données, initialiser jspreadsheet
                this.initializeJSpreadsheet();
            } catch (error) {
                console.error('Error fetching interface data:', error);
            }
        },

    },
};
</script>
