import { mapState, mapMutations } from 'vuex'

export default {
    data: () => ({
        
    }),
    computed: {
        ...mapState(['dados', 'request', 'visaoGeral']),   
        API_URL(){
            return process.env.VUE_APP_API_URL || 'http://localhost:3000/'
        }   
    },
    methods: {
        ...mapMutations(['setDados', 'setRequest', 'setNavLateral']),
        queryNome(){
            let opcao = this.$route.query.opcao ? this.$route.query.opcao : '' 
            if(!opcao){         
                let aux = this.visaoGeral.contratos
                for(let i = 0; i < aux.length; i++){
                    if(i == 0) opcao += aux[i]
                    else opcao += ',' + aux[i]
                }
                
            }
            return opcao
        },

        getContratos(){           
            this.setRequest(true)    
            axios.get(this.API_URL + 'contratos?nome=' + this.queryNome()).then(res => {
                this.setDados({obj: 'contratos', data: res.data})
                this.setRequest(false)
            })
        },
        getDados(){
            this.setRequest(true) // Indica que a requisição iniciou
            
            let requests = [
                axios.get(this.API_URL + 'contratos/nomes'),
                axios.get(this.API_URL + 'participacao-investidores')
            ]
            if(this.$route.name == 'contratos') {            
                requests.push(axios.get(this.API_URL + 'contratos?nome=' + this.queryNome()))
            }
            // Quando todas as requisições terminarem seus resultados ficarão nas variáveis res[o], res[1] ...
            axios.all(requests).then(axios.spread((...res) => {
                let nomesContratos = res[0].data
                let pi = res[1].data             

                // Coloca todos os nomes de contratos em um array de strings
                let nomes = []
                nomesContratos.forEach(d => nomes.push(d.nome))

                // Salva os dados no state do vuex
                this.setDados({obj: 'participacaoInvestidores', data: pi})
                this.setNavLateral({obj: 'contratos', data: nomes}) 
                if(res[2]) {
                    this.setDados({obj: 'contratos', data: res[2].data})
                }
                this.setRequest(false) // Indica que a requisição terminou

            }))            
        }
    }
}