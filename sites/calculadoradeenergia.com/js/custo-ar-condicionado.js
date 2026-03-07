document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const capacidadeBtu = document.getElementById('capacidadeBtu');
  const tipoAparelho = document.getElementById('tipoAparelho');
  const pontosPotencia = [
    { btu: 9000, watts: 700 },
    { btu: 12000, watts: 1000 },
    { btu: 18000, watts: 1500 },
    { btu: 24000, watts: 2000 },
    { btu: 30000, watts: 2500 },
    { btu: 36000, watts: 3000 }
  ];

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function interpolarPotenciaPorBtu(btu) {
    if (btu <= 0) return 0;

    if (btu <= pontosPotencia[0].btu) {
      return (pontosPotencia[0].watts / pontosPotencia[0].btu) * btu;
    }

    const ultimo = pontosPotencia[pontosPotencia.length - 1];
    if (btu >= ultimo.btu) {
      return (ultimo.watts / ultimo.btu) * btu;
    }

    for (let i = 0; i < pontosPotencia.length - 1; i += 1) {
      const atual = pontosPotencia[i];
      const proximo = pontosPotencia[i + 1];

      if (btu >= atual.btu && btu <= proximo.btu) {
        const proporcao = (btu - atual.btu) / (proximo.btu - atual.btu);
        return atual.watts + (proximo.watts - atual.watts) * proporcao;
      }
    }

    return 0;
  }

  btn.addEventListener('click', function () {
    const btu = Number(capacidadeBtu.value || 0);
    const tipoSelecionado = tipoAparelho ? tipoAparelho.value : 'inverter';
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const diasMes = Number(document.getElementById('diasMes').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);
    const resultado = document.getElementById('resultado');

    if (btu <= 0 || horasDia <= 0 || diasMes <= 0 || tarifa <= 0) {
      resultado.textContent = 'Preencha capacidade em BTU, horas, dias e tarifa com valores maiores que zero.';
      return;
    }

    const potenciaWatts = interpolarPotenciaPorBtu(btu);
    const fatorTipo = tipoSelecionado === 'convencional' ? 1.25 : 1;
    const consumoHoraKwh = (potenciaWatts / 1000) * fatorTipo;
    const consumoMesKwh = consumoHoraKwh * horasDia * diasMes;
    const custoMes = consumoMesKwh * tarifa;
    const custoAno = custoMes * 12;
    const tipoLabel = tipoSelecionado === 'convencional' ? 'Convencional' : 'Inverter';

    resultado.innerHTML =
      'Tipo considerado: <strong>' + tipoLabel + '</strong><br>' +
      'Consumo por hora: <strong>' + consumoHoraKwh.toFixed(2) + ' kWh por hora</strong><br>' +
      'Consumo mensal: <strong>' + consumoMesKwh.toFixed(2) + ' kWh por mês</strong><br>' +
      'Custo mensal: <strong>' + moeda.format(custoMes) + '</strong><br>' +
      'Custo anual: <strong>' + moeda.format(custoAno) + '</strong>';
  });
});
