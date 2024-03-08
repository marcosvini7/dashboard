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
            ...mapState(['dadosVisualizacao', 'tipoGrafico', 'atualizarGrafico', 'tituloGrafico', 
            'graficoPadrao', 'calculoGraficoSecundario'])
        },
        methods: {
            drawChart() {    
                let tamanho = this.dadosVisualizacao.length
                let temValorNegativo = false
                let el = document.getElementById(this.graficoId)
                let dados3 = []

                if(tamanho > 1){                               
                    let calculo = this.calculoGraficoSecundario
                    let dados1 = [['', '']]
                    let dados2 = [['', '']]
                    
                    let indice = 1
                    this.dadosVisualizacao.forEach((d, n) => {                  
                        if(n > 0){                      
                            let valor = 0
                            d.forEach((j, i) => { 
                                if(i > 0){
                                    if(j < 0) temValorNegativo = true
                                    valor += j                              
                                }
                            })                    
                            dados1.push([d[0], valor])
                            indice += 1        
                        }                  
                    })

                    indice = 1
                    this.dadosVisualizacao[0].forEach((d, n) => {
                        if(n > 0){
                            let valor = 0
                            for(let i = 1; i < tamanho; i++){
                                valor += this.dadosVisualizacao[i][indice]
                            }
                            dados2.push([d, valor])
                            indice += 1
                        }
                    })

                    dados3 = calculo == 'data' ? dados1 : dados2
                }

                if((tamanho > 1 && el) && ((this.tipo && !temValorNegativo) || !this.tipo)){

                    let dados = this.dadosVisualizacao
                    let titulo = this.tipo ? '' : this.tituloGrafico
                    if(this.tipo && !this.graficoPadrao){
                        dados = dados3
                        if(this.calculoGraficoSecundario == 'data') titulo = 'Total por data'
                        if(this.calculoGraficoSecundario == 'tipo') {
                            if(this.$route.name == 'contratos') titulo = 'Total por contrato'
                            if(this.$route.name == 'participacao-investidores') titulo = 'Total por investidor'
                        }   
                    } 

                    var data = google.visualization.arrayToDataTable(dados)
                    let altura = window.innerHeight - 200
                    altura = altura < 250 ? 250 : altura                
                   
                    var options = {
                        title: titulo,
                        height: altura,
                        locale: 'pt-BR',
                        isStacked: true
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