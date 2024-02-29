<template>
<button class="btn btn-sm btn-light btn-offcanvas" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
    <i class="fa-solid fa-list"></i>
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">
        <i class="fa-solid fa-list"></i> Opções 
    </h5>
    <button type="button" id="btn-close-offcanvas" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <navegacao-lateral/>
  </div>
</div>
</template>

