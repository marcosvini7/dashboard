<template>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Filtro</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="mb-2">
                <div class="form-label">Opções de Visão geral</div>
                <div class="checkbox-area-contratos border mb-1">
                    <div class="row">
                        <div class="col-6" v-for="opcao, i in opcoes" :key="i">     
                            <input type="checkbox" class="checkbox" v-model="marcados" :id="'checkbox_' + opcao" :value="opcao">           
                            <label :for="'checkbox_' + opcao">{{ opcao }}</label>                                                     
                        </div>
                    </div>  
                </div>
                <div class="descr-marcados-checkbox">
                    <small class="text-muted">{{ selecionados }}</small>
                </div>
            </div>

            <div class="mb-2" v-if="!graficoPadrao">
                <label class="form-label" for="input-calculo">Cálculo do gráfico secundário</label>
                <select class="form-select" id="input-calculo" v-model="input.calculo">
                    <option value="data">Total por data</option>
                    <option value="tipo">Total por investidor/contrato</option>
                </select>
            </div> 

            <div class="mb-2" v-if="$route.name == 'contratos'">
                <label class="form-label" for="input-tipo-investidor">Tipo investidor</label>
                <select class="form-select" id="input-tipo-investidor" v-model="input.tipoInvestidor">
                    <option :value="tipo" v-for="tipo, i in tiposInvestidores" :key="i" > {{ tipo }} </option>
                </select>
            </div>

            <div class="mb-2">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="input.graficoEmpilhado">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Gráfico com barras empilhadas</label>
                </div>
            </div> 

            <div class="mb-2">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault1" v-model="input.grafico3D">
                    <label class="form-check-label" for="flexSwitchCheckDefault1">Gráfico de Pizza em 3D</label>
                </div>
            </div> 
        
        </div>      

        <div class="modal-footer">
            <button @click="salvar" type="button" class="btn btn-primary" data-bs-dismiss="modal">Savar</button>
        </div>
        </div>
    </div>
</div>
</template>

<style>
.modal-body {
    max-height: 70vh;
    overflow-y: auto;
}
.checkbox-area-contratos {
    max-height: 170px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px;
    font-size: 0.9em;
}
.checkbox {
    margin-right: 2px;
}
.descr-marcados-checkbox {
    max-width: 100%;
    overflow-x: auto;
    text-wrap: nowrap;
}
</style>

<script>
import { mapState, mapMutations } from 'vuex'
    export default {
        data: () => ({
            tiposInvestidores: [
                'Inv. Não Residente - Res.2687 Agrop', 
                'Invest. Institucional Nacional',
                'Investidor Institucional', 
                'Investidores Não Residentes', 
                'Pessoa Física', 
                'Pessoa Jurídica Não Financeira',               
                'Inv. Não Residente - Res.2689', 
                'Pessoa Jurídica Financeira', 
                'Bancos', 
                "DTVM'S e Corretoras de Valores",
                'Outras Jurídicas Financeiras',
                'Inv. Não Residente -Res.2687 Agrop',
                'Banco Central',
                'Total Geral'
            ],
            input: {
                tipoInvestidor: 'Total Geral',
                calculo: 'data',
                graficoEmpilhado: false,
                grafico3D: false
            }, 
            marcados: []
        }),
        computed: {
            ...mapState(['navLateral', 'visaoGeral', 'atualizarModal', 'graficoPadrao']),
            opcoes(){
                if(this.$route.name == 'contratos') 
                    return this.navLateral.contratos
                else
                    return this.navLateral.participacaoInvestidores
            },
            selecionados(){
                let qtd = this.marcados.length
                if(qtd){
                    let marcados = ''
                    this.marcados.forEach((d, i) => { 
                        if(i == 0) marcados += d
                        else marcados += ', ' + d
                    })
                    
                    if(qtd == 1) 
                        return qtd + ' opção selecionada: ' + marcados
                    else
                        return qtd + ' opções selecionadas: ' + marcados
                }

                return ''
            }           
        },
        methods: {
            ...mapMutations(['setVisaoGeral', 'setCalculoGraficoSecundario', 'setGraficoEmpilhado', 'setGrafico3D']),
            salvar(){
                let obj = 'contratos'
                if(this.$route.name != 'contratos') obj = 'participacaoInvestidores'
                this.setVisaoGeral({obj: obj, data: [...this.marcados]})
                this.setCalculoGraficoSecundario(this.input.calculo)
                this.setGraficoEmpilhado(this.input.graficoEmpilhado)
                this.setGrafico3D(this.input.grafico3D)

                this.$router.push({
                    name: this.$route.name,
                    query: {...this.$route.query, tipo_investidor: this.input.tipoInvestidor}
                })
            },
            atualizar(){
                if(this.$route.name == 'contratos') this.marcados = [...this.visaoGeral.contratos]
                else this.marcados = [...this.visaoGeral.participacaoInvestidores]
            }
        },
        created(){
            this.atualizar()
        },
        watch: {
            atualizarModal(){ 
                this.atualizar() 
            }
        }
    }
</script>