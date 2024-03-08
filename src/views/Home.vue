<template>
<navbar/>
<modal/>

<navegacao-lateral class="nav-lateral d-none d-lg-block element" v-if="showNav && !showOffCanvas" />
<offcanvas v-if="showOffCanvas"/>

<div class="ico-show-nav-lateral d-none d-lg-block" v-if="!showNav" @click="ajustarNav()">
  <i class="fa-solid fa-list"></i>
</div>
<div class="ico-hide-nav-lateral d-none d-lg-block" v-if="showNav" @click="ajustarNav()" >
  <i class="fa-solid fa-xmark"></i>
</div>
<template v-if="!ocultarGrafico && !ocultarIcoGrafico">
  <div class="ico-hide-grafico d-none d-md-block" v-if="graficoSecundario" @click="this.graficoSecundario = false">
    <i class="fa-solid fa-xmark"></i>
  </div>
  <div class="ico-show-grafico d-none d-md-block" v-if="!graficoSecundario" @click="this.graficoSecundario = true">
    <i class="fa-solid fa-chart-pie"></i>
  </div>
</template>

<filtro class="filtro"/>

<main class="area-conteudo">  
    <div class="row"  v-if="!request  && !ocultarGrafico">
      <div :class="classGraficoPrincipal" id="grafico-principal">
        <grafico></grafico>
      </div>       
      <grafico class="col-12 col-md-5" v-if="graficoSecundario" tipo="PieChart"></grafico>
      <caption class="text-center">{{ descrDados }}</caption>
    </div>
    <div v-else-if="ocultarGrafico">
      <tabela/>
    </div>     
    <div class="d-flex justify-content-center" v-else>
        <img src="/imagens/Rolling-1s-100px.gif" class="mg-gif">
    </div>
</main>

</template>

<style>

    :root {
      --nav-lateral-width: 0%;
      --area-conteudo-width: 100%;
      --area-conteudo-left: 0%;
      --area-conteudo-top: 220px;
      --navbar-mg-top: 70px;
      --brand-color: whitesmoke;
      --filtro-position: absolute;
    }

    @media (min-width: 576px) {

    }

    @media (min-width: 768px) {

    }

    @media (min-width: 992px) {      
      :root {
        --nav-lateral-width: 20%;
        --area-conteudo-left: 21%;
        --area-conteudo-width: 79%;   
        --area-conteudo-top: 150px;  
        --filtro-position: fixed; 
      }
    } 

    @media (min-width: 1200px) { 

    }

    @media (min-width: 1400px) { 

    }

    .mg-navbar {
      margin-top: var(--navbar-mg-top);
    }
    .nav-lateral {
      position: fixed;
      top: var(--navbar-mg-top);
      left: 1%;
      width: var(--nav-lateral-width);
    }
    .area-conteudo {
      position: absolute;
      top: var(--area-conteudo-top);
      left: var(--area-conteudo-left);
      width: var(--area-conteudo-width);
      overflow-x: hidden;
    }

    .btn-offcanvas {
      position: fixed;
      top: 230px;
      left: 1%;
      z-index: 2;
    }
    .mg-gif {
      margin-top: 100px;
    }
    .ico-hide-nav-lateral {
      position: fixed;
      top: var(--navbar-mg-top);
      left: calc(var(--nav-lateral-width) + 10px);
      z-index: 2;
      cursor: pointer;
    }
    .ico-show-nav-lateral {        
      position: fixed;
      top: var(--navbar-mg-top);
      left: 10px;
      z-index: 2;
      cursor: pointer;
    }
    .ico-hide-grafico { 
      position: fixed;
      top: calc(var(--area-conteudo-top) + 30px);
      right: 7%;
      z-index: 1;
      cursor: pointer;     
    }
    .ico-show-grafico { 
      position: fixed;
      top: calc(var(--area-conteudo-top) + 30px);
      right: 25px;
      z-index: 1;
      cursor: pointer;     
    }
    .filtro {
      position: var(--filtro-position);
      top: calc(var(--navbar-mg-top) - 15px);
      left: calc(var(--area-conteudo-left) + 20px);
      width: calc(var(--area-conteudo-width) - 20px);
      z-index: 1;
      background-color: white;
      padding-bottom: 20px;
      padding-top: 20px;
    }

</style>

<script>
  import requestMixin from '../mixins/request'
  import { mapState, mapMutations } from 'vuex'

  export default {
    mixins: [requestMixin],
    data: () => ({
      showNav: true,
      graficoSecundario: true,
      showOffCanvas: false,
      classGraficoPrincipal: 'col-12 col-md-7'
    }),
    created(){
      this.getDados()
    },
    computed: {
      ...mapState(['ocultarGrafico', 'ocultarIcoGrafico', 'descrDados', 'atualizarGrafico', 'request'])
    },
    methods: {
      ...mapMutations(['setAttGrafico']),
      ajustarNav(mudar = true){
        if(mudar) this.showNav = !this.showNav

        if(window.innerWidth < 992){
          document.documentElement.style.setProperty('--area-conteudo-width', '100%')
          document.documentElement.style.setProperty('--area-conteudo-left', '0%')
          this.showOffCanvas = true

        } else if(!this.showNav){
          document.documentElement.style.setProperty('--area-conteudo-width', '100%')
          document.documentElement.style.setProperty('--area-conteudo-left', '0%')
          this.showOffCanvas = false

        } else {
          document.documentElement.style.setProperty('--area-conteudo-width', '79%')
          document.documentElement.style.setProperty('--area-conteudo-left', '21%')
          this.showOffCanvas = false
        }
        this.setAttGrafico()
      },   

      ajustarGrafico(){
        let grafico = document.getElementById('grafico-principal')
        if(grafico){
          if(this.graficoSecundario){
            this.classGraficoPrincipal = 'col-12 col-md-7'
          } else {
            this.classGraficoPrincipal = 'col-12 col-md-12'
          }
        }
        this.setAttGrafico()
      }
    },
    mounted(){       
      window.addEventListener('resize', () => this.ajustarNav(false))
      this.ajustarNav(false)
    },

    watch: {
      request(n){
        if(!n) 
          this.ajustarGrafico()
      },
      graficoSecundario(){
        this.ajustarGrafico()
      },
    }
  }   
</script>