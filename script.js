// Versão 3.6.2 - Adição de MARKUP
const { jsPDF } = window.jspdf;

// --- INÍCIO: LÓGICA DO GERENCIADOR DE FILAMENTOS ---

// Função para pegar os perfis do localStorage
function getProfiles() {
    const profiles = localStorage.getItem('filamentProfiles');
    return profiles ? JSON.parse(profiles) : [];
}

// Função para salvar os perfis no localStorage
function saveProfiles(profiles) {
    localStorage.setItem('filamentProfiles', JSON.stringify(profiles));
}

// Função para renderizar os perfis na tela (lista e dropdown)
function renderProfiles() {
    const profiles = getProfiles();
    const profilesListDiv = document.getElementById('profilesList');
    const filamentSelector = document.getElementById('filamentSelector');

    // Limpa a lista e o seletor atuais
    profilesListDiv.innerHTML = '';
    filamentSelector.innerHTML = '<option value="">-- Selecione um perfil --</option>';

    profiles.forEach(profile => {
        // Adiciona ao seletor (dropdown)
        const option = document.createElement('option');
        option.value = profile.value;
        option.textContent = `${profile.name} (R$ ${profile.value.toFixed(2)})`;
        filamentSelector.appendChild(option);

        // Adiciona à lista de gerenciamento
        const profileElement = document.createElement('div');
        profileElement.className = 'flex justify-between items-center bg-gray-100 p-2 rounded-lg';
        profileElement.innerHTML = `
            <span><strong>${profile.name}</strong> - R$ ${profile.value.toFixed(2)}/kg</span>
            <button class="delete-profile-btn bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded" data-name="${profile.name}">
                Excluir
            </button>
        `;
        profilesListDiv.appendChild(profileElement);
    });
}

// --- FIM: LÓGICA DO GERENCIADOR DE FILAMENTOS ---


// --- LÓGICA DO CATÁLOGO DE PEÇAS ---

/**
 * Busca os perfis de peças salvos no localStorage.
 * @returns {Array} Um array de objetos de peças.
 */
function getPieces() {
    const pieces = localStorage.getItem('pieceProfiles');
    return pieces ? JSON.parse(pieces) : [];
}

/**
 * Salva o array de perfis de peças no localStorage.
 * @param {Array} pieces O array de peças a ser salvo.
 */
function savePieces(pieces) {
    localStorage.setItem('pieceProfiles', JSON.stringify(pieces));
}

/**
 * Atualiza a lista de peças na tela e o menu de seleção.
 */
function renderPieces() {
    const pieces = getPieces();
    const piecesListDiv = document.getElementById('piecesList');
    const pieceSelector = document.getElementById('pieceSelector');

    // Limpa o conteúdo atual para evitar duplicação
    piecesListDiv.innerHTML = '';
    pieceSelector.innerHTML = '<option value="">-- Selecione uma peça --</option>';
    
    pieces.forEach((piece, index) => {
        // Adiciona a peça ao menu de seleção (dropdown)
        const option = document.createElement('option');
        option.value = index; // O valor da opção é o índice da peça no array
        option.textContent = piece.name;
        pieceSelector.appendChild(option);

        // Adiciona a peça à lista de gerenciamento (para visualização e exclusão)
        const pieceElement = document.createElement('div');
        pieceElement.className = 'flex justify-between items-center bg-gray-100 p-2 rounded-lg';
        pieceElement.innerHTML = `
            <span><strong>${piece.name}</strong> (${piece.hours}h ${piece.minutes}m | ${piece.weight}g)</span>
            <button class="delete-piece-btn bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded" data-name="${piece.name}">
                Excluir
            </button>
        `;
        piecesListDiv.appendChild(pieceElement);
    });
}

// Função para formatar o tempo em horas e minutos
function formatarTempo(horasDecimais) {
    const horas = Math.floor(horasDecimais);
    const minutos = Math.round((horasDecimais - horas) * 60);
    
    if (horas === 0) {
        return `${minutos} min`;
    } else if (minutos === 0) {
        return `${horas} h`;
    } else {
        return `${horas} h e ${minutos} min`;
    }
}

// Event listener para quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
   

    // --- INÍCIO: EVENT LISTENERS DO GERENCIADOR ---

    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileNameInput = document.getElementById('profileName');
    const profileValueInput = document.getElementById('profileValue');
    const profilesListDiv = document.getElementById('profilesList');
    const filamentSelector = document.getElementById('filamentSelector');
    const valorFilamentoInput = document.getElementById('valorFilamento');

    // Salvar um novo perfil
    saveProfileBtn.addEventListener('click', () => {
        const name = profileNameInput.value.trim();
        const value = parseFloat(profileValueInput.value);

        if (name && value > 0) {
            const profiles = getProfiles();
            // Evita duplicados pelo nome
            if (profiles.some(p => p.name === name)) {
                alert('Já existe um perfil com este nome.');
                return;
            }
            profiles.push({ name, value });
            saveProfiles(profiles);
            renderProfiles();
            profileNameInput.value = '';
            profileValueInput.value = '';
        } else {
            alert('Por favor, preencha o nome e um valor válido para o perfil.');
        }
    });

    // Excluir um perfil (usando delegação de evento)
    profilesListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-profile-btn')) {
            const profileNameToDelete = event.target.getAttribute('data-name');
            let profiles = getProfiles();
            profiles = profiles.filter(p => p.name !== profileNameToDelete);
            saveProfiles(profiles);
            renderProfiles();
        }
    });

    // Atualizar o campo de valor ao selecionar um perfil no dropdown
    filamentSelector.addEventListener('change', (event) => {
        if (event.target.value) {
            valorFilamentoInput.value = event.target.value;
        }
    });

    // Renderiza os perfis existentes ao carregar a página
    renderProfiles();

    // --- FIM: EVENT LISTENERS DO GERENCIADOR ---


    // --- LÓGICA PARA O CATÁLOGO DE PEÇAS ---

    // 1. Seleciona os elementos do HTML
    const savePieceBtn = document.getElementById('savePieceBtn');
    const newPieceNameInput = document.getElementById('newPieceName');
    const newPieceHoursInput = document.getElementById('newPieceHours');
    const newPieceMinutesInput = document.getElementById('newPieceMinutes');
    const newPieceWeightInput = document.getElementById('newPieceWeight');
    const piecesListDiv = document.getElementById('piecesList');
    const pieceSelector = document.getElementById('pieceSelector');

    // 2. Evento para o botão "Salvar Peça"
    savePieceBtn.addEventListener('click', () => {
        const name = newPieceNameInput.value.trim();
        const hours = parseInt(newPieceHoursInput.value) || 0;
        const minutes = parseInt(newPieceMinutesInput.value) || 0;
        const weight = parseFloat(newPieceWeightInput.value);

        if (name && weight > 0) {
            const pieces = getPieces();
            // Verifica se já não existe uma peça com o mesmo nome
            if (pieces.some(p => p.name === name)) {
                alert('Já existe uma peça com este nome no catálogo.');
                return;
            }
            pieces.push({ name, hours, minutes, weight });
            savePieces(pieces);
            renderPieces(); // Atualiza a lista na tela
            
            // Limpa os campos de entrada
            newPieceNameInput.value = '';
            newPieceHoursInput.value = '0';
            newPieceMinutesInput.value = '0';
            newPieceWeightInput.value = '0';
        } else {
            alert('Por favor, preencha o nome e um peso válido para a peça.');
        }
    });

    // 3. Evento para os botões "Excluir" (na lista de peças)
    piecesListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-piece-btn')) {
            const nameToDelete = event.target.getAttribute('data-name');
            const updatedPieces = getPieces().filter(p => p.name !== nameToDelete);
            savePieces(updatedPieces);
            renderPieces(); // Atualiza a lista na tela
        }
    });

    // 4. Evento para o menu de seleção que preenche os campos da calculadora
    pieceSelector.addEventListener('change', (event) => {
        const pieceIndex = event.target.value;
        if (pieceIndex !== "") { // Garante que não é a opção "-- Selecione --"
            const selectedPiece = getPieces()[pieceIndex];
            if (selectedPiece) {
                document.getElementById('horas').value = selectedPiece.hours;
                document.getElementById('minutos').value = selectedPiece.minutes;
                document.getElementById('peso').value = selectedPiece.weight;
            }
        }
    });

    // 5. Renderiza a lista de peças quando a página carrega
    renderPieces();
});

// Função para preencher os dados do orçamento - ADICIONE ESTA FUNÇÃO
function preencherOrcamento(unidadeFinal, loteFinal, pecas, tituloOrcamento) {
    const valorUnitarioFormatado = unidadeFinal.toFixed(2).replace('.', ',');
    const valorTotalFormatado = loteFinal.toFixed(2).replace('.', ',');
    const nomePeca = `Impressão 3D (${pecas} peça${pecas > 1 ? 's' : ''})`;

    const tableData = `Descrição/Valor Final\n${nomePeca}/R$ ${valorTotalFormatado}`;
    
    document.getElementById('tableData').value = tableData;
    console.log('Orçamento preenchido com sucesso');
}

// Função principal da calculadora - VERSÃO COMPLETA CORRIGIDA
function calcular() {
    // Entradas
    const horas = parseFloat(document.getElementById('horas').value);
    const minutos = parseFloat(document.getElementById('minutos').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const pecas = parseFloat(document.getElementById('pecas').value);
    const valorFilamento = parseFloat(document.getElementById('valorFilamento').value);
    const custoSetup = parseFloat(document.getElementById('custoSetup').value);
    const custoAcabamento = parseFloat(document.getElementById('custoAcabamento').value);
    const precoKWh = parseFloat(document.getElementById('precoKWh').value);
    const consumoMaquina = parseFloat(document.getElementById('consumoMaquina').value);
    const valorImpressora = parseFloat(document.getElementById('valorImpressora').value);
    const tempoRetorno = parseFloat(document.getElementById('tempoRetorno').value);
    const horasDepreciacao = parseFloat(document.getElementById('horasDepreciacao').value);
    const diasMes = parseFloat(document.getElementById('diasMes').value);
    const horasDia = parseFloat(document.getElementById('horasDia').value);
    const falhas = parseFloat(document.getElementById('falhas').value);
    const imposto = parseFloat(document.getElementById('imposto').value);
    const lucro = parseFloat(document.getElementById('lucro').value);
    const custosDiversos = parseFloat(document.getElementById('custosDiversos').value);
    const assinaturaSTLFLIX = parseFloat(document.getElementById('assinaturaSTLFLIX').value);
    const valorPinturaHora = parseFloat(document.getElementById('valorPinturaHora').value);
    const tempoPinturaHoras = parseFloat(document.getElementById('tempoPinturaHoras').value);
    
    const calcMode = document.getElementById('calcMode').value;

    const tempoHoras = horas + (minutos / 60);

    // Cálculos dos custos
    const custoMaterial = (peso / 1000) * valorFilamento;
    const consumoKWh = (consumoMaquina * tempoHoras) / 1000;
    const custoEnergia = consumoKWh * precoKWh;
    const custoFalhas = (custoMaterial + custoEnergia + custoSetup + custoAcabamento) * (falhas / 100);
    const desgasteMaquina = (valorImpressora / horasDepreciacao) * tempoHoras;
    const horasMensais = diasMes * horasDia;
    const retornoInvestimento = (valorImpressora / (tempoRetorno * horasMensais)) * tempoHoras;
    const custoSTLFLIX = (assinaturaSTLFLIX / (36 * horasMensais)) * tempoHoras;
    const custoPintura = valorPinturaHora * tempoPinturaHoras;

    const custoTotal = custoMaterial + custoEnergia + custoSetup + custoAcabamento + custoFalhas + desgasteMaquina + retornoInvestimento + custosDiversos + custoSTLFLIX + custoPintura;

    let unidadeSemImposto, unidadeComImposto, loteSemImposto, loteComImposto;

    // Verificar modo de cálculo
    if (calcMode === 'markup') {
        // Cálculo por MARKUP
        const markup = lucro;
        unidadeSemImposto = custoTotal * markup;
        unidadeComImposto = unidadeSemImposto * (1 + imposto / 100);
    } else {
        // Cálculo por MARGEM
        unidadeSemImposto = custoTotal / (1 - (lucro / 100));
        unidadeComImposto = unidadeSemImposto * (1 + imposto / 100);
    }

    loteSemImposto = unidadeSemImposto * pecas;
    loteComImposto = unidadeComImposto * pecas;

    // Determinar valores finais
    let valorUnitarioFinal, valorTotalFinal, tituloOrcamento;
    if (imposto > 0) {
        valorUnitarioFinal = unidadeComImposto;
        valorTotalFinal = loteComImposto;
        tituloOrcamento = "Orçamento com Imposto";
    } else {
        valorUnitarioFinal = unidadeSemImposto;
        valorTotalFinal = loteSemImposto;
        tituloOrcamento = "Orçamento sem Imposto";
    }

    // Exibir resultados
    const modoCalculo = calcMode === 'markup' ? 'Markup' : 'Margem de Lucro';
    const parametroCalculo = calcMode === 'markup' ? `Markup: ${lucro}x` : `Margem: ${lucro}%`;

    const saida = `
        <div class="bg-green-50 p-3 rounded-lg mb-3">
            <p class="font-bold text-green-800">Modo de Cálculo: ${modoCalculo}</p>
            <p class="text-green-700">${parametroCalculo}</p>
        </div>
        <p><b>Custo Total de Produção por Unidade:</b> R$ ${custoTotal.toFixed(2)}</p>
        <p><b>Unidade sem Imposto:</b> R$ ${unidadeSemImposto.toFixed(2)}</p>
        <p><b>Unidade com Imposto:</b> R$ ${unidadeComImposto.toFixed(2)}</p>
        <p><b>Lote sem Imposto (${pecas} peças):</b> R$ ${loteSemImposto.toFixed(2)}</p>
        <p><b>Lote com Imposto (${pecas} peças):</b> R$ ${loteComImposto.toFixed(2)}</p>
        <hr class="my-3">
        <p class="font-bold text-gray-700">Detalhamento dos Custos:</p>
        <p><b>Custo Material:</b> R$ ${custoMaterial.toFixed(2)}</p>
        <p><b>Custo Energia:</b> R$ ${custoEnergia.toFixed(2)}</p>
        <p><b>Custo de Setup:</b> R$ ${custoSetup.toFixed(2)}</p>
        <p><b>Custo de Acabamento:</b> R$ ${custoAcabamento.toFixed(2)}</p>
        <p><b>Custo de Falhas:</b> R$ ${custoFalhas.toFixed(2)}</p>
        <p><b>Desgaste da Máquina:</b> R$ ${desgasteMaquina.toFixed(2)}</p>
        <p><b>Retorno de Investimento:</b> R$ ${retornoInvestimento.toFixed(2)}</p>
        <p><b>Custo STLFLIX:</b> R$ ${custoSTLFLIX.toFixed(2)}</p>
        <p><b>Custos Diversos:</b> R$ ${custosDiversos.toFixed(2)}</p>
        <p><b>Custo Pintura:</b> R$ ${custoPintura.toFixed(2)}</p>
    `;

    document.getElementById('saida').innerHTML = saida;
    document.getElementById('resultados').classList.remove('hidden');

    // Preencher e mostrar a seção de orçamento
    preencherOrcamento(valorUnitarioFinal, valorTotalFinal, pecas, tituloOrcamento);
    
    // Mostrar a seção de orçamento
    const orcamentoSection = document.getElementById('orcamento-section');
    orcamentoSection.style.display = 'block';
    orcamentoSection.classList.remove('hidden');
    
    console.log('Cálculo concluído - Seção de orçamento deve estar visível');
}

// Função para alternar entre os modos de cálculo - VERSÃO SIMPLIFICADA
function toggleCalcMode() {
    const calcMode = document.getElementById('calcMode').value;
    const lucroLabel = document.querySelector('label[for="lucro"]');
    const lucroInput = document.getElementById('lucro');
    const helpText = document.getElementById('helpText');

    if (calcMode === 'markup') {
        lucroLabel.innerHTML = 'Markup (Multiplicador):';
        lucroInput.placeholder = 'Ex: 3 para triplicar o custo';
        helpText.innerHTML = 'Markup: multiplicador aplicado sobre o custo total';
        
        if (lucroInput.value === '75') lucroInput.value = '3';
    } else {
        lucroLabel.innerHTML = 'Margem de Lucro (%):';
        lucroInput.placeholder = 'Ex: 50 para 50% de margem';
        helpText.innerHTML = 'Margem: percentual sobre o preço de venda';
        
        if (lucroInput.value === '3') lucroInput.value = '75';
    }
    
    // Recalcular se já há resultados
    if (!document.getElementById('resultados').classList.contains('hidden')) {
        calcular();
    }
}

// Função para gerar o PDF - VERSÃO CORRIGIDA
async function gerarOrçamento() {
    try {
        const doc = new jsPDF();

        // Dados do formulário
        const clientName = document.getElementById('clientName').value.trim();
        const mainText = document.getElementById('mainText').value;
        const tableData = document.getElementById('tableData').value;
        const additionalText = document.getElementById('additionalText').value;
        const signature = document.getElementById('signature').value;

        // Margens
        const leftMargin = 20;
        const rightMargin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - leftMargin - rightMargin;

        let cursorY = 20; // Posição inicial do cursor

        // Título do orçamento (centralizado)
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 0, 0); // Vermelho
        doc.text('VERTOMAKER - ORÇAMENTO', pageWidth / 2, cursorY, { align: "center" });
        cursorY += 10;

        // Nome do cliente em destaque
        if (clientName) {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0); // cor preta
            doc.text(`Proposta de orçamento para: ${clientName}`, pageWidth / 2, cursorY, { align: "center" });
            cursorY += 15;
        }

        // Data atual
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Data: ${dataAtual}`, pageWidth - rightMargin, cursorY, { align: "right" });
        cursorY += 10;

        // Reset para texto normal
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');

        // --- TEXTO PRINCIPAL ---
        const mainTextLines = doc.splitTextToSize(mainText, contentWidth);
        doc.text(mainTextLines, leftMargin, cursorY);
        cursorY += (mainTextLines.length * 6) + -10;

        // --- Tabela ---
        const tableRows = tableData.split('\n').map(row => row.split('/'));
        
        doc.autoTable({
            startY: cursorY,
            head: [tableRows[0]],
            body: tableRows.slice(1),
            theme: 'grid',
            headStyles: {
                fillColor: [255, 0, 0], // Vermelho para o fundo do cabeçalho
                textColor: [255, 255, 255], // Branco para o texto do cabeçalho
                fontStyle: 'bold'
            },
            styles: {
                cellPadding: 3,
                fontSize: 11,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                textColor: [0, 0, 0]
            },
            margin: { left: leftMargin, right: rightMargin }
        });

        cursorY = doc.autoTable.previous.finalY + 5;

        // --- DETALHAMENTO DO ORÇAMENTO ---
cursorY += 5;
doc.setFontSize(11);
doc.setTextColor(80, 80, 80);
doc.setFont(undefined, 'bold');
doc.text("Detalhamento do orçamento:", leftMargin, cursorY);
cursorY += 6;
doc.setFont(undefined, 'normal');

// Calcular todos os custos novamente para o detalhamento
const horas = parseFloat(document.getElementById('horas').value);
const minutos = parseFloat(document.getElementById('minutos').value);
const peso = parseFloat(document.getElementById('peso').value);
const pecas = parseFloat(document.getElementById('pecas').value);
const valorFilamento = parseFloat(document.getElementById('valorFilamento').value);
const custoSetup = parseFloat(document.getElementById('custoSetup').value);
const custoAcabamento = parseFloat(document.getElementById('custoAcabamento').value);
const precoKWh = parseFloat(document.getElementById('precoKWh').value);
const consumoMaquina = parseFloat(document.getElementById('consumoMaquina').value);
const valorImpressora = parseFloat(document.getElementById('valorImpressora').value);
const tempoRetorno = parseFloat(document.getElementById('tempoRetorno').value);
const horasDepreciacao = parseFloat(document.getElementById('horasDepreciacao').value);
const diasMes = parseFloat(document.getElementById('diasMes').value);
const horasDia = parseFloat(document.getElementById('horasDia').value);
const falhas = parseFloat(document.getElementById('falhas').value);
const custosDiversos = parseFloat(document.getElementById('custosDiversos').value);
const assinaturaSTLFLIX = parseFloat(document.getElementById('assinaturaSTLFLIX').value);
const valorPinturaHora = parseFloat(document.getElementById('valorPinturaHora').value);
const tempoPinturaHoras = parseFloat(document.getElementById('tempoPinturaHoras').value);
const imposto = parseFloat(document.getElementById('imposto').value);

const tempoHoras = horas + (minutos / 60);

// Cálculos
const custoMaterial = (peso / 1000) * valorFilamento;
const consumoKWh = (consumoMaquina * tempoHoras) / 1000;
const custoEnergia = consumoKWh * precoKWh;
const custoFalhas = (custoMaterial + custoEnergia + custoSetup + custoAcabamento) * (falhas / 100);
const desgasteMaquina = (valorImpressora / horasDepreciacao) * tempoHoras;
const horasMensais = diasMes * horasDia;
const retornoInvestimento = (valorImpressora / (tempoRetorno * horasMensais)) * tempoHoras;
const custoSTLFLIX = (assinaturaSTLFLIX / (36 * horasMensais)) * tempoHoras;
const custoPintura = valorPinturaHora * tempoPinturaHoras;

const custoTotal = custoMaterial + custoEnergia + custoSetup + custoAcabamento + custoFalhas + desgasteMaquina + retornoInvestimento + custosDiversos + custoSTLFLIX + custoPintura;

// Formatar o texto de detalhamento
let detalhesText = "";

// Tempo de produção
detalhesText += `• ${formatarTempo(tempoHoras)} de impressão 3D\n`;

if (tempoPinturaHoras > 0) {
    detalhesText += `• ${formatarTempo(tempoPinturaHoras)} de pintura/acabamento manual\n`;
}

// Custos de material
detalhesText += `• R$ ${custoMaterial.toFixed(2)} em filamento (${peso.toFixed(0)}g)\n`;

// Custos de energia
detalhesText += `• R$ ${custoEnergia.toFixed(2)} em energia elétrica\n`;

// Custos de mão de obra e operação
if (custoSetup > 0) {
    detalhesText += `• R$ ${custoSetup.toFixed(2)} em preparação/configuração\n`;
}

if (custoAcabamento > 0) {
    detalhesText += `• R$ ${custoAcabamento.toFixed(2)} em acabamento pós-impressão\n`;
}

// Custos indiretos
if (custoFalhas > 0) {
    detalhesText += `• R$ ${custoFalhas.toFixed(2)} para cobrir possíveis falhas (${falhas}%)\n`;
}

if (desgasteMaquina > 0) {
    detalhesText += `• R$ ${desgasteMaquina.toFixed(2)} para manutenção/desgaste da impressora\n`;
}

if (retornoInvestimento > 0) {
    detalhesText += `• R$ ${retornoInvestimento.toFixed(2)} para retorno do investimento\n`;
}

if (custoSTLFLIX > 0) {
    detalhesText += `• R$ ${custoSTLFLIX.toFixed(2)} para assinatura de modelos 3D\n`;
}

if (custosDiversos > 0) {
    detalhesText += `• R$ ${custosDiversos.toFixed(2)} em custos diversos/operacionais\n`;
}

// Apenas impostos (removida a linha de margem de lucro)
if (imposto > 0) {
    detalhesText += `• R$ ${(custoTotal * (imposto/100)).toFixed(2)} em impostos (${imposto}%)\n`;
}

const detalhesLines = doc.splitTextToSize(detalhesText, contentWidth);
doc.text(detalhesLines, leftMargin + 5, cursorY);
cursorY += (detalhesLines.length * 5) + 5;

        // --- TEXTO ADICIONAL ---
        const additionalLines = doc.splitTextToSize(additionalText, contentWidth);
        doc.text(additionalLines, leftMargin, cursorY);
        cursorY += (additionalLines.length * 6) + 15;

        // --- ASSINATURA ---
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Atenciosamente,', leftMargin, cursorY);
        cursorY += 8;
        
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text(signature, leftMargin, cursorY);
        cursorY += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('VertoMaker - do seu jeito. do seu universo.', leftMargin, cursorY);

        // --- SALVAR PDF ---
        let safeClientName = clientName
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        const fileName = `Orcamento_${safeClientName || 'Cliente'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
}
