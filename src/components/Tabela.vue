<template>
    <div class="table-responsive mt-5 mt-lg-3 ms-1 mx-1 ms-lg-0 mx-lg-0">
        <table class="table table-hover table-striped table-bordered">
            <caption>{{ descrDados }}</caption>
            <thead>
                <tr>
                    <th>{{ titulo }}</th>
                    <th>{{ dadosVisualizacao[0][1] }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(d, i) in dadosVisualizacao" :key="d.id">
                    <template v-if="i != 0">
                        <td> {{ d[0] }} </td>
                        <td> {{ d[1] }} </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        computed: {
            ...mapState(['dadosVisualizacao', 'qtdTotal', 'descrDados']),
            titulo(){
                return this.$route.query.opcao ? 'Data' : 'Tipo'
            }
        },
    }
</script>