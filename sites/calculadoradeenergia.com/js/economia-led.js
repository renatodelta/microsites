document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const qtdLampadas = Number(document.getElementById('qtdLampadas').value || 0);
    const potenciaAntiga = Number(document.getElementById('potenciaAntiga').value || 0);
    const potenciaLed = Number(document.getElementById('potenciaLed').value || 0);
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);

    const consumoAntigo = (qtdLampadas * potenciaAntiga * horasDia * 30) / 1000;
    const consumoLed = (qtdLampadas * potenciaLed * horasDia * 30) / 1000;
    const economiaKwh = Math.max(consumoAntigo - consumoLed, 0);
    const economiaReais = economiaKwh * tarifa;

    document.getElementById('resultado').textContent =
      'Economia estimada: ' + economiaKwh.toFixed(2) + ' kWh/mês | ' + moeda.format(economiaReais) + ' por mês';
  });
});
