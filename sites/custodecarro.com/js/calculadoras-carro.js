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
      const taxa = 0.12;
      const valorAtual = precoCarro * Math.pow(1 - taxa, idade);

      write(['Valor estimado atual: ' + money(Math.max(valorAtual, 0))]);
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
