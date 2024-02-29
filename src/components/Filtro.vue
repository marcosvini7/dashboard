<template> 
<div class="row container-fluid">
    <div class="col-6 col-lg-3 mb-2 mb-lg-0">
        <label for="input-visualizacao" class="form-label">Visualização</label>
        <select id="input-visualizacao" class="form-select" v-model="input.visualizacao" @change="clicouBotao">
            <option value="BarChart">Gráfico de Barras</option>
            <option value="ColumnChart">Gráfico de Colunas</option>
            <option value="LineChart">Gráfico de Linhas</option>  
            <option value="tabela">Tabela</option>         
        </select>
    </div>

    <div class="col-6 col-lg-2 mb-2 mb-lg-0">
        <label for="input-tipo" class="form-label">Tipo</label>
        <select id="input-tipo" class="form-select" v-model="input.tipo" @change="clicouBotao">
            <option v-for="tipo, i in tipos" :key="i" :value="tipo.obj"> {{ tipo.label }} </option>       
        </select>
    </div> 

    <div class="col-5 col-lg-3" v-if="$route.query.opcao">
        <label for="input-data-inicio" class="form-label">Data início</label>
        <input id="input-data-inicio" type="date" v-model="input.data_inicio" class="form-control">
    </div>

    <div class="col-5 col-lg-3" v-if="$route.query.opcao">
        <label for="input-data-fim" class="form-label">Data fim</label>
        <input id="input-data-fim" type="date" v-model="input.data_fim" class="form-control">
    </div>

    <div class="col-5 col-lg-3 mb-2 mb-lg-0" v-if="!$route.query.opcao">
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
    export default {
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
            ...mapState(['dados', 'request', 'visaoGeral']),
            tipos(){
                if(this.$route.name == 'participacao-investidores'){
                    return [
                        {obj: 'compras', label: 'Compras', unidade: '(R$) Mi'},
                        {obj: 'vendas', label: 'Vendas', unidade: '(R$) Mi'},
                        {obj: 'participacao_compras', label: 'Participação compras', unidade: '%'},
                        {obj: 'participacao_vendas', label: 'Participação vendas', unidade: '%'},
                        {obj: 'saldo', label: 'Saldo', unidade: '(R$) Mi'}                   
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
            }
        },
        methods: {
            ...mapMutations(['setDadosVisualizacao', 'setAttGrafico', 'setOcultarGrafico', 'setTipoGrafico',
                'setTituloGrafico', 'setDescrDados', 'setOcultarIcoGrafico', 'setAtualizarModal']),
            clicouBotao(){
                this.$router.push({              
                    name: this.$route.name,
                    query: {
                        opcao: this.$route.query.opcao ? this.$route.query.opcao : '',
                        ...this.input,
                    }
                })
            },
            filtrar(){
                let rota = this.$route.name
                if(rota == 'participacao-investidores' || (rota == 'contratos' && this.dados.contratos.length)){

                    let data_inicio = this.$route.query.data_inicio ? this.$route.query.data_inicio : 
                        this.moment().subtract(7, 'days').format('YYYY-MM-DD')
                    let data_fim = this.$route.query.data_fim ? this.$route.query.data_fim : 
                        this.moment().format('YYYY-MM-DD')
                    let tipo = this.$route.query.tipo ? this.$route.query.tipo : this.tipos[0].obj
                    this.tipos.forEach(t => { if(t.obj == tipo) tipo = t })
                    let tipo_investidor = this.$route.query.tipo_investidor ? this.$route.query.tipo_investidor : 'Total Geral'
                    let visualizacao = this.$route.query.visualizacao ? this.$route.query.visualizacao : 'BarChart'

                    let dados = this.dados.participacaoInvestidores
                    let objFiltro = 'tipo_investidor'
                    let objData = 'data'
                    let visaoGeral = this.visaoGeral.participacaoInvestidores
                    if(rota == 'contratos'){ 
                        dados = this.dados.contratos
                        objFiltro = 'nome'
                        objData = 'data_atualizacao'
                        visaoGeral = this.visaoGeral.contratos
                    }
                    
                    let opcao = this.$route.query.opcao ? this.$route.query.opcao : ''
                    let data = this.$route.query.data ? this.moment(this.$route.query.data) : 
                        this.moment(dados[dados.length - 1][objData])
                    let dadosFiltrados = []
        
                    if(opcao){
                        dados.forEach(d => {
                            let di = this.moment(data_inicio)
                            let df = this.moment(data_fim)
                            let data = this.moment(d[objData])

                            if(data.isSameOrAfter(di) && data.isSameOrBefore(df) && d[objFiltro] == opcao
                                && ((rota == 'contratos' && d.tipo == tipo_investidor) 
                                || rota == 'participacao-investidores')                    
                            ){
                                let dt = this.moment(d[objData]).format('DD/MM')
                                if(this.moment(data_inicio).format('YYYY') != this.moment(data_fim).format('YYYY'))
                                    dt = this.moment(d[objData]).format('DD/MM/YYYY')
                                dadosFiltrados.push([dt, d[tipo.obj]])
                            }
                        })
                    } else {

                        dados.forEach(d => {
                            let dt = this.moment(d[objData]) 
                            if(data.isSame(dt) && visaoGeral.includes(d[objFiltro])) 
                                dadosFiltrados.push([d[objFiltro], d[tipo.obj]])
                        })
                    }
                
                    if(rota == 'participacao-investidores' && ['compras', 'vendas', 'saldo'].indexOf(tipo.obj) != -1 ){
                        let lista = []
                        dadosFiltrados.forEach(d => {
                            let valor = d[1] / 1000
                            lista.push([d[0], valor])
                        })
                        dadosFiltrados = lista
                    }

                    dadosFiltrados.unshift([tipo.label, tipo.unidade])
                    this.setDadosVisualizacao(dadosFiltrados) 

                    if(visualizacao != 'tabela'){       
                        this.setOcultarGrafico(false)                                               
                        this.setTituloGrafico(tipo.label)                  
                        this.setTipoGrafico(visualizacao)
                    } else {
                        this.setOcultarGrafico(true)
                    }
            
                    data_inicio = this.moment(data_inicio).format('DD/MM/YYYY')
                    data_fim = this.moment(data_fim).format('DD/MM/YYYY')
                    let descr = 'Dados não encontrados para o perído informado'
                    if(dadosFiltrados.length > 1){
                        if(opcao) descr = `Exibindo ${tipo.label.toLowerCase()} entre ${data_inicio} e ${data_fim}`
                        else descr = `Exibindo ${tipo.label.toLowerCase()} do dia ${data.format('DD/MM/YYYY')}`
                        this.setOcultarIcoGrafico(false) 
                    } else { 
                        this.setOcultarIcoGrafico(true)  
                    } 

                    this.setDescrDados(descr)
                    this.setAttGrafico()
                }
            },          
        },
        created(){            
            if(!this.request) this.filtrar()
        },
        mounted(){
            
        },
        watch: {
            request(n){
               if(!n) this.filtrar()
            },
            $route(to, from){
                if(to.name != from.name){
                    this.input.tipo = ''
                }
                this.filtrar()
            },
            'visaoGeral.participacaoInvestidores'(){ this.filtrar() },
            'visaoGeral.contratos'(){ this.filtrar() }
        }
    }
</script>