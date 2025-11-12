<template>
    <div>
        <nav class="navbar navbar-custom">
            <div class="container-fluid justify-content-between px-3">
                <button class="btn btn-link text-white p-0">
                    <i class="bi bi-list fs-4"></i>
                </button>
                <button class="btn btn-outline-light btn-sm rounded-pill">
                    <i class="bi bi-person-circle me-1"></i> mi perfil
                </button>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'NavbarComponent'
}
</script>

<style scoped>
.navbar-custom {
    background-color: #00A79D;
    padding: 1rem;
}

.section-header {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
}

.btn-link {
    text-decoration: none;
}

.btn-link:hover {
    opacity: 0.8;
}
</style>