// Versão 1.6 - Comentário para controle de cache
const { jsPDF } = window.jspdf;

// Função principal da calculadora
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

    const unidadeSemImposto = custoTotal * (1 + lucro / 100);
    const unidadeComImposto = unidadeSemImposto * (1 + imposto / 100);
    const loteSemImposto = unidadeSemImposto * pecas;
    const loteComImposto = unidadeComImposto * pecas;

    // Condição para determinar qual valor será usado no orçamento
    let valorUnitarioFinal;
    let valorTotalFinal;
    let tituloOrcamento;

    if (imposto > 0) {
        valorUnitarioFinal = unidadeComImposto;
        valorTotalFinal = loteComImposto;
        tituloOrcamento = "Orçamento com Imposto";
    } else {
        valorUnitarioFinal = unidadeSemImposto;
        valorTotalFinal = loteSemImposto;
        tituloOrcamento = "Orçamento sem Imposto";
    }

    // Exibe os resultados na tela
    const saida = `
        <p><b>Valor de Produção por Unidade:</b> R$ ${custoTotal.toFixed(2)}</p>
        <p><b>Unidade sem Imposto:</b> R$ ${unidadeSemImposto.toFixed(2)}</p>
        <p><b>Unidade com Imposto:</b> R$ ${unidadeComImposto.toFixed(2)}</p>
        <p><b>Lote sem Imposto:</b> R$ ${loteSemImposto.toFixed(2)}</p>
        <p><b>Lote com Imposto:</b> R$ ${loteComImposto.toFixed(2)}</p>
        <hr class="my-2">
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

    // Preenche e exibe a seção de orçamento
    preencherOrcamento(valorUnitarioFinal, valorTotalFinal, pecas, tituloOrcamento);
    document.getElementById('orcamento-section').classList.remove('hidden');
}

// Função para preencher os dados do orçamento com base no cálculo
function preencherOrcamento(unidadeFinal, loteFinal, pecas, tituloOrcamento) {
    const valorUnitarioFormatado = unidadeFinal.toFixed(2).replace('.', ',');
    const valorTotalFormatado = loteFinal.toFixed(2).replace('.', ',');
    const nomePeca = `Impressão 3D (${pecas} peça${pecas > 1 ? 's' : ''})`;

    const tableData = `Descrição/Valor Final\n${nomePeca}/R$ ${valorTotalFormatado}`;
    
    document.getElementById('tableData').value = tableData;
    // O título será atualizado dentro da função gerarOrcamento()
}

// Função para gerar o PDF
function gerarOrçamento() {
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

    // --- CONFIGURAÇÕES DO LOGO ---
    const logoWidth = 50;  
    const logoHeight = 25; 
    const logoY = 10; 

    // Função para desenhar cabeçalho em cada página
    function drawHeader(doc) {
        try {
            const logoX = (pageWidth - logoWidth) / 2; // centralizado
            doc.addImage("logo.png", "PNG", logoX, logoY, logoWidth, logoHeight);
        } catch (e) {
            console.warn("Logo não encontrado. Certifique-se de que 'logo.png' está na pasta correta.");
        }
    }

    // Desenha o cabeçalho na primeira página
    drawHeader(doc);

    let cursorY = 40; // espaço inicial após o logo

    // --- TÍTULO ---
    const imposto = parseFloat(document.getElementById('imposto').value);
    let titulo = imposto > 0 ? "Orçamento com Imposto" : "Orçamento sem Imposto";

    doc.setFontSize(14);
    doc.setTextColor(200, 0, 0); 
    doc.text(titulo, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 10;

    // Nome do cliente
    if (clientName) {
        doc.setFontSize(13);
        doc.setTextColor(50, 50, 50); 
        doc.text(`Proposta de orçamento para ${clientName}`, pageWidth / 2, cursorY, { align: "center" });
        cursorY += 20;
    }

    // Reset para texto normal
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // --- TEXTO PRINCIPAL ---
    doc.text(mainText, leftMargin, cursorY, { maxWidth: contentWidth });
    cursorY += doc.getTextDimensions(mainText, { maxWidth: contentWidth }).h + 10;

    // --- TABELA ---
    const tableRows = tableData.split('\n').map(row => row.split('/'));
    doc.autoTable({
        startY: cursorY,
        head: [tableRows[0]],
        body: tableRows.slice(1),
        theme: 'grid',
        styles: { cellPadding: 2, fontSize: 10 },
        margin: { left: leftMargin, right: rightMargin },

        // Repete o cabeçalho a cada página
        didDrawPage: function (data) {
            drawHeader(doc);
        }
    });

    cursorY = doc.autoTable.previous.finalY + 10;

    // --- TEXTO ADICIONAL ---
    doc.text(additionalText, leftMargin, cursorY, { maxWidth: contentWidth });
    cursorY += doc.getTextDimensions(additionalText, { maxWidth: contentWidth }).h + 30;

    // --- ASSINATURA ---
    doc.setFontSize(12);
    doc.text(signature, pageWidth / 2, cursorY, { align: 'center' });

    // --- SALVAR PDF ---
    let safeClientName = clientName
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-zA-Z0-9-_]/g, "_"); 

    const fileName = `Orcamento_${safeClientName || 'Cliente'}.pdf`;
    doc.save(fileName);
}
