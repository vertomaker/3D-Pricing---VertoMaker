// Versão 2.4 - Ajustes de tamanho e posição do logo, cores de texto do PDF
const { jsPDF } = window.jspdf;

// Variável para armazenar o logo em Base64
let vertoMakerLogoBase64 = '';

// Função para converter o logo em Base64 e garantir que esteja pronto antes de gerar o PDF
function loadLogoAndInitialize() {
    const img = new Image();
    img.src = 'icons/icon-192.png'; // Caminho do seu logo
    img.onload = () => {
        const canvas = document.createElement('canvas');
        // Mantém a proporção da imagem original
        const aspectRatio = img.width / img.height;
        const targetHeight = 15; // Altura alvo para o logo no PDF (ajustável)
        const targetWidth = targetHeight * aspectRatio; // Calcula largura para manter proporção

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight); // Desenha a imagem com as novas dimensões
        vertoMakerLogoBase64 = canvas.toDataURL('image/png');
        console.log('Logo VertoMaker carregado com sucesso para Base64.');
    };
    img.onerror = () => {
        console.error('Erro ao carregar o logo da VertoMaker. Verifique o caminho (icons/icon-192.png).');
    };
}

// Chame a função para carregar o logo quando o script for carregado
document.addEventListener('DOMContentLoaded', loadLogoAndInitialize);


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

    if (imposto > 0) {
        valorUnitarioFinal = unidadeComImposto;
        valorTotalFinal = loteComImposto;
    } else {
        valorUnitarioFinal = unidadeSemImposto;
        valorTotalFinal = loteSemImposto;
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
    preencherOrcamento(valorUnitarioFinal, valorTotalFinal, pecas);
    document.getElementById('orcamento-section').classList.remove('hidden');
}

// Função para preencher os dados do orçamento com base no cálculo
function preencherOrcamento(unidadeFinal, loteFinal, pecas) {
    const valorUnitarioFormatado = unidadeFinal.toFixed(2).replace('.', ',');
    const valorTotalFormatado = loteFinal.toFixed(2).replace('.', ',');
    const nomePeca = `Impressão 3D (${pecas} peça${pecas > 1 ? 's' : ''})`;

    const tableData = `Descrição/Valor Final\n${nomePeca}/R$ ${valorTotalFormatado}`;
    
    document.getElementById('tableData').value = tableData;
}

// Função para gerar o PDF
function gerarOrçamento() {
    const doc = new jsPDF();
    const clientName = document.getElementById('clientName').value;
    const mainText = document.getElementById('mainText').value;
    const tableData = document.getElementById('tableData').value;
    const additionalText = document.getElementById('additionalText').value;
    const signature = document.getElementById('signature').value;

    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    let cursorY = 40; // Posição inicial do cursor

    // --- Cabeçalho com Logo ---
    if (vertoMakerLogoBase64) {
        const imgProps = doc.getImageProperties(vertoMakerLogoBase64);
        const imgHeight = 15; // Altura fixa para o logo
        const imgWidth = (imgProps.width * imgHeight) / imgProps.height; // Calcula largura mantendo proporção

        doc.addImage(vertoMakerLogoBase64, 'PNG', leftMargin, 10, imgWidth, imgHeight); 
        cursorY = 10 + imgHeight + 10; // Posição Y do texto abaixo do logo com espaçamento
    } else {
        console.warn('Logo VertoMaker não carregado, pulando adição ao PDF.');
    }
    
    // --- Título do Orçamento ---
    const imposto = parseFloat(document.getElementById('imposto').value);
    let titulo;
    if (imposto > 0) {
        titulo = "Orçamento com Imposto";
    } else {
        titulo = "Orçamento sem Imposto";
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Cor preta para o título
    doc.text(titulo, leftMargin, cursorY);
    cursorY += 10;

    // --- Nome do Cliente (Preto e Negrito) ---
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Cor preta
    doc.setFont(undefined, 'bold'); // Negrito
    doc.text(`Para: ${clientName}`, leftMargin, cursorY);
    doc.setFont(undefined, 'normal'); // Volta ao normal para o restante do texto
    doc.setTextColor(0, 0, 0); // Volta à cor preta padrão
    cursorY += 20; // Espaçamento após o nome do cliente

    // --- Texto Principal ---
    doc.setFontSize(12);
    doc.text(mainText, leftMargin, cursorY, { maxWidth: contentWidth });
    cursorY = doc.getTextDimensions(mainText,
