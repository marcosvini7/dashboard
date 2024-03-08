import { createStore } from 'vuex'

const padrao = {
  navLateral: {
    participacaoInvestidores: [
      'Institucionais', 
      'Instituições Financeiras', 
      'Investidor Estrangeiro', 
      'Investidores Individuais', 
      'Outros'
    ],
  },
  visaoGeral: {
    contratos: [
      'MERCADO FUTURO DE IBOVESPA',
      'Contrato Futuro de PETR4',
      'Contrato Futuro de VALE3',
      'Contrato Futuro de ITUB4',
      'Contrato Futuro de ITSA4'
    ],
    participacaoInvestidores: [
      'Institucionais', 
      'Instituições Financeiras', 
      'Investidor Estrangeiro', 
      'Investidores Individuais'
    ]
  }
}

export default createStore({
  state: {
    dados: {
      contratos: [],
      participacaoInvestidores: []
    },
    dadosVisualizacao: [],
    navLateral: {
      contratos: [],
      participacaoInvestidores: padrao.navLateral.participacaoInvestidores
    },
    visaoGeral: {
      contratos: padrao.visaoGeral.contratos,
      participacaoInvestidores: padrao.visaoGeral.participacaoInvestidores
    },
    descrDados: '',
    request: true,
    tipoGrafico: '',
    tituloGrafico: '',
    atualizarGrafico: false,
    ocultarGrafico: false,
    ocultarIcoGrafico: false, 
    atualizarModal: false ,
    calculoGraficoSecundario: 'data',
    graficoPadrao: true,
    graficoEmpilhado: false
  },
  getters: {
  },
  mutations: {
    setDados(state, p) {
      state.dados[p.obj] = p.data
    },
    setDadosVisualizacao(state, p){
      state.dadosVisualizacao = p
    },
    setNavLateral(state, p) {
      state.navLateral[p.obj] = p.data
    },
    setVisaoGeral(state, p) {
      if(p.data.length == 0){
        p.data = padrao.visaoGeral[p.obj]
      }
      state.visaoGeral[p.obj] = p.data
    },
    setDescrDados(state, p){
      state.descrDados = p
    },
    setRequest(state, p){
      state.request = p
    },
    setTipoGrafico(state, p){
      state.tipoGrafico = p
    },
    setTituloGrafico(state, p){
      state.tituloGrafico = p
    },
    setAttGrafico(state){
      state.atualizarGrafico = !state.atualizarGrafico
    },
    setOcultarGrafico(state, p){
      state.ocultarGrafico = p
    },
    setOcultarIcoGrafico(state, p){
      state.ocultarIcoGrafico = p
    },
    setAtualizarModal(state){
      state.atualizarModal = !state.atualizarModal
    },
    setCalculoGraficoSecundario(state, p){
      state.calculoGraficoSecundario = p
    },
    setGraficoPadrao(state, p){
      state.graficoPadrao = p
    },
    setGraficoEmpilhado(state, p){
      state.graficoEmpilhado = p
    }
  },
  actions: {
  },
  modules: {
  }
})
