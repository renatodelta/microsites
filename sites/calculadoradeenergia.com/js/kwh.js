document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const potencia = Number(document.getElementById('potencia').value || 0);
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const diasMes = Number(document.getElementById('diasMes').value || 0);

    const consumoDiaKwh = (potencia * horasDia) / 1000;
    const consumoMesKwh = consumoDiaKwh * diasMes;

    document.getElementById('resultado').textContent =
      'Consumo diário: ' + consumoDiaKwh.toFixed(2) + ' kWh | Consumo mensal: ' + consumoMesKwh.toFixed(2) + ' kWh';
  });
});
