document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const potencia = Number(document.getElementById('potencia').value || 0);
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const diasMes = Number(document.getElementById('diasMes').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);

    const consumoKwh = (potencia * horasDia * diasMes) / 1000;
    const custo = consumoKwh * tarifa;

    document.getElementById('resultado').textContent =
      'Consumo do ar: ' + consumoKwh.toFixed(2) + ' kWh/mês | Custo: ' + moeda.format(custo);
  });
});
