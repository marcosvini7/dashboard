<template> 
<div class="row container-fluid">
    <div class="col-6 col-lg-3 mb-2 mb-lg-0">
        <label for="input-visualizacao" class="form-label">Visualização</label>
        <select id="input-visualizacao" class="form-select" v-model="input.visualizacao" @change="clicouBotao">
            <option value="BarChart">Gráfico de Barras</option>
            <option value="ColumnChart">Gráfico de Colunas</option>
            <option value="LineChart">Gráfico de Linhas</option>  
            <option value="Table">Gráfico de Tabela</option>         
        </select>
    </div>

    <div class="col-6 col-lg-2 mb-2 mb-lg-0">
        <label for="input-tipo" class="form-label">Tipo</label>
        <select id="input-tipo" class="form-select" v-model="input.tipo" @change="clicouBotao">
            <option v-for="tipo, i in tipos" :id="'option-' + tipo.obj"  :key="i" :value="tipo.obj"> {{ tipo.label }} </option>       
        </select>
    </div> 

    <div class="col-5 col-lg-3" v-if="rangeData">
        <label for="input-data-inicio" class="form-label">Data início</label>
        <input id="input-data-inicio" type="date" v-model="input.data_inicio" class="form-control">
    </div>

    <div class="col-5 col-lg-3" v-if="rangeData">
        <label for="input-data-fim" class="form-label">Data fim</label>
        <input id="input-data-fim" type="date" v-model="input.data_fim" class="form-control">
    </div>

    <div class="col-5 col-lg-3 mb-2 mb-lg-0" v-if="!rangeData">
        <label for="input-data" class="form-label">Data</label>
        <input id="input-data" type="date" v-model="input.data" class="form-control">
    </div>    

    <div class="col-1 btn-area">
        <div class="d-flex">
            <button class="btn btn-sm btn-primary" @click="clicouBotao">
                <i class="fa-solid fa-filter"></i>
            </button>

            <button class="btn btn-sm btn-primary ms-1" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="setAtualizarModal">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    </div>
</div>
</template>

<style scoped>
    .btn-area {
        margin-top: 35px;
    }
    .ico-filtro {
      position: fixed;
      top: calc(var(--navbar-mg-top) + 40px);
      left: calc(var(--nav-lateral-width) + 20px);
      z-index: 3;
      cursor: pointer;
    }
    .modal {
        z-index: 4;
    }
</style>

<script>
    import { mapState, mapMutations } from 'vuex'
    import requestMixin from '../mixins/request'
    export default {
        mixins: [requestMixin],
        data: () => ({
            input: {              
                data_inicio: '',
                data_fim: '',
                data: '',
                tipo: '',
                visualizacao: ''                         
            }
        }),
        computed: {
            ...mapState(['dados', 'request', 'visaoGeral', 'graficoPadrao', 'graficoEmpilhado']),
            tipos(){
                if(this.$route.name == 'participacao-investidores'){
                    let u = '(R$) Mi'
                    return [
                        {obj: 'compras_periodo', label: 'Compras período', unidade: u},
                        {obj: 'vendas_periodo', label: 'Vendas período', unidade: u},
                        {obj: 'saldo_periodo', label: 'Saldo período', unidade: u},
                        {obj: 'compras_dia', label: 'Compras dia', unidade: u},
                        {obj: 'vendas_dia', label: 'Vendas dia', unidade: u},
                        {obj: 'saldo_dia', label: 'Saldo dia', unidade: u},                       
                        {obj: 'participacao_compras', label: 'Participação compras', unidade: '%'},
                        {obj: 'participacao_vendas', label: 'Participação vendas', unidade: '%'},  
                        
                        {obj: 'compras', label: 'Compras', unidade: u},
                        {obj: 'vendas', label: 'Vendas', unidade: u},
                        {obj: 'saldo', label: 'Saldo', unidade: u}
                    ]
                }
                if(this.$route.name == 'contratos'){
                    return [
                        {obj: 'compra', label: 'Compra', unidade: 'Quantidade'},
                        {obj: 'venda', label: 'Venda', unidade: 'Quantidade'},
                        {obj: 'compra_porcentagem', label: 'Compra %', unidade: '%'},
                        {obj: 'venda_porcentagem', label: 'Venda %', unidade: '%'},                      
                    ]
                }
            },
            rangeData(){
                return !this.graficoPadrao || this.$route.query.opcao 
            }
        },
        methods: {
            ...mapMutations(['setDadosVisualizacao', 'setAttGrafico', 'setOcultarGrafico', 'setTipoGrafico',
                'setTituloGrafico', 'setDescrDados', 'setOcultarIcoGrafico', 'setAtualizarModal',
                'setGraficoPadrao'
            ]),
            clicouBotao(){
                this.$router.push({              
                    name: this.$route.name,
                    query: {
                        opcao: this.$route.query.opcao ? this.$route.query.opcao : '',
                        tipo_investidor: this.$route.query.tipo_investidor ? this.$route.query.tipo_investidor : '',
                        ...this.input,
                    }
                })
            },
            filtrar(){
                let rota = this.$route.name
                if(rota == 'participacao-investidores' || (rota == 'contratos' && this.dados.contratos.length)){
                    let data_inicio = this.$route.query.data_inicio ? this.$route.query.data_inicio : 
                        this.moment().subtract(15, 'days').format('YYYY-MM-DD')
                    let data_fim = this.$route.query.data_fim ? this.$route.query.data_fim : 
                        this.moment().format('YYYY-MM-DD')
                    
                    let tipo_investidor = this.$route.query.tipo_investidor ? this.$route.query.tipo_investidor : 'Total Geral'
                    let visualizacao = this.$route.query.visualizacao ? this.$route.query.visualizacao : 'BarChart'
                    
                    let dados = JSON.parse(JSON.stringify(this.dados.participacaoInvestidores))
                    let objFiltro = 'tipo_investidor'
                    let objData = 'data'
                    let visaoGeral = this.visaoGeral.participacaoInvestidores
                    let titulo1 = ' por investidor'
                    if(rota == 'contratos'){ 
                        dados = this.dados.contratos
                        objFiltro = 'nome'
                        objData = 'data_atualizacao'
                        visaoGeral = this.visaoGeral.contratos
                        titulo1 = ' por contrato'
                    }

                    if(rota == 'participacao-investidores'){
                        let temDados = false
                        let data_inicio_ = this.moment().startOf('month').format('YYYY-MM-DD')
                        
                        dados.forEach(d => {
                            let di = this.moment(data_inicio_)
                            let df = this.moment(data_fim)
                            let dt = this.moment(d[objData])
                            if(dt.isSameOrAfter(di) && dt.isSameOrBefore(df)){
                                temDados = true
                            }
                        })    
      
                        if(temDados){
                            if(!this.$route.query.data_inicio){
                                data_inicio = this.moment(data_inicio_).format('YYYY-MM-DD')
                            }
                        } else {
                            if(!this.$route.query.data_inicio){
                                data_inicio = this.moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                            }
                            if(!this.$route.query.data_fim){
                                data_fim = this.moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                            }                   
                        }                      
                    }
                    
                    let opcao = this.$route.query.opcao ? this.$route.query.opcao : ''
                    let data = this.$route.query.data ? this.moment(this.$route.query.data) : 
                        this.moment(dados[dados.length - 1][objData])
                    let dadosFiltrados = []
 
                    let di = this.moment(data_inicio)
                    let df = this.moment(data_fim)
                    let formatoData = this.moment(data_inicio).format('YYYY') == this.moment(data_fim).format('YYYY') ? 'DD/MM' : 'DD/MM/YYYY'

                    let graficosNaoPadrao = ['LineChart', 'Table']
                    if(this.graficoEmpilhado){
                        graficosNaoPadrao = ['LineChart', 'ColumnChart', 'Table', 'BarChart']
                    }

                    this.setGraficoPadrao(!graficosNaoPadrao.includes(visualizacao) || opcao != '')

                    let tipo = this.$route.query.tipo ? this.$route.query.tipo : this.tipos[0].obj
                    if(this.graficoPadrao && !opcao){
                        if(tipo == 'compras_periodo') tipo = 'compras'
                        if(tipo == 'vendas_periodo') tipo = 'vendas'
                        if(tipo == 'saldo_periodo') tipo = 'saldo'
                    }
                    this.tipos.forEach(t => { if(t.obj == tipo) tipo = t })

                    if(rota == 'participacao-investidores'){
                        if(opcao || (!opcao && !this.graficoPadrao)){
                            dados = this.ajustarDados(di)
                        } else {
                            dados = this.ajustarDados(data)
                        }
                    }
                    
                    if(opcao){
                        dados.forEach(d => {
                            let dt = this.moment(d[objData])

                            if(dt.isSameOrAfter(di) && dt.isSameOrBefore(df) && d[objFiltro] == opcao
                                && ((rota == 'contratos' && d.tipo == tipo_investidor) 
                                || rota == 'participacao-investidores')                    
                            ){
                                let dt = this.moment(d[objData]).format(formatoData)
                                if(visualizacao == 'Table'){ dt = new Date(d[objData])}
                                dadosFiltrados.push([dt, ajustarValor(d[tipo.obj])])
                            }
                        })
                    } else {                                                                                                             
                        dados.forEach(d => {     
                            let dt = this.moment(d[objData])

                            if(((this.graficoPadrao && dt.isSame(data)) || (!this.graficoPadrao && 
                                dt.isSameOrAfter(di) && dt.isSameOrBefore(df))) 
                                && visaoGeral.includes(d[objFiltro])
                                && ((rota == 'contratos' && d.tipo == tipo_investidor) 
                                    || rota == 'participacao-investidores')
                            ){ 
                                if(this.graficoPadrao){
                                    dadosFiltrados.push([d[objFiltro], ajustarValor(d[tipo.obj])])    

                                } else {

                                    dt = this.moment(d[objData]).format(formatoData)
                                    if(visualizacao == 'Table'){ dt = new Date(d[objData])}
                                    let i = 0
                                    let posicao = visaoGeral.indexOf(d[objFiltro]) + 1
                                    let inseriu = false
                                    let valor = ajustarValor(d[tipo.obj])

                                    if(dadosFiltrados.length == 0){
                                        dadosFiltrados.push(new Array(visaoGeral.length + 1).fill(''))
                                    }

                                    while(!inseriu){
                                        if(dadosFiltrados[i][posicao] == ''){
                                            dadosFiltrados[i][posicao] = valor
                                            inseriu = true
                                        } else {
                                            i++
                                        }
                                        if(i == dadosFiltrados.length && !inseriu){
                                            dadosFiltrados.push(new Array(visaoGeral.length + 1).fill(''))
                                            dadosFiltrados[i][posicao] = valor
                                            inseriu = true
                                        }
                                        if(dadosFiltrados[i][0] == '') dadosFiltrados[i][0] = dt
                                    }                                                        
                                }                    
                            }
                        })
                    }                 

                    let dadosValidos = dadosFiltrados.length > 0 

                    if(this.graficoPadrao){
                        let titulo = rota == 'contratos' ? 'Contrato' : 'Investidor'
                        if(opcao) titulo = 'Data';
                        dadosFiltrados.unshift([titulo, tipo.unidade])
                    } else {
                        dadosFiltrados.unshift(['Data', ...visaoGeral])
                        dadosFiltrados.forEach(d => {
                            d.forEach(j => { if(j == '') dadosValidos = false })
                        })
                    }

                    if(!dadosValidos){
                        dadosFiltrados = [] 
                    }
  
                    this.setDadosVisualizacao(dadosFiltrados) 
           
                    let titulo = tipo.label
                    if(tipo.obj == 'compras_dia') titulo = 'Compras'
                    if(tipo.obj == 'vendas_dia') titulo = 'Vendas'
                    if(tipo.obj == 'saldo_dia') titulo = 'Saldo'
                    if(['participacao_compras', 'participacao_vendas', 'compra', 'venda'].includes(tipo.obj)){
                        titulo += ` (${tipo.unidade})`
                    } else if(!['compra_porcentagem', 'venda_porcentagem'].includes(tipo.obj)){
                        titulo += ` ${tipo.unidade}`                      
                    } 

                    if(opcao){
                        titulo += ' de ' + opcao 
                    } else {
                        titulo += titulo1
                    }
                   

                    this.setTipoGrafico(visualizacao)

                    if(visualizacao != 'Table'){                                                     
                        this.setOcultarGrafico(false)                                                                     
                        this.setTituloGrafico(titulo)                                       
                    } else {
                        this.setOcultarGrafico(true)
                    }
            
                    data_inicio = this.moment(data_inicio).format('DD/MM/YYYY')
                    data_fim = this.moment(data_fim).format('DD/MM/YYYY')
                    let descr = 'Dados não encontrados para a data informada'

                    if(dadosValidos){                     
                        if(opcao || !this.graficoPadrao) {
                            descr = `${titulo} entre ${data_inicio} e ${data_fim}`
                        } else if(['compras', 'vendas', 'saldo'].includes(tipo.obj)){
                            descr = `${titulo} até o dia ${data.format('DD/MM/YYYY')}`
                        } else {
                            descr = `${titulo}, dia ${data.format('DD/MM/YYYY')}`
                        }
                        this.setOcultarIcoGrafico(false) 
                    } else { 
                        this.setOcultarIcoGrafico(true)  
                    } 

                    this.setDescrDados(descr)
                    this.setAttGrafico()

                    function ajustarValor(valor){
                        let tipos = ['compras', 'vendas', 'saldo', 'compras_periodo', 'vendas_periodo',
                            'saldo_periodo', 'compras_dia', 'vendas_dia', 'saldo_dia'
                        ]
                        if(tipos.indexOf(tipo.obj) != -1){
                            return valor / 1000
                        }
                        return valor
                    }
                }
            },          

            ajustarDados(dt_inicio){
                let pi = JSON.parse(JSON.stringify(this.dados.participacaoInvestidores))
                let dt_inicial = pi[0].data
                let mudou_mes = false
                let primeira_dt_mes = ''
                
                for(let i = 0; i < pi.length; i++){  
                    if(mudou_mes && primeira_dt_mes != pi[i].data){
                        mudou_mes = false
                    }     
                                       
                    if(this.moment(pi[i].data).isSameOrAfter(dt_inicio)){
                        let dia1 = this.moment(pi[i].data).format('DD') == '01'
                            && pi[i].data == dt_inicial

                        if(pi[i].data != dt_inicial && !dia1){
                            let f = i - 1
                            while(pi[f].tipo_investidor != pi[i].tipo_investidor && f != -1){ f-- }

                            if(mudou_mes){ 
                                pi[i].compras_dia = pi[i].compras
                                pi[i].vendas_dia = pi[i].vendas  
                            } else {
                                pi[i].compras_dia = pi[i].compras - pi[f].compras
                                pi[i].vendas_dia = pi[i].vendas - pi[f].vendas
                            }
                            
                            if(pi[f].compras_periodo){
                                pi[i].compras_periodo = pi[f].compras_periodo + pi[i].compras_dia
                                pi[i].vendas_periodo = pi[f].vendas_periodo + pi[i].vendas_dia  
                            } else {
                                pi[i].compras_periodo = pi[i].compras_dia
                                pi[i].vendas_periodo = pi[i].vendas_dia
                            }                                                     

                            pi[i].saldo_periodo = pi[i].compras_periodo - pi[i].vendas_periodo
                            pi[i].saldo_dia = pi[i].compras_dia - pi[i].vendas_dia
                        } 
                        if(pi[i].data == dt_inicial && dia1){
                            pi[i].compras_periodo = pi[i].compras
                            pi[i].vendas_periodo = pi[i].vendas
                            pi[i].saldo_periodo = pi[i].compras - pi[i].vendas
                            pi[i].compras_dia = pi[i].compras
                            pi[i].vendas_dia = pi[i].vendas
                            pi[i].saldo_dia = pi[i].compras - pi[i].vendas
                        } 
                    }
                                                 
                    if(i != pi.length - 1){
                        if(this.moment(pi[i].data).format('MM') != this.moment(pi[i + 1].data).format('MM')){    
                            mudou_mes = true     
                            primeira_dt_mes = pi[i + 1].data                 
                        }
                    }     
                    
                    pi[i].saldo = pi[i].compras - pi[i].vendas
                }

                if(this.moment(dt_inicial).format('DD') != '01'){
                    pi = pi.filter(p => p.data != dt_inicial)               
                }
                return pi
            }

        },
        created(){            
            if(!this.request) this.filtrar()
        },
        mounted(){
            let tipos = ['compras', 'vendas', 'saldo']
            for(let i = 0; i < tipos.length; i++){
                document.getElementById('option-' + tipos[i]).style.display = 'none'
            }
        },
        watch: {
            request(n){
               if(!n) this.filtrar()
            },
            $route(to, from){
                if(to.name != from.name){         
                    this.input.data_inicio = ''
                    this.input.data_fim = ''
                    this.input.data = ''
                    this.input.tipo = ''
                    this.input.visualizacao = ''                         
                    this.setGraficoPadrao(true)
                }
                this.filtrar()
            },
            'visaoGeral.participacaoInvestidores'(){ this.filtrar() },
            'visaoGeral.contratos'(){ this.getContratos() }
        }
    }
</script>