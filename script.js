// Versão 3.3 - Correção do problema do logo no PDF
const { jsPDF } = window.jspdf;

// Variável para armazenar o logo em Base64 após o carregamento
let vertoMakerLogoBase64 = null;
let logoLoaded = false;

// Função para carregar o logo
function loadLogo() {
    return new Promise((resolve, reject) => {
        // Se já está carregado, resolve imediatamente
        if (logoLoaded && vertoMakerLogoBase64) {
            resolve(vertoMakerLogoBase64);
            return;
        }

        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Permite carregar imagens de diferentes origens
        img.src = 'image/logopdf.png'; // Caminho do seu logo
        
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const imgWidth = 40; // Largura desejada no PDF
                const imgHeight = 20; // Altura desejada no PDF
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                const ctx = canvas.getContext('2d');
                
                // Limpa o canvas e desenha a imagem
                ctx.clearRect(0, 0, imgWidth, imgHeight);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                
                vertoMakerLogoBase64 = canvas.toDataURL('image/png');
                logoLoaded = true;
                console.log('Logo VertoMaker carregado com sucesso.');
                resolve(vertoMakerLogoBase64);
            } catch (error) {
                console.error('Erro ao processar o logo:', error);
                reject(error);
            }
        };
        
        img.onerror = (error) => {
            console.error('Erro ao carregar o logo. Verifique o caminho (image/logopdf.png).', error);
            reject(error);
        };
        
        // Timeout para evitar que a promise fique pendente para sempre
        setTimeout(() => {
            if (!logoLoaded) {
                reject(new Error('Timeout ao carregar o logo'));
            }
        }, 5000);
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

// Carrega o logo quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    loadLogo().catch(error => {
        console.warn('Não foi possível carregar o logo:', error.message);
    });
});

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

        // --- Cabeçalho com Logo ---
        try {
            const logoData = await loadLogo();
            if (logoData) {
                doc.addImage(logoData, 'PNG', leftMargin, 10, 40, 20);
                cursorY = 40; // Ajusta a posição após o logo
            }
        } catch (error) {
            console.warn('Logo não disponível, continuando sem ele:', error.message);
        }

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
        doc.text('VertoMaker - Impressões 3D de Qualidade', leftMargin, cursorY);

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
