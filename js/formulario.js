// ========================
//  FORMULÁRIO - ÓnixVet
// ========================

// Array em memória para guardar as marcações
const marcacoes = [];

// Define a data mínima como hoje
const campoData = document.getElementById('diaConsulta');
const hoje = new Date().toISOString().split('T')[0];
campoData.setAttribute('min', hoje);

// IDs dos campos obrigatórios
const camposObrigatorios = ['nomeAnimal', 'nomeTutor', 'contacto', 'diaConsulta', 'horaConsulta', 'motivo'];

// Valida se o contacto é email ou telefone
function validarContacto(valor) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    const isTelefone = /^(\+351\s?)?[0-9]{9}$/.test(valor.replace(/\s/g, ''));
    return isEmail || isTelefone;
}

// Valida se a data é válida e não é no passado
function validarData(valor) {
    const dataEscolhida = new Date(valor);
    const hojeDate = new Date(hoje);
    return dataEscolhida >= hojeDate;
}

// Remove estilos de erro/válido ao escrever
camposObrigatorios.forEach(function(id) {
    const campo = document.getElementById(id);

    function atualizarEstado() {
        if (campo.value.trim() === '') {
            campo.classList.remove('erro', 'valido');
        } else if (id === 'contacto' && !validarContacto(campo.value.trim())) {
            campo.classList.add('erro');
            campo.classList.remove('valido');
        } else if (id === 'diaConsulta' && !validarData(campo.value)) {
            campo.classList.add('erro');
            campo.classList.remove('valido');
        } else {
            campo.classList.remove('erro');
            campo.classList.add('valido');
        }
    }

    campo.addEventListener('input', atualizarEstado);
    campo.addEventListener('change', atualizarEstado);
});

// Submissão do formulário
document.getElementById('consultaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let formularioValido = true;

    // Valida todos os campos obrigatórios
    camposObrigatorios.forEach(function(id) {
        const campo = document.getElementById(id);
        if (campo.value.trim() === '') {
            campo.classList.add('erro');
            campo.classList.remove('valido');
            formularioValido = false;
        } else {
            campo.classList.remove('erro');
            campo.classList.add('valido');
        }
    });

    // Valida o formato do contacto
    const campoContacto = document.getElementById('contacto');
    if (campoContacto.value.trim() !== '' && !validarContacto(campoContacto.value.trim())) {
        campoContacto.classList.add('erro');
        campoContacto.classList.remove('valido');
        formularioValido = false;
    }

    // Valida a data da consulta
    const campoDataConsulta = document.getElementById('diaConsulta');
    if (campoDataConsulta.value.trim() !== '' && !validarData(campoDataConsulta.value)) {
        campoDataConsulta.classList.add('erro');
        campoDataConsulta.classList.remove('valido');
        formularioValido = false;
    }

    if (!formularioValido) return;

    // Cria objeto com os dados da marcação
    const novaMarcacao = {
        id: marcacoes.length + 1,
        nomeAnimal: document.getElementById('nomeAnimal').value.trim(),
        nomeTutor: document.getElementById('nomeTutor').value.trim(),
        contacto: document.getElementById('contacto').value.trim(),
        diaConsulta: document.getElementById('diaConsulta').value,
        horaConsulta: document.getElementById('horaConsulta').value,
        motivo: document.getElementById('motivo').value.trim(),
        createdAt: new Date().toLocaleString('pt-PT')
    };

    // Guarda em memória
    marcacoes.push(novaMarcacao);

    // Atualiza a lista no DOM
    renderizarMarcacoes();

    // Muda o botão para verde
    const botao = document.getElementById('btnSubmit');
    const textoBotao = document.getElementById('btnText');
    botao.classList.add('submetido');
    botao.disabled = true;
    textoBotao.textContent = 'MARCAÇÃO ENVIADA!';

    // Mostra a mensagem de sucesso
    const banner = document.getElementById('successBanner');
    banner.classList.add('visivel');
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Limpa o formulário após 2 segundos e repõe o botão
    setTimeout(function() {
        document.getElementById('consultaForm').reset();
        botao.classList.remove('submetido');
        botao.disabled = false;
        textoBotao.textContent = 'SUBMETER MARCAÇÃO';
        banner.classList.remove('visivel');

        camposObrigatorios.forEach(function(id) {
            document.getElementById(id).classList.remove('valido', 'erro');
        });

        // Faz scroll para a lista
        document.getElementById('listaMarcacoes').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

// Renderiza a lista de marcações no DOM
function renderizarMarcacoes() {
    const lista = document.getElementById('listaMarcacoes');
    const estadoVazio = document.getElementById('estadoVazio');
    const contadorEl = document.getElementById('contadorMarcacoes');

    // Atualiza o contador
    contadorEl.textContent = marcacoes.length;

    // Estado vazio
    if (marcacoes.length === 0) {
        estadoVazio.style.display = 'block';
        lista.innerHTML = '';
        return;
    }

    estadoVazio.style.display = 'none';

    // Gera os cards dinamicamente
    lista.innerHTML = marcacoes.map(function(m) {
        return `
            <div class="marcacao-card">
                <div class="marcacao-header">
                    <span class="marcacao-id">#${m.id}</span>
                    <span class="marcacao-data-criacao">Submetido em: ${m.createdAt}</span>
                </div>
                <div class="marcacao-body">
                    <p><strong>🐾 Animal:</strong> ${m.nomeAnimal}</p>
                    <p><strong>👤 Tutor:</strong> ${m.nomeTutor}</p>
                    <p><strong>📞 Contacto:</strong> ${m.contacto}</p>
                    <p><strong>📅 Data:</strong> ${m.diaConsulta} às ${m.horaConsulta}</p>
                    <p><strong>📋 Motivo:</strong> ${m.motivo}</p>
                </div>
            </div>
        `;
    }).join('');
}