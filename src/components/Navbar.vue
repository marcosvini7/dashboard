<template>
<nav class="navbar navbar-expand-md bg-navbar fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{name: 'home'}">
        <img src="/imagens/data.png" alt="" style="width: 30px"> Dashboard
      </router-link>
      <button class="navbar-toggler" id="btn-navbar" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" @click="btnAtivo = !btnAtivo">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" exact-active-class="active" aria-current="page" :to="{name: 'participacao-investidores'}">Participação dos investidores</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" exact-active-class="active" aria-current="page" :to="{name: 'contratos'}">Contratos em aberto</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
    .navbar-nav .nav-item .active {
      color:cornsilk
    }

    .titulo {
      text-align: center;
      color:blueviolet;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .bg-navbar {
      background-color:mediumpurple;
    }
    .navbar-brand {
      color:whitesmoke;
      font-weight: 700;
    }
    .navbar-brand:hover {
      color: var(--brand-color);
    }
    .nav-item .nav-link {
      color:white;
    }
</style>

<script>
    export default {
        data: () => ({
            btnAtivo: false,
        }),
        mounted(){
            let btnNavbar = document.getElementById('btn-navbar')
            // Evita que a cor da logo mude ao ser clicada
            let logo = document.getElementsByClassName('navbar-brand')[0]
            logo.addEventListener('click', () => {
                logo.style.color = 'var(--brand-color)' 
                if(this.btnAtivo) btnNavbar.click()
            })

            // Fecha o menu da navbar ao clicar em um link
            let navLinks = document.getElementsByClassName('nav-link')
            for(let i = 0; i < navLinks.length; i++){     
                navLinks[i].addEventListener('click', () => {           
                    if(this.btnAtivo &&  navLinks[i].id != 'dropdown-link') btnNavbar.click()
                })
            }
        }
    }
</script>