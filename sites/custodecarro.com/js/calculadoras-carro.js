document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('resultado');

  if (!form || !result) return;

  const money = function (value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const number = function (id) {
    return Number(document.getElementById(id).value || 0);
  };

  const write = function (lines) {
    result.innerHTML = lines.join('<br>');
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const type = form.dataset.calc;

    if (type === 'custo-mensal') {
      const precoCarro = number('precoCarro');
      const kmMes = number('kmMes');
      const consumo = number('consumo');
      const precoCombustivel = number('precoCombustivel');
      const seguroMensal = number('seguroMensal');
      const manutencaoMensal = number('manutencaoMensal');
      const ipvaAnual = number('ipvaAnual');
      const depreciacaoAnual = precoCarro * 0.1;

      if (consumo <= 0 || kmMes <= 0) {
        result.textContent = 'Informe km por mes e consumo maiores que zero.';
        return;
      }

      const combustivelMensal = (kmMes / consumo) * precoCombustivel;
      const custoMensal = combustivelMensal + seguroMensal + manutencaoMensal + ipvaAnual / 12 + depreciacaoAnual / 12;
      const custoAnual = custoMensal * 12;
      const custoKm = custoMensal / kmMes;

      write([
        'Custo mensal estimado: ' + money(custoMensal),
        'Custo anual estimado: ' + money(custoAnual),
        'Custo por km: ' + money(custoKm)
      ]);
      return;
    }

    if (type === 'gasto-combustivel') {
      const kmMes = number('kmMes');
      const consumo = number('consumo');
      const precoCombustivel = number('precoCombustivel');

      if (consumo <= 0) {
        result.textContent = 'Informe um consumo maior que zero.';
        return;
      }

      const mensal = (kmMes / consumo) * precoCombustivel;
      write([
        'Gasto mensal: ' + money(mensal),
        'Gasto anual: ' + money(mensal * 12)
      ]);
      return;
    }

    if (type === 'custo-km') {
      const combustivel = number('combustivel');
      const manutencao = number('manutencao');
      const seguro = number('seguro');
      const km = number('km');

      if (km <= 0) {
        result.textContent = 'Informe km rodados maior que zero.';
        return;
      }

      const custoKm = (combustivel + manutencao + seguro) / km;
      write(['Custo por km: ' + money(custoKm)]);
      return;
    }

    if (type === 'viagem-carro' || type === 'combustivel-viagem') {
      const distancia = number('distancia');
      const consumo = number('consumo');
      const precoCombustivel = number('precoCombustivel');

      if (consumo <= 0) {
        result.textContent = 'Informe um consumo maior que zero.';
        return;
      }

      const total = (distancia / consumo) * precoCombustivel;
      write(['Custo total da viagem: ' + money(total)]);
      return;
    }

    if (type === 'carro-vs-uber') {
      const kmMes = number('kmMes');
      const uberKm = number('uberKm');
      const custoCarroMensal = number('custoCarroMensal');
      const custoUber = kmMes * uberKm;

      write([
        'Custo mensal de Uber: ' + money(custoUber),
        'Custo mensal do carro: ' + money(custoCarroMensal),
        custoUber < custoCarroMensal ? 'Resultado: Uber compensa mais neste cenario.' : 'Resultado: Carro proprio compensa mais neste cenario.'
      ]);
      return;
    }

    if (type === 'financiamento') {
      const valorCarro = number('valorCarro');
      const entrada = number('entrada');
      const taxaJuros = number('taxaJuros') / 100;
      const prazo = number('prazo');

      const principal = Math.max(valorCarro - entrada, 0);
      if (principal <= 0 || prazo <= 0) {
        result.textContent = 'Informe valores validos para valor financiado e prazo.';
        return;
      }

      const parcela = principal * (taxaJuros * Math.pow(1 + taxaJuros, prazo)) / (Math.pow(1 + taxaJuros, prazo) - 1);
      const custoTotal = parcela * prazo;

      write([
        'Parcela estimada: ' + money(parcela),
        'Custo total financiado: ' + money(custoTotal)
      ]);
      return;
    }

    if (type === 'depreciacao') {
      const precoCarro = number('precoCarro');
      const idade = number('idade');
      const categoria = document.getElementById('categoria') ? document.getElementById('categoria').value : 'popular';
      
      const kmAnual = number('kmAnual');
      
      const getRate = (age, cat, mil, scenario = 'real') => {
        let base = 0.10;
        if (age < 1) base = 0.18;
        else if (age < 3) base = 0.12;
        else if (age < 5) base = 0.09;
        else base = 0.06;

        if (cat === 'premium') base += 0.03;
        if (cat === 'suv') base += 0.01;
        if (cat === 'popular') base -= 0.01;

        if (mil > 25000) base += 0.04;
        else if (mil > 15000) base += 0.015;

        if (scenario === 'cons') return base * 0.7;
        if (scenario === 'aggr') return base * 1.35;
        return base;
      };

      const rateReal = getRate(idade, categoria, kmAnual, 'real');
      const rateCons = getRate(idade, categoria, kmAnual, 'cons');
      const rateAggr = getRate(idade, categoria, kmAnual, 'aggr');

      const perdaReal = precoCarro * rateReal;
      const valor1ano = precoCarro - perdaReal;
      const valor2anos = valor1ano * (1 - getRate(idade + 1, categoria));
      
      const wrap = document.getElementById('resultadoWrap');
      if (wrap) wrap.style.display = 'block';

      write([
        '<h3>Simulação para os Próximos 12 Meses:</h3>',
        `<strong>Perda de valor (1 ano):</strong> <span style='color: #ef4444'>- ${money(perdaReal)}</span>`,
        `<strong>Perda mensal média:</strong> ${money(perdaReal / 12)}`,
        `<strong>Valor estimado em 1 ano:</strong> ${money(valor1ano)}`,
        `<strong>Valor estimado em 2 anos:</strong> ${money(valor2anos)}`,
        '<hr style="border:0; border-top: 1px solid #e2e8f0; margin: 15px 0;">',
        '<h3>Cenários de Mercado:</h3>',
        `<p style="font-size: 0.9rem; margin-bottom: 5px;">🔹 <strong>Conservador:</strong> ${money(precoCarro * rateCons)} de perda (Mercado em alta)</p>`,
        `<p style="font-size: 0.9rem; margin-bottom: 5px;">🔹 <strong>Realista:</strong> ${money(perdaReal)} de perda (Padrão FIPE)</p>`,
        `<p style="font-size: 0.9rem;">🔹 <strong>Agressivo:</strong> ${money(precoCarro * rateAggr)} de perda (Crise/Baixa liquidez)</p>`
      ]);
      return;
    }

    if (type === 'custo-anual') {
      const seguro = number('seguro');
      const manutencao = number('manutencao');
      const combustivel = number('combustivel');
      const ipva = number('ipva');
      const total = seguro + manutencao + combustivel + ipva;

      write(['Custo anual estimado: ' + money(total)]);
      return;
    }

    if (type === 'custo-por-ano') {
      const precoCarro = number('precoCarro');
      const anos = number('anos');

      if (anos <= 0) {
        result.textContent = 'Informe anos de uso maior que zero.';
        return;
      }

      write(['Custo medio anual do ativo: ' + money(precoCarro / anos)]);
      return;
    }

    if (type === 'ipva') {
      const valorVenal = number('valorVenal');
      const estadoSelect = document.getElementById('estado');
      
      if (!estadoSelect || !estadoSelect.value) {
        result.textContent = 'Selecione um estado.';
        return;
      }
      
      const estadoPartes = estadoSelect.value.split('-');
      const aliquota = parseFloat(estadoPartes[1]) / 100;
      const ipvaCalculado = valorVenal * aliquota;
      
      write([
        'IPVA estimado: ' + money(ipvaCalculado)
      ]);
      return;
    }

    if (type === 'seguro-mensal') {
      const seguroAnual = number('seguroAnual');
      write(['Seguro mensal estimado: ' + money(seguroAnual / 12)]);
      return;
    }

    if (type === 'manutencao-anual') {
      const revisoes = number('revisoes');
      const custoPorRevisao = number('custoPorRevisao');
      const pneus = number('pneus');
      const total = revisoes * custoPorRevisao + pneus;
      write(['Custo anual de manutencao: ' + money(total)]);
      return;
    }

    if (type === 'troca-oleo') {
      const trocas = number('trocas');
      const custoTroca = number('custoTroca');
      write(['Custo anual com troca de oleo: ' + money(trocas * custoTroca)]);
      return;
    }

    if (type === 'viagem-com-pedagio') {
      const distancia = number('distancia');
      const consumo = number('consumo');
      const precoCombustivel = number('precoCombustivel');
      const pedagios = number('pedagios');

      if (consumo <= 0) {
        result.textContent = 'Informe um consumo maior que zero.';
        return;
      }

      const combustivel = (distancia / consumo) * precoCombustivel;
      write([
        'Combustivel: ' + money(combustivel),
        'Pedagios: ' + money(pedagios),
        'Custo total da viagem: ' + money(combustivel + pedagios)
      ]);
      return;
    }

    result.textContent = 'Calculadora nao configurada.';
  });
});
