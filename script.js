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

    // Saída
    const saida = `
        <p><b>Custo Material:</b> R$ ${custoMaterial.toFixed(2)}</p>
        <p><b>Custo Energia:</b> R$ ${custoEnergia.toFixed(2)}</p>
        <p><b>Custo Setup:</b> R$ ${custoSetup.toFixed(2)}</p>
        <p><b>Custo Acabamento:</b> R$ ${custoAcabamento.toFixed(2)}</p>
        <p><b>Custo Falhas:</b> R$ ${custoFalhas.toFixed(2)}</p>
        <p><b>Desgaste Máquina:</b> R$ ${desgasteMaquina.toFixed(2)}</p>
        <p><b>Retorno Investimento:</b> R$ ${retornoInvestimento.toFixed(2)}</p>
        <p><b>Custo STLFLIX:</b> R$ ${custoSTLFLIX.toFixed(2)}</p>
        <p><b>Custos Diversos:</b> R$ ${custosDiversos.toFixed(2)}</p>
        <p><b>Custo Pintura:</b> R$ ${custoPintura.toFixed(2)}</p>
        <hr class="my-2">
        <p><b>Valor Produção Unidade:</b> R$ ${custoTotal.toFixed(2)}</p>
        <p><b>Unidade sem Imposto:</b> R$ ${unidadeSemImposto.toFixed(2)}</p>
        <p><b>Unidade com Imposto:</b> R$ ${unidadeComImposto.toFixed(2)}</p>
        <p><b>Lote sem Imposto:</b> R$ ${(unidadeSemImposto * pecas).toFixed(2)}</p>
        <p><b>Lote com Imposto:</b> R$ ${(unidadeComImposto * pecas).toFixed(2)}</p>
    `;

    document.getElementById('saida').innerHTML = saida;
    document.getElementById('resultados').classList.remove('hidden');
}
