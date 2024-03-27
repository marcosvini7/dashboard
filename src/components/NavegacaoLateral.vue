<template>   
    <aside>
        <ul class="list-group">  
            <input type="text" class="form-control mb-2" placeholder="Pesquisar..." v-model="inputPesquisa">      
            <div class="opcoes">
                <div class="list-group-item" id="visao-geral" @click="clicouOpcao()">
                    <i class="fa-solid fa-chart-line mx-1"></i> Visão Geral
                </div> 
                <div v-for="opcao, i in opcoes" :key="i" class="list-group-item" @click="clicouOpcao(opcao)">
                    {{ opcao }}
                </div>
            </div>
        </ul>
    </aside>
</template>

<style scoped>
    .list-group-item {
        font-weight: 500;
        cursor: pointer;
        color:dodgerblue;
        background-color:ghostwhite;
    }
    .opcoes {
        overflow-y: scroll;
    }
    .opcao-ativa {
        color: white;
        background-color: hotpink;
    }
    .list-group input {
        width: 95%
    }
</style>

<script>
import { mapState } from 'vuex'
import requestMixin from '../mixins/request'

    export default {
        mixins: [requestMixin],
        data: () => ({
            inputPesquisa: ''
        }),
        computed: {
            ...mapState(['dados', 'request', 'navLateral']),
            opcoes(){
                let aux = []
                
                switch(this.$route.name){
                    case 'participacao-investidores': 
                        aux = this.navLateral.participacaoInvestidores
                        break                    
                    case 'contratos': 
                        aux = this.navLateral.contratos
                        break               
                }
                
                let opcoes = aux.filter(d => {
                    // Retira toda a acentuação
                    let pesquisa = this.inputPesquisa.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    let item = d.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

                    return item.includes(pesquisa)
                })

                setTimeout(() => this.selecionarOpcaoAtiva(), 100)

                return opcoes
            }
        },
        methods: {
            clicouOpcao(opcao = ''){
                let query = {...this.$route.query}
                query.opcao = opcao

                this.$router.push({
                    name: this.$route.name,
                    query: query
                })
            
                let btnClose = document.getElementById('btn-close-offcanvas')
                if(btnClose) btnClose.click()
            },   

            selecionarOpcaoAtiva(){
                let ativos = document.getElementsByClassName('opcao-ativa')
                for(let i = 0; i < ativos.length; i++){
                    ativos[i].classList.remove('opcao-ativa')
                }
                
                if(!this.$route.query.opcao){
                    let el = document.getElementById('visao-geral')              
                    el.classList.add('opcao-ativa')
                    
                } else {                   

                    let opcoes = document.getElementsByClassName('list-group-item')
                    for(let i = 0; i < opcoes.length; i++){
                        if(opcoes[i].textContent.trim() == this.$route.query.opcao){
                            opcoes[i].classList.add('opcao-ativa')
                        } 
                    }   
                }
            }
        },
        mounted(){
            function ajustarAltura(){
                let opcoes = document.getElementsByClassName('opcoes')
                for(let i = 0; i < opcoes.length; i++){
                    let altura = window.innerHeight - 200
                    altura = altura < 250 ? 250 : altura
                    opcoes[i].style.maxHeight = altura + 'px'
                }
            }
            ajustarAltura()
            window.addEventListener('resize', ajustarAltura)
        },
    }
</script>