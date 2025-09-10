// Versão 2.5 - Correção do botão calcular, cores no PDF e logo
const { jsPDF } = window.jspdf;

// Variável para armazenar o logo em Base64
let vertoMakerLogoBase64 = '';

// Função para converter o logo em Base64 e garantir que esteja pronto antes de gerar o PDF
function loadLogoAndInitialize() {
    const img = new Image();
    img.src = 'icons/icon-192.png'; // Caminho do seu logo
    img.onload = () => {
        const canvas = document.createElement('canvas');
        // Define uma largura fixa para o canvas, mantendo a proporção
        const imgWidth = 10; // Largura desejada no PDF
        const imgHeight = (img.height / img.width) * imgWidth;

        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight); // Desenha a imagem com as novas dimensões
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
        // Ajuste as dimensões (largura, altura) e posição (x, y) do logo conforme necessário
        // Largura: 50, Altura: 15 (exemplo, ajuste conforme a proporção do seu logo)
        doc.addImage(vertoMakerLogoBase64, 'PNG', leftMargin, 10, 50, (50 / doc.getImageProperties(vertoMakerLogoBase64).width) * doc.getImageProperties(vertoMakerLogoBase64).height); 
        cursorY = 35; // Ajusta o cursor Y após o logo
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
    doc.setTextColor(255, 0, 0); // Cor vermelha para o título
    doc.text(titulo, leftMargin, cursorY);
    cursorY += 10;

    // --- Nome do Cliente (Vermelho e Negrito) ---
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Cor vermelha
    doc.setFont(undefined, 'bold'); // Negrito
    doc.text(`Para: ${clientName}`, leftMargin, cursorY);
    doc.setFont(undefined, 'normal'); // Volta ao normal para o restante do texto
    doc.setTextColor(0, 0, 0); // Volta à cor preta padrão
    cursorY += 20; // Espaçamento após o nome do cliente

    // --- Texto Principal ---
    doc.setFontSize(12);
    doc.text(mainText, leftMargin, cursorY, { maxWidth: contentWidth });
    cursorY = doc.getTextDimensions(mainText, { maxWidth: contentWidth }).h + cursorY;
    cursorY += 10;

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
            fontStyle: 'bold' // Negrito para o texto do cabeçalho
        },
        styles: {
            cellPadding: 2,
            fontSize: 10,
            lineColor: [200, 200, 200], // Cor da linha da borda da tabela
            lineWidth: 0.1,
            textColor: [0,0,0] // Garante que o texto do corpo da tabela seja preto
        },
        margin: { left: leftMargin, right: rightMargin }
    });

    cursorY = doc.autoTable.previous.finalY + 10;

    // --- Texto Adicional ---
    doc.text(additionalText, leftMargin, cursorY, { maxWidth: contentWidth });
    cursorY = doc.getTextDimensions(additionalText, { maxWidth: contentWidth }).h + cursorY;
    cursorY += 30;
    
    // --- Assinatura ---
    doc.text(signature, pageWidth / 2, cursorY, { align: 'center' });

    // Salva o PDF
    const fileName = `Orçamento_${clientName || 'Cliente'}.pdf`;
    doc.save(fileName);
}

// Registro do service worker para PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker registrado"));
}
