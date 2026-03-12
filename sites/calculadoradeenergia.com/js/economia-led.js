document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const qtdLampadas = Number(document.getElementById('qtdLampadas').value || 0);
    const potenciaAntiga = Number(document.getElementById('potenciaAntiga').value || 0);
    const potenciaLed = Number(document.getElementById('potenciaLed').value || 0);
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const diasMes = Number(document.getElementById('diasMes').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);
    const resultado = document.getElementById('resultado');

    if (
      qtdLampadas <= 0 ||
      potenciaAntiga <= 0 ||
      potenciaLed <= 0 ||
      horasDia <= 0 ||
      diasMes <= 0 ||
      tarifa <= 0
    ) {
      resultado.textContent = 'Preencha todos os campos com valores maiores que zero.';
      return;
    }

    const consumoAntigo = (qtdLampadas * potenciaAntiga * horasDia * diasMes) / 1000;
    const consumoLed = (qtdLampadas * potenciaLed * horasDia * diasMes) / 1000;
    const economiaKwh = Math.max(consumoAntigo - consumoLed, 0);
    const economiaReais = economiaKwh * tarifa;
    const economiaAnual = economiaReais * 12;

    if (potenciaLed >= potenciaAntiga) {
      resultado.textContent =
        'A potência informada para LED não gera economia. Revise os valores para comparar corretamente.';
      return;
    }

    resultado.textContent =
      'Consumo atual: ' + consumoAntigo.toFixed(2) +
      ' kWh/mês | Consumo com LED: ' + consumoLed.toFixed(2) +
      ' kWh/mês | Economia: ' + economiaKwh.toFixed(2) +
      ' kWh/mês (' + moeda.format(economiaReais) + '/mês e ' + moeda.format(economiaAnual) + '/ano)';
  });
});
