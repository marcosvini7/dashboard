<template>
    <div class="table-responsive mt-5 mt-lg-3 ms-1 mx-1">
        <table class="table table-hover table-striped table-bordered">
            <caption>{{ descrDados }}</caption>
            <thead>
                <tr>
                    <th v-for="(d, i) in dadosVisualizacao[0]" :key="i">{{ d }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(d, i) in dadosVisualizacao" :key="d.id">
                    <template v-if="i != 0">
                        <td v-for="(d, j) in dadosVisualizacao[i]" :key="j"> {{ d.toLocaleString() }} </td>
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
               
            }
        },
    }
</script>