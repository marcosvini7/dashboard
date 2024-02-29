<template>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Filtro</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="mb-2" v-if="$route.name == 'contratos'">
                <label class="form-label" for="input-tipo-investidor">Tipo investidor</label>
                <select class="form-select" id="input-tipo-investidor" v-model="input.tipoInvestidor">
                    <option :value="tipo" v-for="tipo, i in tiposInvestidores" :key="i" > {{ tipo }} </option>
                </select>
            </div>   

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
                <small class="text-muted">{{ selecionados }}</small>
            </div>
        </div>
        <div class="modal-footer">
            <button @click="confirmar" type="button" class="btn btn-primary" data-bs-dismiss="modal">Savar</button>
        </div>
        </div>
    </div>
</div>
</template>

<style>
.checkbox-area-contratos {
    max-height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
}
.checkbox {
    margin-right: 2px;
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
                tipoInvestidor: ''
            },
            marcados: []
        }),
        computed: {
            ...mapState(['navLateral', 'visaoGeral', 'atualizarModal']),
            opcoes(){
                if(this.$route.name == 'contratos') 
                    return this.navLateral.contratos
                else
                    return this.navLateral.participacaoInvestidores
            },
            selecionados(){
                let qtd = this.marcados.length
                if(qtd) return qtd + ' opções selecionadas'
                return ''
            }           
        },
        methods: {
            ...mapMutations(['setVisaoGeral']),
            confirmar(){
                let obj = 'contratos'
                if(this.$route.name != 'contratos') obj = 'participacaoInvestidores'
                this.setVisaoGeral({obj: obj, data: [...this.marcados]})

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