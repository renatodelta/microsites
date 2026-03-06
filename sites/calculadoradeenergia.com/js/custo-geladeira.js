document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const consumoDia = Number(document.getElementById('consumoDia').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);

    const consumoMesKwh = consumoDia * 30;
    const custo = consumoMesKwh * tarifa;

    document.getElementById('resultado').textContent =
      'Consumo da geladeira: ' + consumoMesKwh.toFixed(2) + ' kWh/mês | Custo: ' + moeda.format(custo);
  });
});
