// =============================================================================
// ESTADO E PERSISTÊNCIA DE DADOS (LOCALSTORAGE / MEMÓRIA)
// =============================================================================

// Dados Iniciais de Exemplo para o Setor Têxtil
const DADOS_INICIAIS = [
  { id: 1, nome: "Carlos Eduardo Silva", cpf: "111.222.333-44", matricula: "TEX-1001", setor: "Tecelagem", cargo: "Operador de Tecelagem", telefone: "(75) 98888-1111" },
  { id: 2, nome: "Ana Maria Souza", cpf: "222.333.444-55", matricula: "TEX-1002", setor: "Tinturaria", cargo: "Auxiliar de Tinturaria", telefone: "(75) 98888-2222" },
  { id: 3, nome: "Roberto Mendes", cpf: "333.444.555-66", matricula: "TEX-1003", setor: "Fiação", cargo: "Mecânico de Manutenção", telefone: "(75) 98888-3333" }
];

// Carrega os dados salvos ou inicializa com os dados de exemplo
function obterColaboradores() {
  const dados = localStorage.getItem('sgepi_colaboradores');
  if (!dados) {
    localStorage.setItem('sgepi_colaboradores', JSON.stringify(DADOS_INICIAIS));
    return DADOS_INICIAIS;
  }
  return JSON.parse(dados);
}

function salvarColaboradores(colaboradores) {
  localStorage.setItem('sgepi_colaboradores', JSON.stringify(colaboradores));
}

// Variável para armazenar o ID do colaborador a ser excluído
let idParaExcluir = null;
let modalBsExcluir = null;

// =============================================================================
// ELEMENTOS DO DOM
// =============================================================================
const form = document.getElementById('colaboradorForm');
const inputId = document.getElementById('colaboradorId');
const inputNome = document.getElementById('nome');
const inputCpf = document.getElementById('cpf');
const inputMatricula = document.getElementById('matricula');
const selectSetor = document.getElementById('setor');
const inputCargo = document.getElementById('cargo');
const inputTelefone = document.getElementById('telefone');

const formHeader = document.getElementById('formHeader');
const formTitleText = document.getElementById('formTitleText');
const formStatusBadge = document.getElementById('formStatusBadge');
const btnSalvar = document.getElementById('btnSalvar');
const btnSalvarText = document.getElementById('btnSalvarText');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

const alertContainer = document.getElementById('alertContainer');
const tabelaBody = document.getElementById('tabelaColaboradores');
const inputPesquisa = document.getElementById('inputPesquisa');
const btnLimparPesquisa = document.getElementById('btnLimparPesquisa');
const totalCount = document.getElementById('totalCount');

const modalNomeColaborador = document.getElementById('modalNomeColaborador');
const modalMatrículaColaborador = document.getElementById('modalMatrículaColaborador');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  modalBsExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));
  renderizarTabela();

  // Listeners
  form.addEventListener('submit', tratarSubmitFormulario);
  inputPesquisa.addEventListener('input', renderizarTabela);
  btnLimparPesquisa.addEventListener('click', () => {
    inputPesquisa.value = '';
    renderizarTabela();
  });
  btnCancelarEdicao.addEventListener('click', resetarFormulario);
  btnConfirmarExclusao.addEventListener('click', executarExclusao);
});

// =============================================================================
// FUNÇÕES DE FEEDBACK (ALERTAS BOOTSTRAP)
// =============================================================================
function exibirAlerta(mensagem, tipo = 'success') {
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
      <i class="bi bi-${tipo === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;

  // Remove o alerta após 5 segundos
  setTimeout(() => {
    const alertElement = alertContainer.querySelector('.alert');
    if (alertElement) {
      const bsAlert = new bootstrap.Alert(alertElement);
      bsAlert.close();
    }
  }, 5000);
}

// =============================================================================
// RENDERIZAÇÃO DA TABELA E BUSCA POR NOME
// =============================================================================
function renderizarTabela() {
  const colaboradores = obterColaboradores();
  const termoBusca = inputPesquisa.value.toLowerCase().trim();

  // Filtra por nome
  const filtrados = colaboradores.filter(colab => 
    colab.nome.toLowerCase().includes(termoBusca)
  );

  totalCount.textContent = filtrados.length;
  tabelaBody.innerHTML = '';

  if (filtrados.length === 0) {
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-3 d-block mb-2"></i>
          Nenhum colaborador encontrado ${termoBusca ? `com o termo "${termoBusca}"` : ''}.
        </td>
      </tr>
    `;
    return;
  }

  // Constrói as linhas da tabela
  filtrados.forEach(colab => {
    const tr = document.createElement('tr');

    // Célula Matrícula
    const tdMatricula = document.createElement('td');
    tdMatricula.className = 'ps-3 fw-bold text-secondary';
    tdMatricula.textContent = colab.matricula;

    // Célula Nome
    const tdNome = document.createElement('td');
    tdNome.className = 'fw-semibold text-dark';
    tdNome.textContent = colab.nome;

    // Célula CPF
    const tdCpf = document.createElement('td');
    tdCpf.textContent = colab.cpf;

    // Célula Setor
    const tdSetor = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'badge bg-light text-dark border';
    badge.textContent = colab.setor;
    tdSetor.appendChild(badge);

    // Célula Cargo
    const tdCargo = document.createElement('td');
    tdCargo.textContent = colab.cargo;

    // Célula Ações
    const tdAcoes = document.createElement('td');
    tdAcoes.className = 'text-center';

    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-sm btn-outline-warning me-1';
    btnEditar.title = 'Editar Colaborador';
    btnEditar.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    btnEditar.onclick = () => prepararEdicao(colab.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn btn-sm btn-outline-danger';
    btnExcluir.title = 'Excluir Colaborador';
    btnExcluir.innerHTML = '<i class="bi bi-trash-fill"></i>';
    btnExcluir.onclick = () => abrirModalExclusao(colab.id, colab.nome, colab.matricula);

    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);

    tr.appendChild(tdMatricula);
    tr.appendChild(tdNome);
    tr.appendChild(tdCpf);
    tr.appendChild(tdSetor);
    tr.appendChild(tdCargo);
    tr.appendChild(tdAcoes);

    tabelaBody.appendChild(tr);
  });
}

// =============================================================================
// CADASTRO E EDIÇÃO (CRUD: CREATE & UPDATE)
// =============================================================================
function tratarSubmitFormulario(event) {
  event.preventDefault();

  const id = inputId.value;
  const nome = inputNome.value.trim();
  const cpf = inputCpf.value.trim();
  const matricula = inputMatricula.value.trim();
  const setor = selectSetor.value;
  const cargo = inputCargo.value.trim();
  const telefone = inputTelefone.value.trim();

  // Validação básica
  if (!nome || !cpf || !matricula || !setor || !cargo) {
    exibirAlerta('Por favor, preencha todos os campos obrigatórios (*).', 'danger');
    return;
  }

  let colaboradores = obterColaboradores();

  // Validação de Duplicidade (CPF e Matrícula)
  const duplicadoCpf = colaboradores.find(c => c.cpf === cpf && c.id != id);
  if (duplicadoCpf) {
    exibirAlerta(`O CPF <strong>${cpf}</strong> já está cadastrado para outro colaborador!`, 'danger');
    return;
  }

  const duplicadoMatricula = colaboradores.find(c => c.matricula === matricula && c.id != id);
  if (duplicadoMatricula) {
    exibirAlerta(`A Matrícula <strong>${matricula}</strong> já pertence a outro colaborador!`, 'danger');
    return;
  }

  if (id) {
    // Modo Edição (UPDATE)
    colaboradores = colaboradores.map(c => {
      if (c.id == id) {
        return { id: Number(id), nome, cpf, matricula, setor, cargo, telefone };
      }
      return c;
    });

    salvarColaboradores(colaboradores);
    exibirAlerta(`Colaborador <strong>${nome}</strong> atualizado com sucesso!`, 'success');
    resetarFormulario();
  } else {
    // Modo Cadastro (CREATE)
    const novoId = colaboradores.length > 0 ? Math.max(...colaboradores.map(c => c.id)) + 1 : 1;
    const novoColaborador = { id: novoId, nome, cpf, matricula, setor, cargo, telefone };

    colaboradores.push(novoColaborador);
    salvarColaboradores(colaboradores);

    exibirAlerta(`Colaborador <strong>${nome}</strong> cadastrado com sucesso!`, 'success');
    
    // Conforme o requisito: Permanece na tela de cadastro e limpa os campos
    resetarFormulario();
  }

  renderizarTabela();
}

// Prepara o formulário com as informações para atualização
function prepararEdicao(id) {
  const colaboradores = obterColaboradores();
  const colab = colaboradores.find(c => c.id == id);

  if (!colab) return;

  inputId.value = colab.id;
  inputNome.value = colab.nome;
  inputCpf.value = colab.cpf;
  inputMatricula.value = colab.matricula;
  selectSetor.value = colab.setor;
  inputCargo.value = colab.cargo;
  inputTelefone.value = colab.telefone || '';

  // Altera a interface do formulário para o modo de Edição
  formHeader.classList.remove('bg-primary');
  formHeader.classList.add('bg-warning');
  formTitleText.textContent = 'Editar Colaborador';
  formStatusBadge.textContent = 'Edição';
  formStatusBadge.classList.remove('text-primary');
  formStatusBadge.classList.add('text-dark');

  btnSalvar.classList.remove('btn-primary');
  btnSalvar.classList.add('btn-warning');
  btnSalvarText.textContent = 'Atualizar Dados';
  btnCancelarEdicao.classList.remove('d-none');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarFormulario() {
  form.reset();
  inputId.value = '';

  // Restaura a interface para o modo de Cadastro
  formHeader.classList.remove('bg-warning');
  formHeader.classList.add('bg-primary');
  formTitleText.textContent = 'Cadastrar Colaborador';
  formStatusBadge.textContent = 'Novo';
  formStatusBadge.classList.remove('text-dark');
  formStatusBadge.classList.add('text-primary');

  btnSalvar.classList.remove('btn-warning');
  btnSalvar.classList.add('btn-primary');
  btnSalvarText.textContent = 'Salvar Colaborador';
  btnCancelarEdicao.classList.add('d-none');
}

// =============================================================================
// EXCLUSÃO COM MODAL BOOTSTRAP (CRUD: DELETE)
// =============================================================================
function abrirModalExclusao(id, nome, matricula) {
  idParaExcluir = id;
  modalNomeColaborador.textContent = nome;
  modalMatrículaColaborador.textContent = matricula;
  modalBsExcluir.show();
}

function executarExclusao() {
  if (!idParaExcluir) return;

  let colaboradores = obterColaboradores();
  const colabRemovido = colaboradores.find(c => c.id == idParaExcluir);
  
  colaboradores = colaboradores.filter(c => c.id != idParaExcluir);
  salvarColaboradores(colaboradores);

  modalBsExcluir.hide();
  idParaExcluir = null;

  renderizarTabela();
  exibirAlerta(`Colaborador <strong>${colabRemovido ? colabRemovido.nome : ''}</strong> excluído com sucesso!`, 'danger');
}