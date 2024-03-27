<template>
    <div :id="graficoId"></div>            
</template>

<script>
import { mapState, mapMutations } from 'vuex'
    export default {
        props: {
            tipo: {type: String}
        },
        data: () => ({
            graficoId: '',
        }),
        computed: {
            ...mapState(['dadosVisualizacao', 'tipoGrafico', 'atualizarGrafico', 'tituloGrafico', 
            'graficoPadrao', 'calculoGraficoSecundario', 'grafico3D']),
        },
        methods: {
            ...mapMutations(['setOcultarGrafico', 'setTemValorNegativo']),
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

                if(temValorNegativo){
                    this.setTemValorNegativo(true)
                    this.setOcultarGrafico(true)
                } else {
                    this.setTemValorNegativo(false)
                }

                if((tamanho > 1 && el) && ((this.tipo && !temValorNegativo) || !this.tipo)){
                    let dados = [...this.dadosVisualizacao]
                    let titulo = this.tituloGrafico
                    if(this.tipo && !this.graficoPadrao){
                        dados = dados3
                        if(this.calculoGraficoSecundario == 'data') titulo = 'Total por data'
                        if(this.calculoGraficoSecundario == 'tipo') {
                            if(this.$route.name == 'contratos') titulo = 'Total por contrato'
                            if(this.$route.name == 'participacao-investidores') titulo = 'Total por investidor'
                        }   
                    } 

                    let altura = window.innerHeight - 200
                    altura = altura < 250 ? 250 : altura  
                    let data = new google.visualization.DataTable()
    
                    if(this.tipoGrafico == 'Table') {
                        altura = ''
                        el.style.margin = '2%'

                        let aux = dados.shift()                       
                        let rows = []
                        aux.forEach(d => {
                            if(d == 'Data'){
                                data.addColumn('date', 'Data')
                            } else {
                                data.addColumn('number', d)
                            }                         
                        })

                        let formatoData = this.moment(dados[0][0]).format('YYYY') == this.moment(dados[dados.length - 1][0]).format('YYYY') ? 'DD/MM' : 'DD/MM/YYYY'
                        for(let i = 0; i < dados.length; i++){
                            let row = []
                            dados[i].forEach((d, i) => {
                                if(i == 0){
                                   row.push({v: d, f: this.moment(d).format(formatoData)})
                                } else {
                                    let texto = d.toLocaleString()
                                    let tipo = this.$route.query.tipo ? this.$route.query.tipo : ''
                                    let rota = this.$route.name

                                    if(['compras', 'vendas', 'saldo'].includes(tipo)
                                    || (rota == 'participacao-investidores' && !tipo)){
                                        texto = 'R$ ' + texto
                                    } 
                                    else if (['participacao_compras', 'participacao_vendas', 
                                    'compra_porcentagem', 'venda_porcentagem'].includes(tipo)){
                                        texto += ' %'
                                    }

                                    row.push({v: d, f: texto})
                                }
                            })
                            rows.push(row)
                        }

                        try { data.addRows(rows) } catch(err){ console.log(err) }
                     
                    } else {
                        el.style.margin = '0px'
                        data = google.visualization.arrayToDataTable(dados)
                    }

                    var options = {
                        title: titulo,
                        height: altura,
                        width: '100%',
                        locale: 'pt-BR',
                        isStacked: true,
                        is3D: this.grafico3D,
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