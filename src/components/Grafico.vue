<template>
    <div :id="graficoId"></div>            
</template>

<script>
import { mapState } from 'vuex'
    export default {
        props: {
            tipo: {type: String}
        },
        data: () => ({
            graficoId: '',
        }),
        computed: {
            ...mapState(['dadosVisualizacao', 'tipoGrafico', 'atualizarGrafico', 'tituloGrafico'])
        },
        methods: {
            drawChart() {                  
                var el = document.getElementById(this.graficoId)
                if(this.dadosVisualizacao.length > 1 && el){ 

                    var data = google.visualization.arrayToDataTable(this.dadosVisualizacao)
                    let altura = window.innerHeight - 200
                    altura = altura < 250 ? 250 : altura

                    var options = {
                        title: this.tituloGrafico,
                        height: altura
                    }           
 
                    let tipo = this.tipo ? this.tipo : this.tipoGrafico                  
                    var chart = new google.visualization[tipo](el)
                    chart.draw(data, options)

                } else {
                    if(el) el.innerHTML = ''
                }
            }
        },
        mounted(){
            window.addEventListener('resize', this.drawChart)
            google.charts.setOnLoadCallback(this.drawChart)
        },
        created(){
            this.graficoId = 'grafico_' + Math.random()
        },
        watch: {
            atualizarGrafico(){
                google.charts.setOnLoadCallback(this.drawChart)
            }
        }
    }
</script>